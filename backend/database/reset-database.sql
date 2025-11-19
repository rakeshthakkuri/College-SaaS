-- Reset Database Script
-- WARNING: This will DELETE ALL DATA!
-- Only use this if you want to completely reset your database
-- Run this BEFORE setup-production.sql if you want a fresh start

-- Drop all tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS "StudentProgress" CASCADE;
DROP TABLE IF EXISTS "DSATopic" CASCADE;
DROP TABLE IF EXISTS "Answer" CASCADE;
DROP TABLE IF EXISTS "AssessmentAttempt" CASCADE;
DROP TABLE IF EXISTS "Question" CASCADE;
DROP TABLE IF EXISTS "Assessment" CASCADE;
DROP TABLE IF EXISTS "CollegeAdmin" CASCADE;
DROP TABLE IF EXISTS "Admin" CASCADE;
DROP TABLE IF EXISTS "SuperAdmin" CASCADE;
DROP TABLE IF EXISTS "Student" CASCADE;
DROP TABLE IF EXISTS "College" CASCADE;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Drop enum type
DROP TYPE IF EXISTS "Role" CASCADE;

-- Now you can run setup-production.sql to recreate everything

