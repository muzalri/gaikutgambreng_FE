import axios from "axios";

const API_URL = "https://backend.pesantrenalihsanbekasi.or.id/api/promosi";

const PromosiService = {
  // Get banner (hanya 1)
  getBanner: async () => {
    try {
      const response = await axios.get(`${API_URL}/banner`);
      return response.data;
    } catch (error) {
      console.error("Error fetching banner:", error);
      throw error;
    }
  },

  // Get brosur (hanya 1)
  getBrosur: async () => {
    try {
      const response = await axios.get(`${API_URL}/brosur`);
      return response.data;
    } catch (error) {
      console.error("Error fetching brosur:", error);
      throw error;
    }
  },

  // Create banner (dengan file upload)
  createBanner: async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/banner`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating banner:", error);
      throw error;
    }
  },

  // Create brosur (dengan file upload)
  createBrosur: async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/brosur`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating brosur:", error);
      throw error;
    }
  },

  // Delete banner
  deleteBanner: async () => {
    try {
      const response = await axios.delete(`${API_URL}/banner`);
      return response.data;
    } catch (error) {
      console.error("Error deleting banner:", error);
      throw error;
    }
  },

  // Delete brosur
  deleteBrosur: async () => {
    try {
      const response = await axios.delete(`${API_URL}/brosur`);
      return response.data;
    } catch (error) {
      console.error("Error deleting brosur:", error);
      throw error;
    }
  },
};

export default PromosiService;
