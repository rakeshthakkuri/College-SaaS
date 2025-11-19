import express from 'express';
import { supabase, generateId } from '../database/supabase.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all assessments for student's college or all if super admin
router.get('/', authenticateToken, async (req, res) => {
  try {
    let query = supabase
      .from('Assessment')
      .select('*');
    
    // If not super admin, filter by college
    if (req.user.role !== 'ADMIN' && req.user.collegeId) {
      query = query.eq('collegeId', req.user.collegeId);
    }
    
    const { data: assessments, error } = await query.order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching assessments:', error);
      return res.status(500).json({ error: 'Failed to fetch assessments' });
    }

    if (!assessments || assessments.length === 0) {
      return res.json([]);
    }

    // Optimize: Get all counts in parallel using assessment IDs (fixes N+1 query problem)
    const assessmentIds = assessments.map(a => a.id);
    
    // Get all question counts in one query
    const { data: questionData } = await supabase
      .from('Question')
      .select('assessmentId')
      .in('assessmentId', assessmentIds);
    
    // Get all attempt counts in one query
    const { data: attemptData } = await supabase
      .from('AssessmentAttempt')
      .select('assessmentId')
      .in('assessmentId', assessmentIds);

    // Count occurrences
    const questionsCountMap = {};
    const attemptsCountMap = {};
    
    questionData?.forEach(q => {
      questionsCountMap[q.assessmentId] = (questionsCountMap[q.assessmentId] || 0) + 1;
    });
    
    attemptData?.forEach(a => {
      attemptsCountMap[a.assessmentId] = (attemptsCountMap[a.assessmentId] || 0) + 1;
    });

    // Map counts to assessments
    const assessmentsWithCounts = assessments.map(assessment => ({
      ...assessment,
      _count: {
        questions: questionsCountMap[assessment.id] || 0,
        attempts: attemptsCountMap[assessment.id] || 0,
      },
    }));

    res.json(assessmentsWithCounts);
  } catch (error) {
    console.error('Get assessments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get assessment with questions (for attempting)
router.get('/:id', authenticateToken, requireRole(['STUDENT']), async (req, res) => {
  try {
    const { data: assessment, error: assessmentError } = await supabase
      .from('Assessment')
      .select('*')
      .eq('id', req.params.id)
      .eq('collegeId', req.user.collegeId)
      .single();

    if (assessmentError || !assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    const { data: questions, error: questionsError } = await supabase
      .from('Question')
      .select('id, question, optionA, optionB, optionC, optionD, points')
      .eq('assessmentId', assessment.id);

    if (questionsError) {
      console.error('Error fetching questions:', questionsError);
    }

    res.json({
      ...assessment,
      questions: questions || [],
    });
  } catch (error) {
    console.error('Get assessment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit assessment attempt
router.post('/:id/attempt', authenticateToken, requireRole(['STUDENT']), async (req, res) => {
  try {
    const { answers } = req.body; // { questionId: 'A' | 'B' | 'C' | 'D' }

    const { data: assessment, error: assessmentError } = await supabase
      .from('Assessment')
      .select('*')
      .eq('id', req.params.id)
      .eq('collegeId', req.user.collegeId)
      .single();

    if (assessmentError || !assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    const { data: questions, error: questionsError } = await supabase
      .from('Question')
      .select('*')
      .eq('assessmentId', assessment.id);

    if (questionsError || !questions) {
      return res.status(500).json({ error: 'Failed to fetch questions' });
    }

    // Calculate score
    let score = 0;
    let totalPoints = 0;

    questions.forEach((question) => {
      totalPoints += question.points;
      const studentAnswer = answers[question.id];
      if (studentAnswer === question.correctAnswer) {
        score += question.points;
      }
    });

    // Save attempt
    const attemptId = generateId();
    const { data: attempt, error: attemptError } = await supabase
      .from('AssessmentAttempt')
      .insert({
        id: attemptId,
        studentId: req.user.id,
        assessmentId: assessment.id,
        score,
        totalPoints,
        answers,
      })
      .select('*, Assessment(id, title)')
      .single();

    if (attemptError) {
      console.error('Error saving attempt:', attemptError);
      return res.status(500).json({ error: 'Failed to save attempt' });
    }

    res.json({
      message: 'Assessment submitted successfully',
      attempt: {
        ...attempt,
        assessment: attempt.Assessment,
      },
      score,
      totalPoints,
      percentage: Math.round((score / totalPoints) * 100),
    });
  } catch (error) {
    console.error('Submit assessment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Create assessment
router.post('/', authenticateToken, requireRole(['COLLEGE_ADMIN']), async (req, res) => {
  try {
    const { title, description, questions, collegeId } = req.body;

    if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Title and at least one question are required' });
    }

    // Use provided collegeId or user's collegeId
    const targetCollegeId = collegeId || req.user.collegeId;
    
    if (!targetCollegeId) {
      return res.status(400).json({ error: 'College ID is required' });
    }

    const assessmentId = generateId();
    
    // Create assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from('Assessment')
      .insert({
        id: assessmentId,
        title,
        description,
        collegeId: targetCollegeId,
      })
      .select()
      .single();

    if (assessmentError) {
      console.error('Error creating assessment:', assessmentError);
      return res.status(500).json({ error: 'Failed to create assessment' });
    }

    // Create questions
    const questionsToInsert = questions.map((q) => ({
      id: generateId(),
      assessmentId,
      question: q.question,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctAnswer: q.correctAnswer,
      points: q.points || 1,
    }));

    const { data: createdQuestions, error: questionsError } = await supabase
      .from('Question')
      .insert(questionsToInsert)
      .select();

    if (questionsError) {
      console.error('Error creating questions:', questionsError);
      // Rollback assessment if questions fail
      await supabase.from('Assessment').delete().eq('id', assessmentId);
      return res.status(500).json({ error: 'Failed to create questions' });
    }

    res.status(201).json({
      ...assessment,
      questions: createdQuestions,
    });
  } catch (error) {
    console.error('Create assessment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Update assessment
router.put('/:id', authenticateToken, requireRole(['COLLEGE_ADMIN']), async (req, res) => {
  try {
    const { title, description } = req.body;

    const { data: assessment, error: assessmentError } = await supabase
      .from('Assessment')
      .select('*')
      .eq('id', req.params.id)
      .eq('collegeId', req.user.collegeId)
      .single();

    if (assessmentError || !assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    const { data: updated, error: updateError } = await supabase
      .from('Assessment')
      .update({ title, description })
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating assessment:', updateError);
      return res.status(500).json({ error: 'Failed to update assessment' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Update assessment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Delete assessment
router.delete('/:id', authenticateToken, requireRole(['COLLEGE_ADMIN']), async (req, res) => {
  try {
    const { data: assessment, error: assessmentError } = await supabase
      .from('Assessment')
      .select('*')
      .eq('id', req.params.id)
      .eq('collegeId', req.user.collegeId)
      .single();

    if (assessmentError || !assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    const { error: deleteError } = await supabase
      .from('Assessment')
      .delete()
      .eq('id', req.params.id);

    if (deleteError) {
      console.error('Error deleting assessment:', deleteError);
      return res.status(500).json({ error: 'Failed to delete assessment' });
    }

    res.json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    console.error('Delete assessment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
