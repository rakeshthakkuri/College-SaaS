-- Create enum type for Role
CREATE TYPE "Role" AS ENUM ('STUDENT', 'ADMIN', 'COLLEGE_ADMIN');

-- Create College table
CREATE TABLE IF NOT EXISTS "College" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT UNIQUE NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Student table
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

-- Create SuperAdmin table (SaaS Owner)
CREATE TABLE IF NOT EXISTS "SuperAdmin" (
    "id" TEXT PRIMARY KEY,
    "email" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create CollegeAdmin table (College-specific admins)
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

-- Keep Admin table for backward compatibility (will be migrated to CollegeAdmin)
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

-- Create Assessment table
CREATE TABLE IF NOT EXISTS "Assessment" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "collegeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE
);

-- Create Question table
CREATE TABLE IF NOT EXISTS "Question" (
    "id" TEXT PRIMARY KEY,
    "assessmentId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "optionA" TEXT NOT NULL,
    "optionB" TEXT NOT NULL,
    "optionC" TEXT NOT NULL,
    "optionD" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "points" INTEGER DEFAULT 1,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE
);

-- Create AssessmentAttempt table
CREATE TABLE IF NOT EXISTS "AssessmentAttempt" (
    "id" TEXT PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "score" INTEGER DEFAULT 0,
    "totalPoints" INTEGER NOT NULL,
    "completedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "answers" JSONB NOT NULL,
    FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE,
    FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE
);

-- Create Progress table
CREATE TABLE IF NOT EXISTS "Progress" (
    "id" TEXT PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "progress" INTEGER DEFAULT 0,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE,
    UNIQUE ("studentId", "topic")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "Student_collegeId_idx" ON "Student"("collegeId");
CREATE INDEX IF NOT EXISTS "Student_email_idx" ON "Student"("email");
CREATE INDEX IF NOT EXISTS "SuperAdmin_email_idx" ON "SuperAdmin"("email");
CREATE INDEX IF NOT EXISTS "CollegeAdmin_collegeId_idx" ON "CollegeAdmin"("collegeId");
CREATE INDEX IF NOT EXISTS "CollegeAdmin_email_idx" ON "CollegeAdmin"("email");
CREATE INDEX IF NOT EXISTS "Admin_collegeId_idx" ON "Admin"("collegeId");
CREATE INDEX IF NOT EXISTS "Admin_email_idx" ON "Admin"("email");
CREATE INDEX IF NOT EXISTS "Assessment_collegeId_idx" ON "Assessment"("collegeId");
CREATE INDEX IF NOT EXISTS "Question_assessmentId_idx" ON "Question"("assessmentId");
CREATE INDEX IF NOT EXISTS "AssessmentAttempt_studentId_idx" ON "AssessmentAttempt"("studentId");
CREATE INDEX IF NOT EXISTS "AssessmentAttempt_assessmentId_idx" ON "AssessmentAttempt"("assessmentId");
CREATE INDEX IF NOT EXISTS "Progress_studentId_idx" ON "Progress"("studentId");

-- Create function to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updatedAt
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

CREATE TRIGGER update_progress_updated_at BEFORE UPDATE ON "Progress"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

