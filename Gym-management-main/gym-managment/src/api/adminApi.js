// src/api/adminApi.js
import api from './axios';

// Get admin dashboard stats and recent activities
export const getAdminDashboard = () => api.get('/admin/dashboard');

// Assign a trainer to a user's subscription plan
export const assignTrainer = (subscriptionId, trainerId) =>
  api.post('/training/plans/assign', { subscriptionId, trainerId });

// Assign a nutritionist to a user's subscription plan
export const assignNutritionist = (subscriptionId, nutritionistId) =>
  api.post('/nutrition/plans/assign', { subscriptionId, nutritionistId });

// Subscriptions / Packages CRUD
export const createSubscription = (planData) =>
  api.post('/subscriptions/create', planData);

export const updateSubscription = (planData) =>
  api.post('/subscriptions/update', planData);

export const deleteSubscription = (planId) =>
  api.post('/subscriptions/delete', { planId });

// Equipment / Machines CRUD
export const createEquipment = (equipmentData) =>
  api.post('/equipment/create', equipmentData);

export const deleteEquipment = (equipmentId) =>
  api.post('/equipment/delete', { equipmentId });

// Specialists CRUD
export const createSpecialist = (specialistData) =>
  api.post('/specialists/create', specialistData);

export const deleteSpecialist = (specialistId) =>
  api.post('/specialists/delete', { specialistId });

// User Management
export const deleteUser = (userId) =>
  api.post('/auth/delete-user', { userId });
