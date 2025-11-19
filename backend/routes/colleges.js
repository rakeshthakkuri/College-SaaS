import express from 'express';
import { supabase } from '../database/supabase.js';

const router = express.Router();

// Create college endpoint removed - use /api/superadmin/colleges instead

// Get all colleges (public endpoint for signup)
router.get('/', async (req, res) => {
  try {
    const { data: colleges, error } = await supabase
      .from('College')
      .select('id, name')
      .order('name', { ascending: true });

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

// Verify college name (kept for backward compatibility if needed)
router.get('/verify/:name', async (req, res) => {
  try {
    const collegeName = decodeURIComponent(req.params.name);
    const { data: college, error } = await supabase
      .from('College')
      .select('id, name')
      .eq('name', collegeName)
      .single();

    if (error || !college) {
      return res.status(404).json({ error: 'College not found' });
    }

    res.json(college);
  } catch (error) {
    console.error('Verify college name error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
