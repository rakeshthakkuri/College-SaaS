import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { superAdminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './SuperAdminDashboard.css';

function SuperAdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('colleges'); // 'colleges' or 'superadmins'
  const [colleges, setColleges] = useState([]);
  const [superAdmins, setSuperAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCollegeForm, setShowCollegeForm] = useState(false);
  const [showSuperAdminForm, setShowSuperAdminForm] = useState(false);
  const [collegeFormData, setCollegeFormData] = useState({
    name: '',
    adminEmail: '',
    adminPassword: '',
    adminName: '',
  });
  const [superAdminFormData, setSuperAdminFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [collegesRes, superAdminsRes] = await Promise.all([
        superAdminAPI.getColleges(),
        superAdminAPI.getSuperAdmins(),
      ]);

      setColleges(collegesRes.data || []);
      setSuperAdmins(superAdminsRes.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCollegeInputChange = (e) => {
    setCollegeFormData({ ...collegeFormData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSuperAdminInputChange = (e) => {
    setSuperAdminFormData({ ...superAdminFormData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleCreateCollege = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await superAdminAPI.createCollege(collegeFormData);
      setCollegeFormData({ name: '', adminEmail: '', adminPassword: '', adminName: '' });
      setShowCollegeForm(false);
      fetchData();
      alert('College created successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create college');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateSuperAdmin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await superAdminAPI.createSuperAdmin(superAdminFormData);
      setSuperAdminFormData({ name: '', email: '', password: '' });
      setShowSuperAdminForm(false);
      fetchData();
      alert('Super Admin created successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create super admin');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCollege = async (collegeId) => {
    if (!window.confirm('Are you sure you want to delete this college? This will also delete all associated students, admins, and assessments.')) {
      return;
    }

    try {
      await superAdminAPI.deleteCollege(collegeId);
      fetchData();
      alert('College deleted successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete college');
    }
  };

  const handleDeleteSuperAdmin = async (superAdminId) => {
    if (superAdminId === user?.id) {
      alert('You cannot delete your own account');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this super admin?')) {
      return;
    }

    try {
      await superAdminAPI.deleteSuperAdmin(superAdminId);
      fetchData();
      alert('Super Admin deleted successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete super admin');
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="SaaS Owner Dashboard">
        <div className="loading">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="SaaS Owner Dashboard">
      <div className="superadmin-dashboard">
        <div className="welcome-section">
          <h1>SaaS Owner Dashboard</h1>
          <p>Manage all colleges and platform settings</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Colleges</h3>
            <p className="stat-value">{colleges.length}</p>
          </div>
          <div className="stat-card">
            <h3>Super Admins</h3>
            <p className="stat-value">{superAdmins.length}</p>
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'colleges' ? 'active' : ''}`}
            onClick={() => setActiveTab('colleges')}
          >
            Manage Colleges
          </button>
          <button
            className={`tab ${activeTab === 'superadmins' ? 'active' : ''}`}
            onClick={() => setActiveTab('superadmins')}
          >
            Manage Super Admins
          </button>
        </div>

        {activeTab === 'colleges' && (
          <div className="tab-content">
            <div className="page-header">
              <h2>Colleges</h2>
              <button
                onClick={() => {
                  setShowCollegeForm(!showCollegeForm);
                  setError('');
                  setCollegeFormData({ name: '', adminEmail: '', adminPassword: '', adminName: '' });
                }}
                className="btn btn-primary"
              >
                {showCollegeForm ? 'Cancel' : '+ Create College'}
              </button>
            </div>

            {showCollegeForm && (
              <div className="form-container">
                <div className="card">
                  <h3>Create New College</h3>
                  <form onSubmit={handleCreateCollege}>
                    <div className="form-group">
                      <label>College Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={collegeFormData.name}
                        onChange={handleCollegeInputChange}
                        required
                        placeholder="e.g., MIT, Stanford University"
                      />
                    </div>

                    <div className="form-group">
                      <label>Initial Admin Name *</label>
                      <input
                        type="text"
                        name="adminName"
                        value={collegeFormData.adminName}
                        onChange={handleCollegeInputChange}
                        required
                        placeholder="College Admin Name"
                      />
                    </div>

                    <div className="form-group">
                      <label>Initial Admin Email *</label>
                      <input
                        type="email"
                        name="adminEmail"
                        value={collegeFormData.adminEmail}
                        onChange={handleCollegeInputChange}
                        required
                        placeholder="admin@college.edu"
                      />
                    </div>

                    <div className="form-group">
                      <label>Initial Admin Password *</label>
                      <input
                        type="password"
                        name="adminPassword"
                        value={collegeFormData.adminPassword}
                        onChange={handleCollegeInputChange}
                        required
                        minLength={6}
                        placeholder="Minimum 6 characters"
                      />
                    </div>

                    {error && <div className="error">{error}</div>}

                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary" disabled={submitting}>
                        {submitting ? 'Creating...' : 'Create College'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="list-section">
              {colleges.length === 0 ? (
                <div className="empty-state">
                  <p>No colleges found. Create your first college to get started.</p>
                </div>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>College Name</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {colleges.map((college) => (
                        <tr key={college.id}>
                          <td>{college.name}</td>
                          <td>{new Date(college.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button
                              onClick={() => handleDeleteCollege(college.id)}
                              className="btn btn-danger btn-sm"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'superadmins' && (
          <div className="tab-content">
            <div className="page-header">
              <h2>Super Admins</h2>
              <button
                onClick={() => {
                  setShowSuperAdminForm(!showSuperAdminForm);
                  setError('');
                  setSuperAdminFormData({ name: '', email: '', password: '' });
                }}
                className="btn btn-primary"
              >
                {showSuperAdminForm ? 'Cancel' : '+ Create Super Admin'}
              </button>
            </div>

            {showSuperAdminForm && (
              <div className="form-container">
                <div className="card">
                  <h3>Create New Super Admin</h3>
                  <form onSubmit={handleCreateSuperAdmin}>
                    <div className="form-group">
                      <label>Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={superAdminFormData.name}
                        onChange={handleSuperAdminInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={superAdminFormData.email}
                        onChange={handleSuperAdminInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Password *</label>
                      <input
                        type="password"
                        name="password"
                        value={superAdminFormData.password}
                        onChange={handleSuperAdminInputChange}
                        required
                        minLength={6}
                      />
                      <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                        Minimum 6 characters
                      </small>
                    </div>

                    {error && <div className="error">{error}</div>}

                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary" disabled={submitting}>
                        {submitting ? 'Creating...' : 'Create Super Admin'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="list-section">
              {superAdmins.length === 0 ? (
                <div className="empty-state">
                  <p>No super admins found.</p>
                </div>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {superAdmins.map((superAdmin) => (
                        <tr key={superAdmin.id}>
                          <td>{superAdmin.name}</td>
                          <td>{superAdmin.email}</td>
                          <td>{new Date(superAdmin.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button
                              onClick={() => handleDeleteSuperAdmin(superAdmin.id)}
                              className="btn btn-danger btn-sm"
                              disabled={superAdmin.id === user?.id}
                              title={superAdmin.id === user?.id ? 'Cannot delete your own account' : 'Delete super admin'}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default SuperAdminDashboard;

