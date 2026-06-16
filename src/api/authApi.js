// src/api/authApi.js
import api from './axios';

export const loginApi = (email, password) =>
  api.post('/auth/login', { email, password });

export const logoutApi = () => api.post('/auth/logout');

export const registerApi = (userData) => api.post('/auth/register', userData);

export const getProfileApi = () => api.get('/auth/profile');

export const updateProfileApi = (profileData) => api.post('/auth/update', profileData);
