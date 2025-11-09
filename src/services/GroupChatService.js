import api from '../config/api';

const GroupChatService = {
  // Get all group chats
  getAllGroupChats: async () => {
    try {
      const response = await api.get('/groupchat');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get group chat by angkatan
  getGroupChatByAngkatan: async (angkatan) => {
    try {
      const response = await api.get(`/groupchat/angkatan/${angkatan}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create group chat
  createGroupChat: async (data) => {
    try {
      const response = await api.post('/groupchat', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update group chat
  updateGroupChat: async (id, data) => {
    try {
      const response = await api.put(`/groupchat/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete group chat
  deleteGroupChat: async (id) => {
    try {
      const response = await api.delete(`/groupchat/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default GroupChatService;
