// frontend/src/contexts/AuthContext.jsx // Authentication context for user session management (Node.js/JWT)

import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axiosInstance'; // Import configured axios instance

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to manage authentication state
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null); // Stores user data if authenticated
    const [loadingAuth, setLoadingAuth] = useState(true); // Loading state for initial auth check
    const [message, setMessage] = useState({ text: '', type: '' }); // Global message state { text: '', type: 'success'|'error'|'info' }

    // Function to display messages globally
    const showMessage = (text, type = 'info') => {
        setMessage({ text, type });
        // Clear message after 3 seconds
        setTimeout(() => {
            setMessage({ text: '', type: '' });
        }, 3000);
    };

    // Effect to check authentication status on component mount
    useEffect(() => {
        const checkAuth = async () => {
            console.log("AuthContext: checkAuth called.");
            setLoadingAuth(true); // Start loading

            try {
                const token = localStorage.getItem('token');
                if (token) {
                    // Attempt to fetch current user data from the backend using the token
                    // This validates the token and gets the user's profile
                    const res = await api.get('/auth/profile');
                    setCurrentUser(res.data); // Set user data from backend response
                    console.log("AuthContext: User profile fetched successfully:", res.data);
                } else {
                    setCurrentUser(null);
                    console.log("AuthContext: No token found in localStorage.");
                }
            } catch (error) {
                console.error("AuthContext: Authentication check failed:", error.response?.data?.message || error.message);
                localStorage.removeItem('token'); // Clear invalid or expired token
                setCurrentUser(null);
                // No need to show an error message here on initial load if not logged in
            } finally {
                setLoadingAuth(false); // Authentication check is complete
                console.log("AuthContext: setLoadingAuth(false) - Auth check complete.");
            }
        };

        checkAuth();
    }, []); // Empty dependency array means this runs once on mount

    // User registration function
    const register = async (name, email, password, role) => {
        setLoadingAuth(true); // Indicate loading during registration attempt
        try {
            const res = await api.post('/auth/register', { name, email, password, role });
            // For registration, we typically don't log them in immediately, but show success
            showMessage('Registration successful! Please log in.', 'success');
            console.log("AuthContext: User registered successfully.");
            return true; // Indicate success
        } catch (error) {
            console.error("AuthContext: Registration failed:", error.response?.data?.message || error.message);
            showMessage(`Registration failed: ${error.response?.data?.message || 'Please try again.'}`, 'error');
            return false; // Indicate failure
        } finally {
            setLoadingAuth(false); // Registration attempt complete
        }
    };

    // User login function
    const login = async (email, password) => {
        setLoadingAuth(true); // Indicate loading during login attempt
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token); // Store the JWT token
            setCurrentUser(res.data); // Backend response contains user data directly
            showMessage('Login successful!', 'success');
            console.log("AuthContext: User logged in successfully. Token stored.");
            return true; // Indicate success
        } catch (error) {
            console.error("AuthContext: Login failed:", error.response?.data?.message || error.message);
            showMessage(`Login failed: ${error.response?.data?.message || 'Invalid credentials'}`, 'error');
            setCurrentUser(null);
            return false; // Indicate failure
        } finally {
            setLoadingAuth(false); // Login attempt complete
        }
    };

    // User logout function
    const logout = async () => {
        setLoadingAuth(true); // Indicate loading during logout attempt
        try {
            // For JWTs, logout is primarily client-side by removing the token.
            // The backend endpoint can simply acknowledge or clear server-side session if any.
            await api.post('/auth/logout'); // Call backend logout endpoint
            localStorage.removeItem('token'); // Clear token from client-side
            setCurrentUser(null);
            showMessage('Logged out successfully.', 'info');
            console.log("AuthContext: User logged out. Token removed from localStorage.");
        } catch (error) {
            console.error("AuthContext: Logout failed on backend call (but client-side token removed):", error.response?.data?.message || error.message);
            // Even if backend call fails, ensure client-side logout happens
            localStorage.removeItem('token');
            setCurrentUser(null);
            showMessage(`Logout failed: ${error.response?.data?.message || 'Please try again.'}`, 'error');
        } finally {
            setLoadingAuth(false); // Logout attempt complete
        }
    };

    // The value provided by the context to its consumers
    const authContextValue = {
        currentUser,
        isAuthenticated: !!currentUser, // Derived from currentUser presence
        loadingAuth,
        message, // Pass the message object
        showMessage, // Pass the function to set messages
        login,
        register,
        logout,
        // For Node.js/MongoDB, userIdForDisplay would be currentUser?._id
        userIdForDisplay: currentUser ? currentUser._id : 'Not Authenticated',
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to easily consume the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
