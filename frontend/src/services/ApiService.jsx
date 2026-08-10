import axios from 'axios';


const API_BASE_URL = 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication Service Calls
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Donor Service Calls
export const getDonors = async () => {
  try {
    const response = await apiClient.get('/donors');
    return response.data;
  } catch (error) {
    console.error('Error fetching donors:', error);
    throw error;
  }
};

export const registerDonor = async (donorData) => {
  try {
    const response = await apiClient.post('/donors/register', donorData);
    return response.data;
  } catch (error) {
    console.error('Error registering donor:', error);
    throw error;
  }
};

export default apiClient;