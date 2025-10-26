import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class PendaftaranService {
  // Get all pendaftaran dengan filter
  async getAll(params = {}) {
    try {
      const response = await axios.get(`${API_URL}/pendaftaran`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching pendaftaran:', error);
      throw error;
    }
  }

  // Get dropdown angkatan
  async getAngkatanDropdown() {
    try {
      const response = await axios.get(`${API_URL}/pendaftaran/angkatan-dropdown`);
      return response.data;
    } catch (error) {
      console.error('Error fetching angkatan dropdown:', error);
      throw error;
    }
  }

  // Get by ID
  async getById(id) {
    try {
      const response = await axios.get(`${API_URL}/pendaftaran/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pendaftaran by ID:', error);
      throw error;
    }
  }

  // Create pendaftaran
  async create(data) {
    try {
      const response = await axios.post(`${API_URL}/pendaftaran`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating pendaftaran:', error);
      throw error;
    }
  }

  // Update pendaftaran
  async update(id, data) {
    try {
      const response = await axios.put(`${API_URL}/pendaftaran/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating pendaftaran:', error);
      throw error;
    }
  }

  // Delete pendaftaran
  async delete(id) {
    try {
      const response = await axios.delete(`${API_URL}/pendaftaran/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting pendaftaran:', error);
      throw error;
    }
  }
}

export default new PendaftaranService();
