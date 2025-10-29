import api from '../config/api';

const TestimonialService = {
  // Get all testimonials
  getAll: async () => {
    try {
      const response = await api.get('/testimonial');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  },

  // Get testimonial by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/testimonial/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  },

  // Create testimonial
  create: async (testimonialData) => {
    try {
      const formData = new FormData();
      formData.append('nama', testimonialData.nama);
      formData.append('kategori', testimonialData.kategori);
      formData.append('asal', testimonialData.asal || '');
      formData.append('angkatan', testimonialData.angkatan || '');
      formData.append('testimonial', testimonialData.testimonial);
      
      if (testimonialData.foto) {
        formData.append('foto', testimonialData.foto);
      }

      const response = await api.post('/testimonial', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan saat membuat testimonial' };
    }
  },

  // Update testimonial
  update: async (id, testimonialData) => {
    try {
      const formData = new FormData();
      formData.append('nama', testimonialData.nama);
      formData.append('kategori', testimonialData.kategori);
      formData.append('asal', testimonialData.asal || '');
      formData.append('angkatan', testimonialData.angkatan || '');
      formData.append('testimonial', testimonialData.testimonial);
      
      if (testimonialData.foto) {
        formData.append('foto', testimonialData.foto);
      }

      const response = await api.put(`/testimonial/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan saat memperbarui testimonial' };
    }
  },

  // Delete testimonial
  delete: async (id) => {
    try {
      const response = await api.delete(`/testimonial/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Terjadi kesalahan saat menghapus testimonial' };
    }
  }
};

export default TestimonialService;

