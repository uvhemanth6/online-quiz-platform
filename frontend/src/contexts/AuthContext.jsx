import React, { useState, useEffect, createContext, useContext } from 'react';
import api from '../api/axiosInstance'; // Import the configured axios instance

// Create Auth Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true); // Tracks initial auth state
    const [message, setMessage] = useState({ text: '', type: '' }); // For success/error messages

    // Function to display temporary messages (e.g., success/error toasts)
    const showMessage = (text, type = 'info') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000); // Clear after 3 seconds
    };

    // Effect to load user data from local storage on component mount
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Validate token with backend and get user profile
                    const res = await api.get('/auth/profile');
                    setCurrentUser(res.data);
                } catch (error) {
                    console.error("Failed to load user profile:", error);
                    localStorage.removeItem('token'); // Clear invalid token
                    setCurrentUser(null);
                    showMessage('Session expired or invalid. Please log in again.', 'error');
                }
            }
            setLoadingAuth(false); // Authentication check is complete
        };

        loadUser();
    }, []); // Empty dependency array ensures this runs only once on mount

    // Function to handle user registration
    const register = async (name, email, password, role) => {
        try {
            await api.post('/auth/register', { name, email, password, role });
            showMessage('Registration successful! Please log in.', 'success');
            return true;
        } catch (error) {
            showMessage(`Registration failed: ${error.response?.data?.message || error.message}`, 'error');
            console.error("Registration error:", error.response?.data || error.message);
            return false;
        }
    };

    // Function to handle user login
    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token); // Store JWT token
            setCurrentUser(res.data); // Set current user data
            showMessage('Login successful!', 'success');
            return true;
        } catch (error) {
            showMessage(`Login failed: ${error.response?.data?.message || error.message}`, 'error');
            console.error("Login error:", error.response?.data || error.message);
            return false;
        }
    };

    // Function to handle user logout
    const logout = () => {
        localStorage.removeItem('token'); // Remove JWT token
        setCurrentUser(null); // Clear current user
        showMessage('Logged out successfully!', 'success');
    };

    return (
        <AuthContext.Provider value={{ currentUser, loadingAuth, register, login, logout, showMessage, message }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to easily access AuthContext values
export const useAuth = () => useContext(AuthContext);
