import api from "../config/api";

const PendidikService = {
  getPendidikById: async (id) => {
    try {
      const response = await api.get(`/pendidik/${id}`);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          success: false,
          message: "Gagal mengambil data pendidik",
        }
      );
    }
  },
};

export default PendidikService;
