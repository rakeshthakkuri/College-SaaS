# College SaaS - Learning Management Platform

A comprehensive SaaS application for colleges to manage student assessments, DSA roadmaps, and progress tracking.

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **API**: REST

## Features

### Student Features
- Student signup/login with college name
- Take MCQ-based assessments
- Track DSA roadmap progress
- View detailed progress analytics
- Student dashboard with overview

### Admin Features
- Admin login
- View all students in college
- View individual student progress
- Create and manage assessments
- Admin dashboard with statistics

## Project Structure

```
College SaaS/
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── students.js
│   │   ├── admin.js
│   │   ├── assessments.js
│   │   ├── progress.js
│   │   └── colleges.js
│   ├── database/
│   │   ├── supabase.js
│   │   └── schema.sql
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Supabase account (free tier works)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a Supabase project:
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Get your project URL and service role key from Settings → API

4. Create a `.env` file in the backend directory:
```env
SUPABASE_URL="https://your-project-ref.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=5000
NODE_ENV=development
```

5. Set up the database:
   - Go to Supabase SQL Editor
   - Copy and paste the contents of `backend/database/schema.sql`
   - Run the SQL to create all tables

6. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

For detailed Supabase setup instructions, see `backend/SUPABASE_SETUP.md`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

### College Onboarding

1. Create a college by making a POST request to `/api/colleges`:
```json
{
  "name": "Example College",
  "adminEmail": "admin@example.com",
  "adminPassword": "password123",
  "adminName": "Admin Name"
}
```

This will create a college that students can join using the college name.

### Student Signup

1. Go to the landing page
2. Click "Get Started as Student"
3. Fill in the signup form with:
   - Name
   - Email
   - Password
   - College Name (exact name as registered by admin)

### Admin Login

1. Go to the landing page
2. Click "Admin Login"
3. Use the admin credentials created during college onboarding

## API Endpoints

### Authentication
- `POST /api/auth/student/signup` - Student signup
- `POST /api/auth/student/login` - Student login
- `POST /api/auth/admin/login` - Admin login

### Students
- `GET /api/students/profile` - Get student profile
- `GET /api/students/progress` - Get student progress

### Admin
- `GET /api/admin/students` - Get all students
- `GET /api/admin/students/:studentId/progress` - Get student progress

### Assessments
- `GET /api/assessments` - Get all assessments
- `GET /api/assessments/:id` - Get assessment with questions
- `POST /api/assessments/:id/attempt` - Submit assessment attempt
- `POST /api/assessments` - Create assessment (Admin)
- `PUT /api/assessments/:id` - Update assessment (Admin)
- `DELETE /api/assessments/:id` - Delete assessment (Admin)

### Progress
- `GET /api/progress/dsa` - Get DSA progress
- `POST /api/progress/dsa` - Update DSA progress

### Colleges
- `POST /api/colleges` - Create college
- `GET /api/colleges/verify/:name` - Verify college name

## Database Schema

The application uses the following main models:
- **College**: College information
- **Student**: Student accounts
- **Admin**: Admin accounts
- **Assessment**: MCQ assessments
- **Question**: Assessment questions
- **AssessmentAttempt**: Student assessment attempts
- **Progress**: DSA roadmap progress

## Development

### Backend Development
- Use `npm run dev` for development with auto-reload
- Database is managed through Supabase dashboard
- Use Supabase SQL Editor to run queries or modify schema

### Frontend Development
- The frontend uses Vite for fast development
- Hot module replacement is enabled
- API proxy is configured to forward `/api` requests to the backend

## Production Deployment

1. Set `NODE_ENV=production` in backend `.env`
2. Build the frontend: `cd frontend && npm run build`
3. Serve the frontend build files using a static file server
4. Configure environment variables for production
5. Ensure Supabase project is set up and database schema is applied
6. Use Supabase's built-in hosting or deploy backend to a service like Railway, Render, or Heroku

## License

MIT

