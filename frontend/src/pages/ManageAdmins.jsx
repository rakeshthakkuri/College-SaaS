import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './ManageAdmins.css';

function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await adminAPI.getAdmins();
      setAdmins(response.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
      setError('Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await adminAPI.createAdmin(formData);
      setFormData({ name: '', email: '', password: '' });
      setShowForm(false);
      fetchAdmins();
      alert('Admin created successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create admin');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (adminId) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) {
      return;
    }

    try {
      await adminAPI.deleteAdmin(adminId);
      fetchAdmins();
      alert('Admin deleted successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete admin');
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
    <DashboardLayout title="Manage Admins">
      <div className="manage-admins">
        <div className="page-header">
          <h1>Manage Admins</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setError('');
              setFormData({ name: '', email: '', password: '' });
            }}
            className="btn btn-primary"
          >
            {showForm ? 'Cancel' : '+ Add Admin'}
          </button>
        </div>

        {showForm && (
          <div className="admin-form-container">
            <div className="card">
              <h2>Create New Admin</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
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
                    {submitting ? 'Creating...' : 'Create Admin'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="admins-list">
          <h2>All Admins</h2>
          {admins.length === 0 ? (
            <div className="empty-state">
              <p>No admins found.</p>
            </div>
          ) : (
            <div className="admins-table">
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
                  {admins.map((admin) => (
                    <tr key={admin.id}>
                      <td>{admin.name}</td>
                      <td>{admin.email}</td>
                      <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => handleDelete(admin.id)}
                          className="btn btn-danger btn-sm"
                          disabled={admin.id === user?.id}
                          title={admin.id === user?.id ? 'Cannot delete your own account' : 'Delete admin'}
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
    </DashboardLayout>
  );
}

export default ManageAdmins;

