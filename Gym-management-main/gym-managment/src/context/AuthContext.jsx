import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Configure Axios defaults
// axios.defaults.baseURL = 'https://test.oralpharm.com'; // Removed to use Vite proxy
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to fetch profile on load to check if session is valid
    const checkSession = async () => {
      try {
        const response = await axios.get('/api/auth/profile');
        if (response.data && response.data.user && response.data.user.id) {
          const loggedInUser = response.data.user;
          loggedInUser.role = loggedInUser.role_name || 'user';
          loggedInUser.firstName = loggedInUser.name ? loggedInUser.name.split(' ')[0] : '';
          setUser(loggedInUser);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);

  const refreshUser = async () => {
    try {
      const response = await axios.get('/api/auth/profile');
      if (response.data && response.data.user && response.data.user.id) {
        const loggedInUser = response.data.user;
        loggedInUser.role = loggedInUser.role_name || 'user';
        loggedInUser.firstName = loggedInUser.name ? loggedInUser.name.split(' ')[0] : '';
        setUser(loggedInUser);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const login = async (email, password) => {
    try {
      // The API expects 'email' and 'password'
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });

      if (response.data && response.data.message === 'Login successful') {
        // Fetch profile to get user details
        const profileResponse = await axios.get('/api/auth/profile');
        if (profileResponse.data && profileResponse.data.user && profileResponse.data.user.id) {
          const loggedInUser = profileResponse.data.user;
          loggedInUser.role = loggedInUser.role_name || 'user';
          loggedInUser.firstName = loggedInUser.name ? loggedInUser.name.split(' ')[0] : '';
          setUser(loggedInUser);
          return { success: true };
        }
      }
      return { success: false, message: response.data?.message || 'Login failed' };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      // The API expects name, email, password, phone, age, gender, address
      const apiPayload = {
        name: `${userData.firstName} ${userData.lastName}`.trim(),
        email: userData.email,
        password: userData.password,
        phone: userData.phone || '0000000000', // Default if missing
        age: parseInt(userData.age) || 18,
        gender: userData.gender || 'male',
        address: userData.address || 'Not Provided',
        role: userData.role || 'user'
      };

      const response = await axios.post('/api/auth/register', apiPayload);
      if (response.data && (response.data.message === 'User registered successfully' || response.data.id)) {
        return { success: true, message: 'Registration successful' };
      }
      return { success: false, message: response.data?.message || response.data?.error || 'Registration failed' };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || error.response?.data?.message || 'Registration failed' };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.post('/api/auth/update', profileData);
      if (response.data) {
        await refreshUser();
        return { success: true, message: response.data.message || 'Profile updated successfully' };
      }
      return { success: false, message: 'Update failed' };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || error.response?.data?.message || 'Update failed' };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateProfile, loading, refreshUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
