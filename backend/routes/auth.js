import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase, generateId } from '../database/supabase.js';

const router = express.Router();

// Student signup
router.post('/student/signup', async (req, res) => {
  try {
    const { email, password, name, collegeName } = req.body;

    if (!email || !password || !name || !collegeName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Find college by name
    const { data: college, error: collegeError } = await supabase
      .from('College')
      .select('*')
      .eq('name', collegeName)
      .single();

    if (collegeError || !college) {
      return res.status(404).json({ error: 'College not found. Please check the college name.' });
    }

    // Check if student already exists
    const { data: existingStudent } = await supabase
      .from('Student')
      .select('*')
      .eq('email', email)
      .single();

    if (existingStudent) {
      return res.status(400).json({ error: 'Student already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student
    const studentId = generateId();
    const { data: student, error: studentError } = await supabase
      .from('Student')
      .insert({
        id: studentId,
        email,
        password: hashedPassword,
        name,
        collegeId: college.id,
        role: 'STUDENT',
      })
      .select('id, email, name, role, collegeId')
      .single();

    if (studentError) {
      console.error('Student creation error:', studentError);
      return res.status(500).json({ error: 'Failed to create student' });
    }

    // Generate token
    const token = jwt.sign(
      { id: student.id, email: student.email, role: student.role, collegeId: student.collegeId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Student registered successfully',
      token,
      user: student,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Student login
router.post('/student/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data: student, error: studentError } = await supabase
      .from('Student')
      .select('*, College(*)')
      .eq('email', email)
      .single();

    if (studentError || !student) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, student.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: student.id, email: student.email, role: student.role, collegeId: student.collegeId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...studentWithoutPassword } = student;

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: student.id,
        email: student.email,
        name: student.name,
        role: student.role,
        collegeId: student.collegeId,
        college: student.College,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// SuperAdmin login (SaaS Owner)
router.post('/superadmin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data: superAdmin, error: superAdminError } = await supabase
      .from('SuperAdmin')
      .select('*')
      .eq('email', email)
      .single();

    if (superAdminError || !superAdmin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, superAdmin.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: superAdmin.id, email: superAdmin.email, role: superAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: superAdmin.id,
        email: superAdmin.email,
        name: superAdmin.name,
        role: superAdmin.role,
      },
    });
  } catch (error) {
    console.error('SuperAdmin login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CollegeAdmin login
router.post('/collegeadmin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Try CollegeAdmin table first
    let admin = null;
    let adminError = null;

    const { data: collegeAdmin, error: collegeAdminError } = await supabase
      .from('CollegeAdmin')
      .select('*, College(*)')
      .eq('email', email)
      .single();

    if (collegeAdmin) {
      admin = collegeAdmin;
    } else {
      // Fallback to Admin table for backward compatibility
      const { data: oldAdmin, error: oldAdminError } = await supabase
        .from('Admin')
        .select('*, College(*)')
        .eq('email', email)
        .single();
      
      if (oldAdmin) {
        admin = oldAdmin;
      } else {
        adminError = collegeAdminError || oldAdminError;
      }
    }

    if (adminError || !admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role || 'COLLEGE_ADMIN', collegeId: admin.collegeId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role || 'COLLEGE_ADMIN',
        collegeId: admin.collegeId,
        college: admin.College,
      },
    });
  } catch (error) {
    console.error('CollegeAdmin login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Backward compatibility: Admin login (redirects to college admin)
router.post('/admin/login', async (req, res) => {
  // Call college admin login handler
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Try CollegeAdmin table first
  let admin = null;
  let adminError = null;

  const { data: collegeAdmin, error: collegeAdminError } = await supabase
    .from('CollegeAdmin')
    .select('*, College(*)')
    .eq('email', email)
    .single();

  if (collegeAdmin) {
    admin = collegeAdmin;
  } else {
    // Fallback to Admin table for backward compatibility
    const { data: oldAdmin, error: oldAdminError } = await supabase
      .from('Admin')
      .select('*, College(*)')
      .eq('email', email)
      .single();
    
    if (oldAdmin) {
      admin = oldAdmin;
    } else {
      adminError = collegeAdminError || oldAdminError;
    }
  }

  if (adminError || !admin) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isValidPassword = await bcrypt.compare(password, admin.password);

  if (!isValidPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role || 'COLLEGE_ADMIN', collegeId: admin.collegeId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role || 'COLLEGE_ADMIN',
      collegeId: admin.collegeId,
      college: admin.College,
    },
  });
});

export default router;
