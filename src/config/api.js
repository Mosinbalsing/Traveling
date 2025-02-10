export const API_BASE_URL = 'http://localhost:3000';  // For local development

// Comment out the Railway URL for now
// export const API_BASE_URL = 'https://noble-liberation-railway.app';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  GET_USER_DATA: `${API_BASE_URL}/api/auth/getuserdata`
};

export const axiosConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false  // Changed to false since we're using token-based auth
};

// Create and export the axios instance
import axios from 'axios';
export const api = axios.create(axiosConfig); 