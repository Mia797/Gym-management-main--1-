// src/api/walletApi.js
import api from './axios';

// Deposit funds into user's wallet
export const depositFunds = (amount) =>
  api.post('/payments/deposit', { amount });

// Get wallet transaction history and current balance
export const getWalletHistory = () =>
  api.get('/payments/history');
