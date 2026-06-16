// src/api/trainingPlanApi.js
import api from './axios';

// Get user's active training plan
export const getUserTrainingPlan = () => api.get('/training/user');

// Get list of workout exercises for a given training plan
export const getWorkoutExercises = (planId) =>
  api.get(`/training/workout-exercises?plan_id=${planId}`);
