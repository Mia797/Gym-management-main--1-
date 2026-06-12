// src/api/bookingApi.js
import api from './axios';

// Cancel a booking (POST /bookings/cancel with booking ID)
export const cancelBooking = (bookingId) =>
  api.post('/bookings/cancel', { bookingId });

// Get equipment the user is currently using / checked into
export const getActiveBookings = () =>
  api.get('/bookings/use');

// Get full booking history (admin)
export const getAllBookings = () =>
  api.get('/bookings');
