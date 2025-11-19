# Database Setup

This directory contains the database schema and migration scripts for the College SaaS application.

## Files

- **`setup-production.sql`** - Complete production setup script (recommended)
  - Includes all tables, indexes, triggers in one file
  - Ready to run in Supabase SQL Editor
  - **Idempotent** - safe to run multiple times
  - Use this for both development and production

- **`reset-database.sql`** - Reset script (use with caution!)
  - Drops all tables and data
  - Only use if you want to completely start fresh
  - Run this BEFORE setup-production.sql if resetting

- **`schema.sql`** - Original schema file
  - Same structure as setup-production.sql
  - Can be used as an alternative

- **`migration_remove_code.sql`** - Migration to remove college code column
  - Only needed if upgrading from an older version

- **`migration_add_roles.sql`** - Migration to add COLLEGE_ADMIN role
  - Only needed if upgrading from an older version

## Quick Setup

### For New Database (Development or Production)

1. Open Supabase SQL Editor
2. Copy and paste the entire contents of `setup-production.sql`
3. Run the script
4. Done! Your database is ready.

**Note:** If you get an error about "Role already exists", that's normal if you've run the script before. The script is idempotent and will skip creating things that already exist. You can safely continue or re-run the script.

### To Reset Database (Deletes All Data!)

1. Open Supabase SQL Editor
2. Run `reset-database.sql` first (this deletes everything)
3. Then run `setup-production.sql` to recreate everything
4. **Warning:** This will delete all your data!

### Database Structure

The database includes:

- **College** - College information
- **Student** - Student accounts
- **SuperAdmin** - SaaS owner accounts
- **CollegeAdmin** - College-specific admin accounts
- **Admin** - Legacy admin table (for backward compatibility)
- **Assessment** - Assessments/tests
- **Question** - Assessment questions
- **AssessmentAttempt** - Student assessment attempts
- **Answer** - Student answers
- **DSATopic** - DSA roadmap topics
- **StudentProgress** - Student progress tracking

All tables include:
- Proper foreign key relationships
- Indexes for performance
- Automatic `updatedAt` triggers
- Cascade delete for data integrity

## Notes

- Production and development use the **same database schema**
- No schema differences between environments
- All migrations are backward compatible
- The `setup-production.sql` file is the recommended way to set up a new database

