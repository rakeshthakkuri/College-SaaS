-- Migration script to add new role structure
-- Run each step separately in Supabase SQL Editor
-- PostgreSQL requires enum values to be committed before use

-- ============================================
-- STEP 1: Add new role to enum
-- Run this FIRST and wait for it to complete
-- ============================================
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'COLLEGE_ADMIN';

-- ============================================
-- STEP 2: Create SuperAdmin table
-- Run this AFTER Step 1 completes
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
-- STEP 3: Create CollegeAdmin table
-- Run this AFTER Step 1 completes
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
-- STEP 4: Create indexes
-- Run this AFTER Step 2 and 3 complete
-- ============================================
CREATE INDEX IF NOT EXISTS "SuperAdmin_email_idx" ON "SuperAdmin"("email");
CREATE INDEX IF NOT EXISTS "CollegeAdmin_collegeId_idx" ON "CollegeAdmin"("collegeId");
CREATE INDEX IF NOT EXISTS "CollegeAdmin_email_idx" ON "CollegeAdmin"("email");

-- ============================================
-- STEP 5: Create triggers
-- Run this AFTER Step 2 and 3 complete
-- ============================================
DROP TRIGGER IF EXISTS update_superadmin_updated_at ON "SuperAdmin";
CREATE TRIGGER update_superadmin_updated_at BEFORE UPDATE ON "SuperAdmin"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_collegeadmin_updated_at ON "CollegeAdmin";
CREATE TRIGGER update_collegeadmin_updated_at BEFORE UPDATE ON "CollegeAdmin"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STEP 6: Migrate existing Admin records (Optional)
-- Run this if you have existing Admin records to migrate
-- ============================================
INSERT INTO "CollegeAdmin" ("id", "email", "password", "name", "collegeId", "role", "createdAt", "updatedAt")
SELECT "id", "email", "password", "name", "collegeId", 'COLLEGE_ADMIN'::"Role", "createdAt", "updatedAt"
FROM "Admin"
WHERE NOT EXISTS (
    SELECT 1 FROM "CollegeAdmin" WHERE "CollegeAdmin"."id" = "Admin"."id"
);

