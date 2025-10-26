import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class BerkasService {
  // Check if pendaftaran is currently active
  async checkActivePendaftaran() {
    try {
      const response = await axios.get(`${API_URL}/berkas/check-active`);
      return response.data;
    } catch (error) {
      console.error('Error checking active pendaftaran:', error);
      throw error;
    }
  }

  // Get all berkas
  async getAll(params = {}) {
    try {
      const response = await axios.get(`${API_URL}/berkas`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching berkas:', error);
      throw error;
    }
  }

  // Get berkas by ID
  async getById(id) {
    try {
      const response = await axios.get(`${API_URL}/berkas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching berkas by ID:', error);
      throw error;
    }
  }

  // Create berkas with file upload
  async create(formData) {
    try {
      const response = await axios.post(`${API_URL}/berkas`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating berkas:', error);
      throw error;
    }
  }

  // Update status berkas (admin only)
  async updateStatus(id, status) {
    try {
      const response = await axios.patch(`${API_URL}/berkas/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  }

  // Delete berkas
  async delete(id) {
    try {
      const response = await axios.delete(`${API_URL}/berkas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting berkas:', error);
      throw error;
    }
  }
}

export default new BerkasService();
