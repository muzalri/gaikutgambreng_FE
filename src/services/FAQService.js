import axios from "axios";

const API_URL = "https://backend.pesantrenalihsanbekasi.or.id/api/faq";

const FAQService = {
  // Get all FAQs
  getAll: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data.data || [];
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single FAQ by ID
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new FAQ
  create: async (faqData) => {
    try {
      const response = await axios.post(API_URL, faqData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update FAQ
  update: async (id, faqData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, faqData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete FAQ
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default FAQService;
