# Role Structure Guide

## Overview

The system now has a clear separation between SaaS owner and college administrators:

### Roles

1. **ADMIN** (SuperAdmin) - SaaS Owner
   - Full access to all colleges
   - Can create/delete colleges
   - Can create other super admins
   - No collegeId (not tied to a specific college)

2. **COLLEGE_ADMIN** - College Administrator
   - Manages a specific college
   - Can manage students, assessments, and other college admins
   - Has a collegeId (tied to one college)

3. **STUDENT** - Student User
   - Can take assessments and track progress
   - Has a collegeId (belongs to one college)

## Database Tables

- **SuperAdmin**: SaaS owners (role = 'ADMIN')
- **CollegeAdmin**: College-specific admins (role = 'COLLEGE_ADMIN')
- **Admin**: Legacy table (kept for backward compatibility, will be migrated)

## API Endpoints

### SuperAdmin (SaaS Owner) Endpoints
- `POST /api/auth/superadmin/login` - Login as SaaS owner
- `GET /api/superadmin/colleges` - Get all colleges
- `POST /api/superadmin/colleges` - Create a new college
- `DELETE /api/superadmin/colleges/:id` - Delete a college
- `GET /api/superadmin/superadmins` - Get all super admins
- `POST /api/superadmin/superadmins` - Create a new super admin

### CollegeAdmin Endpoints
- `POST /api/auth/collegeadmin/login` - Login as college admin
- `POST /api/auth/admin/login` - Backward compatible (redirects to collegeadmin)
- `GET /api/admin/students` - Get students in college
- `GET /api/admin/admins` - Get college admins
- `POST /api/admin/admins` - Create college admin
- `DELETE /api/admin/admins/:id` - Delete college admin
- All assessment management endpoints

## Setup Instructions

### 1. Create First SuperAdmin (SaaS Owner)

You need to manually create the first super admin in the database:

```sql
-- In Supabase SQL Editor
INSERT INTO "SuperAdmin" ("id", "email", "password", "name", "role")
VALUES (
  'your-generated-id',
  'admin@saas.com',
  '$2a$10$hashedpassword', -- Use bcrypt to hash your password
  'SaaS Owner',
  'ADMIN'
);
```

Or use a script to create it via API after setting up the first super admin manually.

### 2. Login as SuperAdmin

- Go to `/admin/login` (will be updated to show superadmin login)
- Use super admin credentials
- You'll have access to create colleges

### 3. Create Colleges

As a super admin, you can create colleges via:
- API: `POST /api/superadmin/colleges`
- This automatically creates a college admin for that college

### 4. College Admins

College admins can:
- Login via `/admin/login` or `/collegeadmin/login`
- Manage their college's students, assessments, and admins
- Only see data for their specific college

## Migration

If you have an existing database:

1. Run `database/migration_add_roles.sql` in Supabase SQL Editor
2. This will:
   - Add COLLEGE_ADMIN role
   - Create SuperAdmin and CollegeAdmin tables
   - Migrate existing Admin records to CollegeAdmin
   - Set up indexes and triggers

## Frontend Updates Needed

The frontend needs to be updated to:
1. Show different login pages for SuperAdmin vs CollegeAdmin
2. Show different dashboards based on role
3. SuperAdmin dashboard should show college management
4. CollegeAdmin dashboard should show college-specific data

