import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  studentSignup: (data) => api.post('/auth/student/signup', data),
  studentLogin: (data) => api.post('/auth/student/login', data),
  adminLogin: (data) => api.post('/auth/admin/login', data),
};

// Student API
export const studentAPI = {
  getProfile: () => api.get('/students/profile'),
  getProgress: () => api.get('/students/progress'),
};

// Admin API
export const adminAPI = {
  getStudents: () => api.get('/admin/students'),
  getStudentProgress: (studentId) => api.get(`/admin/students/${studentId}/progress`),
  getAdmins: () => api.get('/admin/admins'),
  createAdmin: (data) => api.post('/admin/admins', data),
  deleteAdmin: (adminId) => api.delete(`/admin/admins/${adminId}`),
};

// Assessment API
export const assessmentAPI = {
  getAll: () => api.get('/assessments'),
  getById: (id) => api.get(`/assessments/${id}`),
  attempt: (id, answers) => api.post(`/assessments/${id}/attempt`, { answers }),
  create: (data) => api.post('/assessments', data),
  update: (id, data) => api.put(`/assessments/${id}`, data),
  delete: (id) => api.delete(`/assessments/${id}`),
};

// Progress API
export const progressAPI = {
  getDSA: () => api.get('/progress/dsa'),
  updateDSA: (data) => api.post('/progress/dsa', data),
};

// College API
export const collegeAPI = {
  create: (data) => api.post('/colleges', data),
  getAll: () => api.get('/colleges'),
  verifyName: (name) => api.get(`/colleges/verify/${encodeURIComponent(name)}`),
};

export default api;

