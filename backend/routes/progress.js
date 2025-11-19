import express from 'express';
import { supabase, generateId } from '../database/supabase.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get DSA roadmap progress
router.get('/dsa', authenticateToken, requireRole(['STUDENT']), async (req, res) => {
  try {
    const { data: progress, error } = await supabase
      .from('Progress')
      .select('*')
      .eq('studentId', req.user.id)
      .order('updatedAt', { ascending: false });

    if (error) {
      console.error('Error fetching progress:', error);
      return res.status(500).json({ error: 'Failed to fetch progress' });
    }

    res.json(progress || []);
  } catch (error) {
    console.error('Get DSA progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update DSA topic progress
router.post('/dsa', authenticateToken, requireRole(['STUDENT']), async (req, res) => {
  try {
    const { topic, status, progress: progressValue } = req.body;

    if (!topic || !status) {
      return res.status(400).json({ error: 'Topic and status are required' });
    }

    // Check if progress exists
    const { data: existingProgress } = await supabase
      .from('Progress')
      .select('*')
      .eq('studentId', req.user.id)
      .eq('topic', topic)
      .single();

    let progress;
    if (existingProgress) {
      // Update existing
      const { data: updated, error: updateError } = await supabase
        .from('Progress')
        .update({
          status,
          progress: progressValue || 0,
        })
        .eq('id', existingProgress.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating progress:', updateError);
        return res.status(500).json({ error: 'Failed to update progress' });
      }
      progress = updated;
    } else {
      // Create new
      const progressId = generateId();
      const { data: created, error: createError } = await supabase
        .from('Progress')
        .insert({
          id: progressId,
          studentId: req.user.id,
          topic,
          status,
          progress: progressValue || 0,
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating progress:', createError);
        return res.status(500).json({ error: 'Failed to create progress' });
      }
      progress = created;
    }

    res.json(progress);
  } catch (error) {
    console.error('Update DSA progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
