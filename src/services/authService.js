import api from './api';

export const authService = {
  // Login
  login: (username, password) => api.post('/users/login/', { username, password }),
  
  // Logout
  logout: () => api.post('/users/logout/'),
  
  // Get current user
  getCurrentUser: () => api.get('/users/me/'),
  
  // Update profile
  updateProfile: (data) => api.patch('/users/me/', data),
  
  // Change password
  changePassword: (oldPassword, newPassword) => api.post('/users/me/change_password/', {
    old_password: oldPassword,
    new_password: newPassword
  }),
  
  // Get user stats
  getUserStats: () => api.get('/users/stats/'),
  
  // Admin only - manage users
  getAllUsers: () => api.get('/users/'),
  createUser: (data) => api.post('/users/', data),
  updateUser: (id, data) => api.patch(`/users/${id}/`, data),
  deleteUser: (id) => api.delete(`/users/${id}/`),
  toggleUserStatus: (id) => api.patch(`/users/${id}/`, { is_active: false }), // Implement toggle
};

export default authService;