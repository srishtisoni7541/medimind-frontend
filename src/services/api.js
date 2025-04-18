import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = {
  analyzeSymptoms: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/analyze-symptoms`, userData);
      return response.data;
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      throw error;
    }
  },

  getConditionDetails: async (conditionId) => {
    try {
      const response = await axios.get(`${API_URL}/condition/${conditionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching condition details:', error);
      throw error;
    }
  },

  getTreatments: async (conditionId) => {
    try {
      const response = await axios.get(`${API_URL}/treatments/${conditionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching treatments:', error);
      throw error;
    }
  }
};

export default api;