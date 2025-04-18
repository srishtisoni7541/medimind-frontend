import axios from 'axios';

// Vite uses import.meta.env instead of process.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',  // Changed from application/hjson to application/json
  },
});

export const getMedicationSuggestions = async (query) => {
  try {
    const response = await api.get(`/medications/suggestions?query=${query}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching medication suggestions:', error);
    throw error;
  }
};

export const getMedicationDetails = async (name) => {
  try {
    const response = await api.get(`/medications/details/${name}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching medication details:', error);
    throw error;
  }
};

export default api;