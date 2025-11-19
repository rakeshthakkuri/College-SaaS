import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import StudentSignup from './pages/StudentSignup';
import StudentLogin from './pages/StudentLogin';
import AdminLogin from './pages/AdminLogin';
import SuperAdminLogin from './pages/SuperAdminLogin';
import StudentDashboard from './pages/StudentDashboard';
import DSARoadmap from './pages/DSARoadmap';
import Assessments from './pages/Assessments';
import AttemptAssessment from './pages/AttemptAssessment';
import ProgressOverview from './pages/ProgressOverview';
import AdminDashboard from './pages/AdminDashboard';
import AdminStudents from './pages/AdminStudents';
import AdminStudentProgress from './pages/AdminStudentProgress';
import ManageAssessments from './pages/ManageAssessments';
import ManageAdmins from './pages/ManageAdmins';
import SuperAdminDashboard from './pages/SuperAdminDashboard';

function PrivateRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/student/signup" element={<StudentSignup />} />
      <Route path="/student/login" element={<StudentLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/superadmin/login" element={<SuperAdminLogin />} />
      
      <Route
        path="/student/dashboard"
        element={
          <PrivateRoute allowedRoles={['STUDENT']}>
            <StudentDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/dsa-roadmap"
        element={
          <PrivateRoute allowedRoles={['STUDENT']}>
            <DSARoadmap />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/assessments"
        element={
          <PrivateRoute allowedRoles={['STUDENT']}>
            <Assessments />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/assessments/:id/attempt"
        element={
          <PrivateRoute allowedRoles={['STUDENT']}>
            <AttemptAssessment />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/progress"
        element={
          <PrivateRoute allowedRoles={['STUDENT']}>
            <ProgressOverview />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute allowedRoles={['COLLEGE_ADMIN']}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <PrivateRoute allowedRoles={['COLLEGE_ADMIN']}>
            <AdminStudents />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/students/:studentId/progress"
        element={
          <PrivateRoute allowedRoles={['COLLEGE_ADMIN']}>
            <AdminStudentProgress />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/assessments"
        element={
          <PrivateRoute allowedRoles={['COLLEGE_ADMIN']}>
            <ManageAssessments />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/admins"
        element={
          <PrivateRoute allowedRoles={['COLLEGE_ADMIN']}>
            <ManageAdmins />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/superadmin/dashboard"
        element={
          <PrivateRoute allowedRoles={['ADMIN']}>
            <SuperAdminDashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;

