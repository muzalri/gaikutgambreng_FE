import api from '../config/api';

const SantriService = {
  // Get all santri
  getAllSantri: async () => {
    try {
      const response = await api.get('/santri');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  },

  // Get santri by ID
  getSantriById: async (id) => {
    try {
      const response = await api.get(`/santri/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  },

  // Create new santri
  createSantri: async (data) => {
    try {
      const response = await api.post('/santri', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  },

  // Update santri
  updateSantri: async (id, data) => {
    try {
      const response = await api.put(`/santri/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  },

  // Delete santri
  deleteSantri: async (id) => {
    try {
      const response = await api.delete(`/santri/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  },

  // Search santri
  searchSantri: async (keyword) => {
    try {
      const response = await api.get(`/santri/search?q=${keyword}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  },
};

export default SantriService;
