import axios from 'axios';


// const BASE_URL = 'http://localhost:3000';

// Use the correct Railway URL
const BASE_URL = 'https://noble-liberation-production.up.railway.app';

// Create a simple axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add a request interceptor to add the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/auth/signup',
  GET_USER_DATA: '/api/auth/getuserdata',
  SEARCH_TAXIS: '/api/auth/available-taxis'
};

// API functions
const authAPI = {
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
      console.log("getUserData API response:", response.data);
      return response.data;
    } catch (error) {
      console.error('Get User Data Error:', error);
      throw error;
    }
  }
};

const taxiAPI = {
  getAvailableTaxis: async (formData) => {
    try {
      const response = await api.post('/api/auth/available-taxis', formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Single export statement for all APIs
export { authAPI, taxiAPI }; 