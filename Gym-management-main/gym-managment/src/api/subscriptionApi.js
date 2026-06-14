// src/api/subscriptionApi.js
import api from './axios';

const userHeaders = (user) => ({
  headers: {
    'x-user-id': user?.id,
    'x-role': user?.role
  }
});

// Get list of all subscription plans (catalog)
export const getSubscriptions = () => api.get('/subscriptions');

// Purchase a subscription plan for the logged-in user
export const purchaseSubscription = (payload, user) =>
  api.post('/subscriptions/purchase', payload, userHeaders(user));

<<<<<<< HEAD
// Get the logged‑in user's subscriptions with status
export const getUserSubscriptions = () => api.get('/subscriptions/user');

// Admin: create a new subscription plan
export const createSubscriptionPlan = (payload) =>
  api.post('/subscriptions/create', payload);
=======
// Get the logged-in user's subscriptions with status
export const getUserSubscriptions = (user) =>
  api.get('/subscriptions/user', userHeaders(user));
>>>>>>> dbe9df97612276bd84439ba8c6714786c376ab20
