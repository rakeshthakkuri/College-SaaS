import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { adminAPI, assessmentAPI } from '../services/api';
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAssessments: 0,
    totalAttempts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, assessmentsRes] = await Promise.all([
        adminAPI.getStudents(),
        assessmentAPI.getAll(),
      ]);

      const students = studentsRes.data;
      const assessments = assessmentsRes.data;

      // Calculate total attempts
      let totalAttempts = 0;
      assessments.forEach((assessment) => {
        totalAttempts += assessment._count.attempts || 0;
      });

      setStats({
        totalStudents: students.length,
        totalAssessments: assessments.length,
        totalAttempts,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="admin-dashboard">
        <div className="welcome-section">
          <h1>Admin Dashboard</h1>
          <p>Manage your college's learning platform</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Students</h3>
            <p className="stat-value">{stats.totalStudents}</p>
          </div>
          <div className="stat-card">
            <h3>Total Assessments</h3>
            <p className="stat-value">{stats.totalAssessments}</p>
          </div>
          <div className="stat-card">
            <h3>Total Attempts</h3>
            <p className="stat-value">{stats.totalAttempts}</p>
          </div>
        </div>

        <div className="quick-actions">
          <Link to="/admin/students" className="action-card">
            <h3>👥 View Students</h3>
            <p>Manage and view all students</p>
          </Link>
          <Link to="/admin/assessments" className="action-card">
            <h3>📝 Manage Assessments</h3>
            <p>Create and manage assessments</p>
          </Link>
          <Link to="/admin/admins" className="action-card">
            <h3>👤 Manage Admins</h3>
            <p>Add or remove admin users</p>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;

