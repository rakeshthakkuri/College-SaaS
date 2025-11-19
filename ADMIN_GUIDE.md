# Admin Guide - Role Structure

## Role Overview

The system has two types of administrators:

### 1. **ADMIN (SuperAdmin)** - SaaS Owner
- Full access to all colleges
- Can create and delete colleges
- Can create other super admins
- Not tied to any specific college

### 2. **COLLEGE_ADMIN** - College Administrator  
- Manages a specific college
- Can manage students, assessments, and other college admins
- Only sees data for their college

## How to Login

### SuperAdmin (SaaS Owner) Login

1. **First, create a SuperAdmin account** (one-time setup):
   - You need to manually insert a super admin in the database
   - Or use the API after creating the first one

2. **Login**:
   - Endpoint: `POST /api/auth/superadmin/login`
   - Use your super admin email and password
   - You'll have access to create colleges

### CollegeAdmin Login

1. **College Admin is created automatically** when a college is created
2. **Login**:
   - Go to landing page → Click "Admin Login"
   - Or use: `POST /api/auth/collegeadmin/login`
   - Or use: `POST /api/auth/admin/login` (backward compatible)
   - Use the credentials provided when the college was created

## Creating Your First SuperAdmin

### Option 1: Using SQL (Recommended for first setup)

Run this in Supabase SQL Editor:

```sql
-- Generate a random ID (or use your own)
-- Hash your password using bcrypt (you can use online tools or Node.js)
INSERT INTO "SuperAdmin" ("id", "email", "password", "name", "role")
VALUES (
  'saas-owner-001', -- Replace with generated ID
  'admin@saas.com', -- Your email
  '$2a$10$YourHashedPasswordHere', -- Bcrypt hashed password
  'SaaS Owner',
  'ADMIN'
);
```

### Option 2: Using Node.js Script

Create a temporary script to hash password and insert:

```javascript
import bcrypt from 'bcryptjs';
import { supabase, generateId } from './database/supabase.js';

const password = 'your-password';
const hashedPassword = await bcrypt.hash(password, 10);

const { data, error } = await supabase
  .from('SuperAdmin')
  .insert({
    id: generateId(),
    email: 'admin@saas.com',
    password: hashedPassword,
    name: 'SaaS Owner',
    role: 'ADMIN'
  });
```

## Creating Colleges

### As SuperAdmin:

1. **Login as SuperAdmin**
2. **Create a college** via API:
   ```bash
   POST /api/superadmin/colleges
   {
     "name": "Example College",
     "adminEmail": "collegeadmin@example.com",
     "adminPassword": "password123",
     "adminName": "College Admin Name"
   }
   ```
3. This creates:
   - The college
   - A CollegeAdmin account for that college

### The CollegeAdmin can then:
- Login with the credentials you provided
- Manage students, assessments, and create more college admins

## Managing College Admins

College admins can create additional college admins:

1. Login as a college admin
2. Go to "Manage Admins" page
3. Click "+ Add Admin"
4. Fill in the form and create

## API Endpoints Summary

### SuperAdmin Endpoints
- `POST /api/auth/superadmin/login` - Login
- `GET /api/superadmin/colleges` - List all colleges
- `POST /api/superadmin/colleges` - Create college
- `DELETE /api/superadmin/colleges/:id` - Delete college
- `GET /api/superadmin/superadmins` - List super admins
- `POST /api/superadmin/superadmins` - Create super admin

### CollegeAdmin Endpoints
- `POST /api/auth/collegeadmin/login` - Login
- `POST /api/auth/admin/login` - Login (backward compatible)
- `GET /api/admin/students` - List students
- `GET /api/admin/admins` - List college admins
- `POST /api/admin/admins` - Create college admin
- `DELETE /api/admin/admins/:id` - Delete college admin
- All assessment management endpoints

## Migration

If you have an existing database, run:
- `backend/database/migration_add_roles.sql` in Supabase SQL Editor

This will:
- Add the new role structure
- Create SuperAdmin and CollegeAdmin tables
- Migrate existing Admin records to CollegeAdmin
