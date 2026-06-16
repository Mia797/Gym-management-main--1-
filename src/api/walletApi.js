// src/api/walletApi.js
import api from './axios';

const userHeaders = (user) => ({
  headers: {
    'x-user-id': user?.id,
    'x-role': user?.role
  }
});

// Deposit funds into user's wallet
export const depositFunds = (amount, user) =>
  api.post('/payments/deposit', { amount }, userHeaders(user));

// Get wallet transaction history and current balance
export const getWalletHistory = (user) =>
  api.get('/payments/history', userHeaders(user));
