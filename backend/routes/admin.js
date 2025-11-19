import express from 'express';
import { supabase, generateId } from '../database/supabase.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Get all students in college
router.get('/students', authenticateToken, requireRole(['COLLEGE_ADMIN']), async (req, res) => {
  try {
    const { data: students, error } = await supabase
      .from('Student')
      .select('id, email, name, createdAt')
      .eq('collegeId', req.user.collegeId)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching students:', error);
      return res.status(500).json({ error: 'Failed to fetch students' });
    }

    // Get counts for each student
    const studentsWithCounts = await Promise.all(
      (students || []).map(async (student) => {
        const { count: attemptsCount } = await supabase
          .from('AssessmentAttempt')
          .select('*', { count: 'exact', head: true })
          .eq('studentId', student.id);

        const { count: progressCount } = await supabase
          .from('Progress')
          .select('*', { count: 'exact', head: true })
          .eq('studentId', student.id);

        return {
          ...student,
          _count: {
            assessmentAttempts: attemptsCount || 0,
            progress: progressCount || 0,
          },
        };
      })
    );

    res.json(studentsWithCounts);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific student progress
router.get('/students/:studentId/progress', authenticateToken, requireRole(['COLLEGE_ADMIN']), async (req, res) => {
  try {
    const { studentId } = req.params;

    // Verify student belongs to admin's college
    const { data: student, error: studentError } = await supabase
      .from('Student')
      .select('id, email, name')
      .eq('id', studentId)
      .eq('collegeId', req.user.collegeId)
      .single();

    if (studentError || !student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const { data: progress, error: progressError } = await supabase
      .from('Progress')
      .select('*')
      .eq('studentId', studentId)
      .order('updatedAt', { ascending: false });

    const { data: attempts, error: attemptsError } = await supabase
      .from('AssessmentAttempt')
      .select('*, Assessment(id, title)')
      .eq('studentId', studentId)
      .order('completedAt', { ascending: false });

    if (progressError || attemptsError) {
      console.error('Error fetching progress:', progressError || attemptsError);
    }

    res.json({
      student,
      dsaProgress: progress || [],
      assessmentAttempts: (attempts || []).map(attempt => ({
        ...attempt,
        assessment: attempt.Assessment,
      })),
    });
  } catch (error) {
    console.error('Get student progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all admins in college
router.get('/admins', authenticateToken, requireRole(['COLLEGE_ADMIN']), async (req, res) => {
  try {
    // Get from both CollegeAdmin and Admin (for backward compatibility)
    const { data: collegeAdmins } = await supabase
      .from('CollegeAdmin')
      .select('id, email, name, createdAt')
      .eq('collegeId', req.user.collegeId)
      .order('createdAt', { ascending: false });

    const { data: oldAdmins } = await supabase
      .from('Admin')
      .select('id, email, name, createdAt')
      .eq('collegeId', req.user.collegeId)
      .order('createdAt', { ascending: false });

    const admins = [...(collegeAdmins || []), ...(oldAdmins || [])];

    res.json(admins || []);
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new admin
router.post('/admins', authenticateToken, requireRole(['COLLEGE_ADMIN']), async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if admin email already exists
    const { data: existingAdmin } = await supabase
      .from('Admin')
      .select('*')
      .eq('email', email)
      .single();

    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const adminId = generateId();

    // Create college admin for the same college
    const { data: admin, error: adminError } = await supabase
      .from('CollegeAdmin')
      .insert({
        id: adminId,
        email,
        password: hashedPassword,
        name,
        collegeId: req.user.collegeId,
        role: 'COLLEGE_ADMIN',
      })
      .select('id, email, name, createdAt')
      .single();

    if (adminError) {
      console.error('Error creating admin:', adminError);
      return res.status(500).json({ error: 'Failed to create admin' });
    }

    res.status(201).json({
      message: 'Admin created successfully',
      admin,
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete admin (cannot delete yourself)
router.delete('/admins/:adminId', authenticateToken, requireRole(['COLLEGE_ADMIN']), async (req, res) => {
  try {
    const { adminId } = req.params;

    // Prevent self-deletion
    if (adminId === req.user.id) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }

    // Verify admin belongs to the same college
    const { data: admin, error: adminError } = await supabase
      .from('CollegeAdmin')
      .select('*')
      .eq('id', adminId)
      .eq('collegeId', req.user.collegeId)
      .single();

    if (adminError || !admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Delete admin
    const { error: deleteError } = await supabase
      .from('CollegeAdmin')
      .delete()
      .eq('id', adminId);

    if (deleteError) {
      console.error('Error deleting admin:', deleteError);
      return res.status(500).json({ error: 'Failed to delete admin' });
    }

    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
