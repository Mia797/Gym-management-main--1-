// src/api/subscriptionApi.js
import api from './axios';

// Get list of all subscription plans (catalog)
export const getSubscriptions = () => api.get('/subscriptions');

// Purchase a subscription plan for the logged‑in user
export const purchaseSubscription = (payload) => api.post('/subscriptions/purchase', payload);

// Get the logged‑in user's subscriptions with status
export const getUserSubscriptions = () => api.get('/subscriptions/user');

// Admin: create a new subscription plan
export const createSubscriptionPlan = (payload) =>
  api.post('/subscriptions/create', payload);
