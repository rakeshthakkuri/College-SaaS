import express from 'express';
import { supabase, generateId } from '../database/supabase.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Get all colleges (SaaS owner only)
router.get('/colleges', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { data: colleges, error } = await supabase
      .from('College')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching colleges:', error);
      return res.status(500).json({ error: 'Failed to fetch colleges' });
    }

    res.json(colleges || []);
  } catch (error) {
    console.error('Get colleges error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create college (SaaS owner only)
router.post('/colleges', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { name, adminEmail, adminPassword, adminName } = req.body;

    if (!name || !adminEmail || !adminPassword || !adminName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if college name already exists
    const { data: existingCollege } = await supabase
      .from('College')
      .select('*')
      .eq('name', name)
      .single();

    if (existingCollege) {
      return res.status(400).json({ error: 'College with this name already exists' });
    }

    // Hash admin password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const collegeId = generateId();
    const adminId = generateId();

    // Create college
    const { data: college, error: collegeError } = await supabase
      .from('College')
      .insert({
        id: collegeId,
        name,
      })
      .select()
      .single();

    if (collegeError) {
      console.error('Error creating college:', collegeError);
      return res.status(500).json({ error: 'Failed to create college' });
    }

    // Create college admin
    const { data: admin, error: adminError } = await supabase
      .from('CollegeAdmin')
      .insert({
        id: adminId,
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        collegeId: collegeId,
        role: 'COLLEGE_ADMIN',
      })
      .select()
      .single();

    if (adminError) {
      console.error('Error creating admin:', adminError);
      // Rollback college creation
      await supabase.from('College').delete().eq('id', collegeId);
      return res.status(500).json({ error: 'Failed to create admin' });
    }

    res.status(201).json({
      message: 'College created successfully',
      college: {
        id: college.id,
        name: college.name,
      },
    });
  } catch (error) {
    console.error('Create college error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete college (SaaS owner only)
router.delete('/colleges/:id', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    const { error: deleteError } = await supabase
      .from('College')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting college:', deleteError);
      return res.status(500).json({ error: 'Failed to delete college' });
    }

    res.json({ message: 'College deleted successfully' });
  } catch (error) {
    console.error('Delete college error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all super admins
router.get('/superadmins', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { data: superAdmins, error } = await supabase
      .from('SuperAdmin')
      .select('id, email, name, createdAt')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching super admins:', error);
      return res.status(500).json({ error: 'Failed to fetch super admins' });
    }

    res.json(superAdmins || []);
  } catch (error) {
    console.error('Get super admins error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create super admin
router.post('/superadmins', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if super admin already exists
    const { data: existingSuperAdmin } = await supabase
      .from('SuperAdmin')
      .select('*')
      .eq('email', email)
      .single();

    if (existingSuperAdmin) {
      return res.status(400).json({ error: 'Super admin with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdminId = generateId();

    const { data: superAdmin, error: superAdminError } = await supabase
      .from('SuperAdmin')
      .insert({
        id: superAdminId,
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN',
      })
      .select('id, email, name, createdAt')
      .single();

    if (superAdminError) {
      console.error('Error creating super admin:', superAdminError);
      return res.status(500).json({ error: 'Failed to create super admin' });
    }

    res.status(201).json({
      message: 'Super admin created successfully',
      superAdmin,
    });
  } catch (error) {
    console.error('Create super admin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete super admin (cannot delete yourself)
router.delete('/superadmins/:superAdminId', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { superAdminId } = req.params;

    if (superAdminId === req.user.id) {
      return res.status(400).json({ error: 'You cannot delete your own SuperAdmin account' });
    }

    const { data: superAdmin, error: superAdminError } = await supabase
      .from('SuperAdmin')
      .select('*')
      .eq('id', superAdminId)
      .single();

    if (superAdminError || !superAdmin) {
      return res.status(404).json({ error: 'SuperAdmin not found' });
    }

    const { error: deleteError } = await supabase
      .from('SuperAdmin')
      .delete()
      .eq('id', superAdminId);

    if (deleteError) {
      console.error('Error deleting super admin:', deleteError);
      return res.status(500).json({ error: 'Failed to delete super admin' });
    }

    res.json({ message: 'SuperAdmin deleted successfully' });
  } catch (error) {
    console.error('Delete super admin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

