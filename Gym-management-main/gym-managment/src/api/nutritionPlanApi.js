// src/api/nutritionPlanApi.js
import api from './axios';

// Get user's active nutrition plan
export const getUserNutritionPlan = () => api.get('/nutrition/user');

// Get list of diet meals for a given nutrition plan
export const getDietMeals = (planId) =>
  api.get(`/nutrition/diet-meals?plan_id=${planId}`);
