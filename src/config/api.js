import axios from 'axios';

// Base URL for your API
// export const BASE_URL = 'https://noble-liberation-production.up.railway.app';
export const BASE_URL = 'http://localhost:3000';

// Create an Axios instance with default headers
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Add an interceptor to include token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/auth/signup',
  GET_USER_DATA: '/api/auth/getuserdata',
  SEARCH_TAXIS: '/api/auth/available-taxis',
  SEARCH_MOBILE: '/api/auth/search-mobile',
  SEND_OTP: '/api/auth/send-otp',
  VERIFY_OTP: '/api/auth/verify-otp',
  CREATE_BOOKING: '/api/auth/create',
  STORE_USER_DETAILS: '/api/auth/store-user-details', // New endpoint for storing user details
  CREATE_BOOKING_DETAILS: '/api/booking/create-booking',
  GET_USER_BY_MOBILE: '/api/users/get-by-mobile',
};

// Generic function for API requests
const apiRequest = async (method, url, data = {}) => {
  try {
    const response = await api({ method, url, data });
    console.log(`Response from ${method} ${url}:`, response.data); // Log the response
    return response.data;
  } catch (error) {
    console.error(`API Error (${method} ${url}):`, error.response?.data || error.message);
    throw error.response?.data || error.message || 'An unknown error occurred';
  }
};

// Test API request separately in case of failure
const testAPIRequest = async (method, url, data = {}, headers = {}) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      withCredentials: true,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (method === 'POST') {
      config.data = data;  // Attach data to body for POST requests
    } else if (method === 'GET') {
      // For GET requests, append data as query parameters
      const params = new URLSearchParams(data).toString();
      if (params) {
        config.url = `${config.url}?${params}`;
      }
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Direct API Error (${method} ${url}):`, error.response?.data || error.message);
    throw error.response?.data || error.message || 'An unknown error occurred';
  }
};

// Auth API
export const authAPI = {
  login: (email, password) => apiRequest('POST', API_ENDPOINTS.LOGIN, { email, password }),
  signup: (userData) => apiRequest('POST', API_ENDPOINTS.SIGNUP, userData),
  getUserData: () => apiRequest('GET', API_ENDPOINTS.GET_USER_DATA),
  storeUserDetails: (mobile, name, email) => {
    const userDetails = { name, email, mobile };
    console.log('Storing user details:', userDetails); // Log the data being sent
    return apiRequest('POST', API_ENDPOINTS.STORE_USER_DETAILS, userDetails);
  },
  adminLogin: async (credentials) => {
    try {
      const response = await axios({
        method: 'POST',
        url: `${BASE_URL}/api/admin/login`,
        data: credentials,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log('Admin Login API Response:', response);
      return response.data;
    } catch (error) {
      console.error('Admin Login Error:', error.response || error);
      throw error.response?.data || error;
    }
  },
  verifyAdminOTP: async (data) => {
    return await testAPIRequest("post", "/api/admin/verify-otp", data);
  },
  getAdminData: async (token) => {
    return await testAPIRequest("get", "/api/admin/data", null, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};

// Taxi API
export const taxiAPI = {
  getAvailableTaxis: (formData) => apiRequest('POST', API_ENDPOINTS.SEARCH_TAXIS, formData),
};

// Booking API
export const bookingAPI = {
  sendOTP: (data) => apiRequest('POST', API_ENDPOINTS.SEND_OTP, data),
  verifyOTP: async (data) => {
    try {
      console.log("Verification API Data:", data); // Log the data being sent
      const response = await axios.post(`${BASE_URL}${API_ENDPOINTS.VERIFY_OTP}`, data);
      console.log("Verification API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Verification API Error:", error.response || error);
      throw error.response?.data || error;
    }
  },
  createBooking: (data) => apiRequest('POST', API_ENDPOINTS.CREATE_BOOKING, data),

  // Updated checkMobileExists to send the mobile number in the correct format
  checkMobileExists: (mobile) => testAPIRequest('POST', API_ENDPOINTS.SEARCH_MOBILE, { mobile }),

  createBookingDetails: (bookingData) => 
    apiRequest('POST', API_ENDPOINTS.CREATE_BOOKING_DETAILS, bookingData),

};

