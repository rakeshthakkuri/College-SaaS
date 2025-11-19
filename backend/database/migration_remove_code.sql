-- Migration script to remove college code column
-- Run this in Supabase SQL Editor if you already have the database set up

-- Remove the code column from College table
ALTER TABLE "College" DROP COLUMN IF EXISTS "code";

-- Make name unique if not already
ALTER TABLE "College" ADD CONSTRAINT "College_name_key" UNIQUE ("name");

