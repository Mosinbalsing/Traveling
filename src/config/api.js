import axios from 'axios';
import { carCategories } from '@/data/carCategories'; // Create this file if it doesn't exist

// export const BASE_URL = 'http://localhost:3000';

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
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios({
        method: 'POST',
        url: `${BASE_URL}${API_ENDPOINTS.SEARCH_TAXIS}`,
        data: formData,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Raw API Response:', response.data);

      return {
        success: true,
        data: response.data?.availableTaxis || carCategories
      };

    } catch (error) {
      console.error('Get Available Taxis Error:', error);
      return {
        success: true,
        data: carCategories
      };
    }
  }
};

// Single export statement for all APIs
export { authAPI, taxiAPI }; 