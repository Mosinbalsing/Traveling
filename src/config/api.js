import axios from 'axios';

// export const API_BASE_URL = 'http://localhost:3000';  // For local development

// Use the correct Railway URL
const BASE_URL = 'https://noble-liberation-production.up.railway.app';

// Create a simple axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/auth/signup',
  GET_USER_DATA: '/api/auth/getuserdata'
};

// API functions
export const authAPI = {
  login: async (email, password) => {
    try {
      // Use direct axios call for testing
      const response = await axios({
        method: 'POST',
        url: `${BASE_URL}${API_ENDPOINTS.LOGIN}`,
        data: { email, password },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true
      });
      
      if (response.data) {
        return response.data;
      }
      throw new Error('No response data');
      
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Network error - Please check your connection');
      }
      throw error;
    }
  },

  signup: async (userData) => {
    try {
      const response = await axios({
        method: 'POST',
        url: `${BASE_URL}${API_ENDPOINTS.SIGNUP}`,
        data: userData,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Signup Error:', error);
      throw error;
    }
  },

  getUserData: async (token) => {
    try {
      const response = await axios({
        method: 'GET',
        url: `${BASE_URL}${API_ENDPOINTS.GET_USER_DATA}`,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Get User Data Error:', error);
      throw error;
    }
  }
};

export default authAPI; 