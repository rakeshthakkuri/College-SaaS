import express from 'express';
import { supabase } from '../database/supabase.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get student profile
router.get('/profile', authenticateToken, requireRole(['STUDENT']), async (req, res) => {
  try {
    const { data: student, error } = await supabase
      .from('Student')
      .select('id, email, name, createdAt, College(id, name)')
      .eq('id', req.user.id)
      .single();

    if (error || !student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({
      id: student.id,
      email: student.email,
      name: student.name,
      createdAt: student.createdAt,
      college: student.College,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get student progress overview
router.get('/progress', authenticateToken, requireRole(['STUDENT']), async (req, res) => {
  try {
    const { data: progress, error: progressError } = await supabase
      .from('Progress')
      .select('*')
      .eq('studentId', req.user.id)
      .order('updatedAt', { ascending: false });

    const { data: attempts, error: attemptsError } = await supabase
      .from('AssessmentAttempt')
      .select('*, Assessment(id, title)')
      .eq('studentId', req.user.id)
      .order('completedAt', { ascending: false });

    if (progressError || attemptsError) {
      console.error('Error fetching progress:', progressError || attemptsError);
    }

    res.json({
      dsaProgress: progress || [],
      assessmentAttempts: (attempts || []).map(attempt => ({
        ...attempt,
        assessment: attempt.Assessment,
      })),
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
