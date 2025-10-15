import api from '../config/api';

const ArtikelService = {
  // Get all artikel
  getAllArtikel: async () => {
    try {
      const response = await api.get('/artikel');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  },

  // Get artikel by ID
  getArtikelById: async (id) => {
    try {
      const response = await api.get(`/artikel/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  },

  // Create artikel
  createArtikel: async (artikelData) => {
    try {
      const response = await api.post('/artikel', artikelData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  },

  // Update artikel
  updateArtikel: async (id, artikelData) => {
    try {
      const response = await api.put(`/artikel/${id}`, artikelData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  },

  // Delete artikel
  deleteArtikel: async (id) => {
    try {
      const response = await api.delete(`/artikel/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  },

  // Search artikel
  searchArtikel: async (keyword) => {
    try {
      const response = await api.get(`/artikel/search?q=${keyword}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  },

  // Upload foto artikel
  uploadFoto: async (file) => {
    try {
      const formData = new FormData();
      formData.append('foto', file);

      const response = await api.post('/artikel/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan saat upload file' };
    }
  },

  // Delete foto artikel
  deleteFoto: async (filename) => {
    try {
      const response = await api.delete(`/artikel/upload/${filename}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan saat menghapus file' };
    }
  }
};

export default ArtikelService;
