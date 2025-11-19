-- Production Database Setup Script
-- Run this in your Supabase SQL Editor to set up the production database
-- This includes all tables, indexes, and triggers needed for the application
-- This script is idempotent - safe to run multiple times

-- ============================================
-- STEP 1: Create enum type for Role (if not exists)
-- ============================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role') THEN
        CREATE TYPE "Role" AS ENUM ('STUDENT', 'ADMIN', 'COLLEGE_ADMIN');
    END IF;
END $$;

-- ============================================
-- STEP 2: Create College table
-- ============================================
CREATE TABLE IF NOT EXISTS "College" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT UNIQUE NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- STEP 3: Create Student table
-- ============================================
CREATE TABLE IF NOT EXISTS "Student" (
    "id" TEXT PRIMARY KEY,
    "email" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "role" "Role" DEFAULT 'STUDENT',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE
);

-- ============================================
-- STEP 4: Create SuperAdmin table (SaaS Owner)
-- ============================================
CREATE TABLE IF NOT EXISTS "SuperAdmin" (
    "id" TEXT PRIMARY KEY,
    "email" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- STEP 5: Create CollegeAdmin table
-- ============================================
CREATE TABLE IF NOT EXISTS "CollegeAdmin" (
    "id" TEXT PRIMARY KEY,
    "email" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "role" "Role" DEFAULT 'COLLEGE_ADMIN',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE
);

-- ============================================
-- STEP 6: Create Admin table (for backward compatibility)
-- ============================================
CREATE TABLE IF NOT EXISTS "Admin" (
    "id" TEXT PRIMARY KEY,
    "email" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "role" "Role" DEFAULT 'COLLEGE_ADMIN',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE
);

-- ============================================
-- STEP 7: Create Assessment table
-- ============================================
CREATE TABLE IF NOT EXISTS "Assessment" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "collegeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE
);

-- ============================================
-- STEP 8: Create Question table
-- ============================================
CREATE TABLE IF NOT EXISTS "Question" (
    "id" TEXT PRIMARY KEY,
    "assessmentId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "correctAnswer" INTEGER NOT NULL,
    "points" INTEGER DEFAULT 1,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE
);

-- ============================================
-- STEP 9: Create AssessmentAttempt table
-- ============================================
CREATE TABLE IF NOT EXISTS "AssessmentAttempt" (
    "id" TEXT PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "score" INTEGER DEFAULT 0,
    "totalPoints" INTEGER DEFAULT 0,
    "completedAt" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE,
    FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE
);

-- ============================================
-- STEP 10: Create Answer table
-- ============================================
CREATE TABLE IF NOT EXISTS "Answer" (
    "id" TEXT PRIMARY KEY,
    "attemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedAnswer" INTEGER,
    "isCorrect" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("attemptId") REFERENCES "AssessmentAttempt"("id") ON DELETE CASCADE,
    FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE
);

-- ============================================
-- STEP 11: Create DSATopic table
-- ============================================
CREATE TABLE IF NOT EXISTS "DSATopic" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "difficulty" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- STEP 12: Create StudentProgress table
-- ============================================
CREATE TABLE IF NOT EXISTS "StudentProgress" (
    "id" TEXT PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "status" TEXT DEFAULT 'NOT_STARTED',
    "completedAt" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE,
    FOREIGN KEY ("topicId") REFERENCES "DSATopic"("id") ON DELETE CASCADE,
    UNIQUE("studentId", "topicId")
);

-- ============================================
-- STEP 13: Create indexes for better performance
-- ============================================
CREATE INDEX IF NOT EXISTS "Student_email_idx" ON "Student"("email");
CREATE INDEX IF NOT EXISTS "Student_collegeId_idx" ON "Student"("collegeId");
CREATE INDEX IF NOT EXISTS "SuperAdmin_email_idx" ON "SuperAdmin"("email");
CREATE INDEX IF NOT EXISTS "CollegeAdmin_email_idx" ON "CollegeAdmin"("email");
CREATE INDEX IF NOT EXISTS "CollegeAdmin_collegeId_idx" ON "CollegeAdmin"("collegeId");
CREATE INDEX IF NOT EXISTS "Admin_email_idx" ON "Admin"("email");
CREATE INDEX IF NOT EXISTS "Admin_collegeId_idx" ON "Admin"("collegeId");
CREATE INDEX IF NOT EXISTS "Assessment_collegeId_idx" ON "Assessment"("collegeId");
CREATE INDEX IF NOT EXISTS "Question_assessmentId_idx" ON "Question"("assessmentId");
CREATE INDEX IF NOT EXISTS "AssessmentAttempt_studentId_idx" ON "AssessmentAttempt"("studentId");
CREATE INDEX IF NOT EXISTS "AssessmentAttempt_assessmentId_idx" ON "AssessmentAttempt"("assessmentId");
CREATE INDEX IF NOT EXISTS "Answer_attemptId_idx" ON "Answer"("attemptId");
CREATE INDEX IF NOT EXISTS "Answer_questionId_idx" ON "Answer"("questionId");
CREATE INDEX IF NOT EXISTS "StudentProgress_studentId_idx" ON "StudentProgress"("studentId");
CREATE INDEX IF NOT EXISTS "StudentProgress_topicId_idx" ON "StudentProgress"("topicId");

-- ============================================
-- STEP 14: Create function to update updatedAt timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist (to avoid conflicts)
DROP TRIGGER IF EXISTS update_college_updated_at ON "College";
DROP TRIGGER IF EXISTS update_student_updated_at ON "Student";
DROP TRIGGER IF EXISTS update_superadmin_updated_at ON "SuperAdmin";
DROP TRIGGER IF EXISTS update_collegeadmin_updated_at ON "CollegeAdmin";
DROP TRIGGER IF EXISTS update_admin_updated_at ON "Admin";
DROP TRIGGER IF EXISTS update_assessment_updated_at ON "Assessment";
DROP TRIGGER IF EXISTS update_question_updated_at ON "Question";
DROP TRIGGER IF EXISTS update_assessmentattempt_updated_at ON "AssessmentAttempt";
DROP TRIGGER IF EXISTS update_dsatopic_updated_at ON "DSATopic";
DROP TRIGGER IF EXISTS update_studentprogress_updated_at ON "StudentProgress";

-- ============================================
-- STEP 15: Create triggers for updatedAt
-- ============================================
CREATE TRIGGER update_college_updated_at BEFORE UPDATE ON "College"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_updated_at BEFORE UPDATE ON "Student"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_superadmin_updated_at BEFORE UPDATE ON "SuperAdmin"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collegeadmin_updated_at BEFORE UPDATE ON "CollegeAdmin"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_updated_at BEFORE UPDATE ON "Admin"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessment_updated_at BEFORE UPDATE ON "Assessment"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_question_updated_at BEFORE UPDATE ON "Question"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessmentattempt_updated_at BEFORE UPDATE ON "AssessmentAttempt"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dsatopic_updated_at BEFORE UPDATE ON "DSATopic"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_studentprogress_updated_at BEFORE UPDATE ON "StudentProgress"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Setup Complete!
-- ============================================
-- Your database is now ready for production use.
-- 
-- If you got an error about "Role" already existing, that's okay!
-- The script is idempotent and will skip creating things that already exist.
-- 
-- Next steps:
-- 1. Create your first SuperAdmin using the script:
--    npm run create-superadmin admin@example.com password "Admin Name"
-- 2. Start using the application!
--
-- To completely reset the database (WARNING: deletes all data):
-- Run reset-database.sql first, then run this script again.

