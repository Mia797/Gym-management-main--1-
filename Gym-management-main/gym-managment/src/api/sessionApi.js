// src/api/sessionApi.js
import api from './axios';

// Fetch available session slots (optionally filter by trainer)
export const getTrainerSessions = (trainerId) =>
  api.get(`/sessions${trainerId ? `?trainer_id=${trainerId}` : ''}`);

// Book a 1-on-1 session slot
export const bookSession = (sessionId) =>
  api.post('/sessions/book', { sessionId });

// Create a new session slot (trainer only)
export const createSession = (data) =>
  api.post('/sessions/create', data);

// Get the current user's booked sessions
export const getUserSessions = () =>
  api.get('/sessions/user');
