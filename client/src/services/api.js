/**
 * Centralized API Service with Offline Fallback
 */

import { mockFlights } from '../data/flightData';
import { mockHotels } from '../data/hotelData';
import { mockBuses } from '../data/busData';
import { mockTrains } from '../data/trainData';
import { siteOffers, siteFaqs } from '../data/siteData';

const BASE_URL = import.meta.env.VITE_API_URL || '';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    return { ok: false, error: err.message, networkError: true };
  }
}

export const api = {
  // Health
  checkHealth: () => request('/api/health'),

  // Flights
  getFlights: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/api/flights${query ? `?${query}` : ''}`);
    if (res.ok && res.data?.data) return res.data.data;
    return mockFlights;
  },

  getFlightById: async (id) => {
    const res = await request(`/api/flights/${id}`);
    if (res.ok && res.data?.data) return res.data.data;
    return mockFlights.find((f) => f.id === id) || null;
  },

  // Hotels
  getHotels: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/api/hotels${query ? `?${query}` : ''}`);
    if (res.ok && res.data?.data) return res.data.data;
    return mockHotels;
  },

  // Buses
  getBuses: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/api/buses${query ? `?${query}` : ''}`);
    if (res.ok && res.data?.data) return res.data.data;
    return mockBuses;
  },

  // Railways
  getRailways: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/api/railways${query ? `?${query}` : ''}`);
    if (res.ok && res.data?.data) return res.data.data;
    return mockTrains;
  },

  // Offers & FAQs
  getOffers: async () => {
    const res = await request('/api/offers');
    if (res.ok && res.data?.data) return res.data.data;
    return siteOffers;
  },

  getFaqs: async () => {
    const res = await request('/api/faqs');
    if (res.ok && res.data?.data) return res.data.data;
    return siteFaqs;
  },

  // Bookings
  getBookings: async () => {
    const res = await request('/api/bookings');
    if (res.ok && res.data?.data) return res.data.data;
    return null;
  },

  createBooking: async (bookingPayload) => {
    const res = await request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingPayload)
    });
    if (res.ok && res.data?.data) return res.data.data;
    return null;
  },

  cancelBooking: async (id, reason) => {
    const res = await request(`/api/bookings/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
    if (res.ok && res.data?.data) return res.data.data;
    return null;
  },

  // Auth
  login: async (credentials) => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    return res;
  },

  register: async (userData) => {
    const res = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    return res;
  },

  // Payment
  processPayment: async (paymentData) => {
    const res = await request('/api/payment', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
    return res;
  },

  // Contact
  submitContact: async (contactData) => {
    const res = await request('/api/contact', {
      method: 'POST',
      body: JSON.stringify(contactData)
    });
    return res;
  }
};
