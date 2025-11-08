import api from '../config/api';

const VoiceNoteService = {
  // Upload rekaman bacaan Quran
  create: async (formData) => {
    try {
      const response = await api.post('/voicenote', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating voice note:', error);
      throw error;
    }
  },

  // Get all voice notes dengan filter
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/voicenote', { params });
      return response.data;
    } catch (error) {
      console.error('Error getting voice notes:', error);
      throw error;
    }
  },

  // Get voice note by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/voicenote/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting voice note:', error);
      throw error;
    }
  },

  // Update penilaian (admin)
  updatePenilaian: async (id, data) => {
    try {
      const response = await api.put(`/voicenote/${id}/penilaian`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating penilaian:', error);
      throw error;
    }
  },

  // Delete voice note
  delete: async (id) => {
    try {
      const response = await api.delete(`/voicenote/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting voice note:', error);
      throw error;
    }
  },

  // Get statistics
  getStatistics: async (params = {}) => {
    try {
      const response = await api.get('/voicenote/statistics', { params });
      return response.data;
    } catch (error) {
      console.error('Error getting statistics:', error);
      throw error;
    }
  }
};

export default VoiceNoteService;
