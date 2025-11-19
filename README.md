# College SaaS - Learning Platform

A comprehensive SaaS application for colleges to manage students, assessments, DSA roadmaps, and progress tracking.

## 🚀 Features

- **Multi-tenant Architecture**: Each college has its own workspace
- **Role-Based Access Control**: 
  - **SuperAdmin (SaaS Owner)**: Manages all colleges and platform
  - **CollegeAdmin**: Manages their specific college
  - **Student**: Takes assessments and tracks progress
- **Assessment Management**: Create and manage MCQ-based assessments
- **DSA Roadmap**: Structured learning path for Data Structures and Algorithms
- **Progress Tracking**: Detailed analytics and progress monitoring
- **Modern UI**: Clean, responsive design inspired by modern SaaS platforms

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Axios
- Modern CSS with Inter font

### Backend
- Node.js + Express
- Supabase (PostgreSQL)
- JWT Authentication
- bcryptjs for password hashing

## 📋 Prerequisites

- Node.js 18+ and npm 9+
- Supabase account and project
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd "College SaaS"
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp env.example .env

# Edit .env with your Supabase credentials
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
# JWT_SECRET=your-secret-key

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment template
cp env.example .env

# Start development server
npm run dev
```

### 4. Database Setup

**For Development:**
1. Go to your Supabase SQL Editor
2. Run the schema: `backend/database/schema.sql` or `backend/database/setup-production.sql`
3. Both files create the same database structure

**For Production:**
- Use `backend/database/setup-production.sql` (recommended - includes all tables in one file)
- Or use `backend/database/schema.sql` (original schema file)
- The production database uses the exact same schema as development

### 5. Create First SuperAdmin

```bash
cd backend
npm run create-superadmin admin@example.com password123 "Admin Name"
```

### 6. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5001
- Health Check: http://localhost:5001/api/health

## 📁 Project Structure

```
College SaaS/
├── backend/
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── database/        # Database schemas and migrations
│   ├── scripts/         # Utility scripts
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── pages/       # React pages
│   │   ├── components/  # Reusable components
│   │   ├── services/    # API services
│   │   └── context/     # React context
│   └── vite.config.js   # Vite configuration
├── DEPLOYMENT.md        # Deployment guide (Render + Fly.io)
├── backend/
│   └── fly.toml         # Fly.io configuration
└── frontend/
    └── render.yaml      # Render configuration
```

## 🔐 Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=5001
JWT_SECRET=your-secret-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5001
VITE_NODE_ENV=development
```

## 🚢 Production Deployment

Deploy to production using **Render (Frontend)** and **Fly.io (Backend)**.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed step-by-step instructions.

### Quick Deploy

**Backend (Fly.io):**
```bash
cd backend
fly launch
fly secrets set JWT_SECRET=... SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... FRONTEND_URL=...
fly deploy
```

**Frontend (Render):**
1. Connect GitHub repo to Render
2. Set build command: `npm install && npm run build`
3. Set publish directory: `dist`
4. Add environment variable: `VITE_API_URL=https://your-api.fly.dev`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/student/signup` - Student signup
- `POST /api/auth/student/login` - Student login
- `POST /api/auth/superadmin/login` - SuperAdmin login
- `POST /api/auth/collegeadmin/login` - CollegeAdmin login

### Students
- `GET /api/students/profile` - Get student profile
- `GET /api/students/progress` - Get student progress

### Admin (CollegeAdmin)
- `GET /api/admin/students` - List students
- `GET /api/admin/admins` - List admins
- `POST /api/admin/admins` - Create admin
- `DELETE /api/admin/admins/:id` - Delete admin

### SuperAdmin
- `GET /api/superadmin/colleges` - List colleges
- `POST /api/superadmin/colleges` - Create college
- `DELETE /api/superadmin/colleges/:id` - Delete college
- `GET /api/superadmin/superadmins` - List super admins
- `POST /api/superadmin/superadmins` - Create super admin

### Assessments
- `GET /api/assessments` - List assessments
- `POST /api/assessments` - Create assessment
- `PUT /api/assessments/:id` - Update assessment
- `DELETE /api/assessments/:id` - Delete assessment

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Security headers
- Input validation
- Role-based access control

## 📖 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Step-by-step guide for Render + Fly.io deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

ISC

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Review the deployment guide
3. Check Supabase dashboard for database issues

## 🎯 Roadmap

- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Real-time notifications
- [ ] Export reports
- [ ] Bulk operations

---

Built with ❤️ for educational institutions
