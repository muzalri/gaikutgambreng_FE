import api from '../config/api';

const AuthSantriService = {
  // Register santri baru
  register: async (registerData) => {
    try {
      const response = await api.post('/auth/santri/register', registerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  },

  // Login santri
  login: async (loginData) => {
    try {
      const response = await api.post('/auth/santri/login', loginData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  },

  // Login/Register dengan Google
  googleAuth: async (googleData) => {
    try {
      const response = await api.post('/auth/santri/google', googleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  },

  // Logout
  logout: async () => {
    try {
      const response = await api.post('/auth/santri/logout');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  }
};

export default AuthSantriService;
