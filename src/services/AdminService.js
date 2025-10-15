import api from '../config/api';

const AdminService = {
  // Login admin
  login: async (email, password) => {
    try {
      const response = await api.post('/admin/login', {
        email,
        password,
      });
      
      if (response.data.success && response.data.data) {
        // Simpan data admin ke localStorage
        localStorage.setItem('adminData', JSON.stringify(response.data.data));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  },

  // Logout admin
  logout: async () => {
    try {
      await api.post('/admin/logout');
      localStorage.removeItem('adminData');
    } catch (error) {
      localStorage.removeItem('adminData');
    }
  },

  // Get profile admin
  getProfile: async (id) => {
    try {
      const response = await api.get(`/admin/profile/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  },

  // Update profile admin
  updateProfile: async (id, data) => {
    try {
      const response = await api.put(`/admin/profile/${id}`, data);
      
      if (response.data.success && response.data.data) {
        // Update data admin di localStorage
        localStorage.setItem('adminData', JSON.stringify(response.data.data));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  },

  // Get current admin from localStorage
  getCurrentAdmin: () => {
    const adminData = localStorage.getItem('adminData');
    return adminData ? JSON.parse(adminData) : null;
  },

  // Check if admin is logged in
  isLoggedIn: () => {
    return localStorage.getItem('adminData') !== null;
  },

  // ==================== PENDIDIK METHODS ====================

  // Get all pendidik
  getAllPendidik: async () => {
    try {
      const response = await api.get('/admin/pendidik');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  },

  // Get pendidik by ID
  getPendidikById: async (id) => {
    try {
      const response = await api.get(`/admin/pendidik/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  },

  // Create new pendidik
  createPendidik: async (data) => {
    try {
      const response = await api.post('/admin/pendidik', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  },

  // Update pendidik
  updatePendidik: async (id, data) => {
    try {
      const response = await api.put(`/admin/pendidik/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  },

  // Delete pendidik
  deletePendidik: async (id) => {
    try {
      const response = await api.delete(`/admin/pendidik/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  },

  // Search pendidik
  searchPendidik: async (query) => {
    try {
      const response = await api.get('/admin/pendidik/search', {
        params: { query }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  },
};

export default AdminService;
