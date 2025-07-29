// frontend/src/api/axiosInstance.js // Axios instance for API calls (Node.js/JWT)

import axios from 'axios';

// This assumes your Node.js backend is running on port 5000
const API_BASE_URL = 'https://online-quiz-platform-backend-kad2.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to attach JWT token from localStorage to every outgoing request
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token'); // Get the token from localStorage
    if (token) {
        // Attach the token as a Bearer token in the Authorization header
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Axios Interceptor: Attached JWT token to request.");
    }
    return config;
}, error => {
    // Handle request errors
    return Promise.reject(error);
});

export default api;
