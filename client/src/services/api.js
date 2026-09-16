/**
 * Centralized API Service with Offline Fallback
 */

import { mockFlights } from '../data/flightData';
import { mockHotels } from '../data/hotelData';
import { mockBuses } from '../data/busData';
import { mockTrains } from '../data/trainData';
import { mockHolidayPackages } from '../data/holidayData';
import { siteOffers, siteFaqs } from '../data/siteData';

const BASE_URL = import.meta.env.VITE_API_URL || '';
const DEFAULT_TIMEOUT_MS = 10000;

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('eazetrip_token') : null;
  const timeoutMs = options.timeout || DEFAULT_TIMEOUT_MS;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers,
    signal: controller.signal
  };

  const isGet = !options.method || options.method.toUpperCase() === 'GET';
  let attempts = 0;
  const maxAttempts = isGet ? 2 : 1;

  while (attempts < maxAttempts) {
    attempts++;
    try {
      const res = await fetch(url, config);
      clearTimeout(timeoutId);
      const data = await res.json();
      return { ok: res.ok, status: res.status, data };
    } catch (err) {
      if (attempts >= maxAttempts) {
        clearTimeout(timeoutId);
        const isAbort = err.name === 'AbortError';
        return {
          ok: false,
          error: isAbort ? 'Request timed out after 10s' : err.message,
          networkError: true,
          timedOut: isAbort
        };
      }
      // Brief jittered delay before idempotent retry
      await new Promise((r) => setTimeout(r, 250));
    }
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

  getHotelById: async (id) => {
    const res = await request(`/api/hotels/${id}`);
    if (res.ok && res.data?.data) return res.data.data;
    return mockHotels.find((h) => h.id === id) || null;
  },

  // Buses
  getBuses: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/api/buses${query ? `?${query}` : ''}`);
    if (res.ok && res.data?.data) return res.data.data;
    return mockBuses;
  },

  getBusById: async (id) => {
    const res = await request(`/api/buses/${id}`);
    if (res.ok && res.data?.data) return res.data.data;
    return mockBuses.find((b) => b.id === id) || null;
  },

  // Railways
  getRailways: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/api/railways${query ? `?${query}` : ''}`);
    if (res.ok && res.data?.data) return res.data.data;
    return mockTrains;
  },

  getRailwayById: async (id) => {
    const res = await request(`/api/railways/${id}`);
    if (res.ok && res.data?.data) return res.data.data;
    return mockTrains.find((t) => t.id === id) || null;
  },

  // Holidays & Tour Packages
  getHolidays: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/api/holidays${query ? `?${query}` : ''}`);
    if (res.ok && res.data?.data) return res.data.data;
    return mockHolidayPackages || [];
  },

  getHolidayById: async (id) => {
    const res = await request(`/api/holidays/${id}`);
    if (res.ok && res.data?.data) return res.data.data;
    return (mockHolidayPackages || []).find((h) => h.id === id) || null;
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
  getBookings: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/api/bookings${query ? `?${query}` : ''}`);
    if (res.ok && res.data?.data) return res.data.data;
    return null;
  },

  getBookingById: async (id) => {
    const res = await request(`/api/bookings/${id}`);
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

  googleAuth: async (authPayload) => {
    const res = await request('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify(authPayload)
    });
    return res;
  },

  getGoogleClientId: async () => {
    const res = await request('/api/auth/google-client-id');
    if (res.ok && res.data) return res.data;
    const clientEnvKey = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
    const isReal = Boolean(clientEnvKey && !clientEnvKey.includes('your_google_client_id') && clientEnvKey.includes('.apps.googleusercontent.com'));
    return {
      success: true,
      configured: isReal,
      clientId: isReal ? clientEnvKey : '',
      mode: isReal ? 'live' : 'simulation'
    };
  },

  updateProfile: async (profileData) => {
    const res = await request('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
    return res;
  },

  // Payment & Razorpay Gateway
  getRazorpayKey: async () => {
    const res = await request('/api/payment/razorpay-key');
    if (res.ok && res.data) return res.data;
    return {
      success: true,
      keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      isConfigured: false,
      currency: 'INR',
      merchantName: 'EazeTrip India',
      themeColor: '#034ea2'
    };
  },

  createRazorpayOrder: async (orderPayload) => {
    const res = await request('/api/payment/create-order', {
      method: 'POST',
      body: JSON.stringify(orderPayload)
    });
    if (res.ok && res.data) return res.data;
    // Fallback simulation order if server is unreachable
    return {
      success: true,
      orderId: `order_sim_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
      amount: Math.round(Number(orderPayload.amount) * 100),
      currency: orderPayload.currency || 'INR',
      receipt: orderPayload.receipt || `rcpt_${Date.now()}`,
      keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      isSimulated: true
    };
  },

  verifyRazorpayPayment: async (verificationPayload) => {
    const res = await request('/api/payment/verify', {
      method: 'POST',
      body: JSON.stringify(verificationPayload)
    });
    return res;
  },

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
  },

  // Notifications & Resilient Queue System
  getNotifications: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/api/notifications${query ? `?${query}` : ''}`);
    if (res.ok && res.data) return res.data;
    return { success: true, count: 0, unreadCount: 0, data: [] };
  },

  markNotificationRead: async (id) => {
    const res = await request(`/api/notifications/${id}/read`, { method: 'PATCH' });
    return res;
  },

  markAllNotificationsRead: async (userId = 'USR-1') => {
    const res = await request('/api/notifications/mark-all-read', {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
    return res;
  },

  sendNotification: async (payload) => {
    const res = await request('/api/notifications/send', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return res;
  },

  triggerCampaign: async (campaignPayload) => {
    const res = await request('/api/notifications/trigger-campaign', {
      method: 'POST',
      body: JSON.stringify(campaignPayload)
    });
    return res;
  },

  getQueueStatus: async () => {
    const res = await request('/api/notifications/queue-status');
    if (res.ok && res.data) return res.data;
    return null;
  },

  retryFailedNotifications: async (id = 'all') => {
    const res = await request('/api/notifications/retry-failed', {
      method: 'POST',
      body: JSON.stringify({ id })
    });
    return res;
  },

  getNotificationTemplates: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/api/notifications/templates${query ? `?${query}` : ''}`);
    if (res.ok && res.data) return res.data;
    return null;
  },

  getNotificationPreferences: async (userId = 'USR-1') => {
    const res = await request(`/api/notifications/preferences?userId=${userId}`);
    if (res.ok && res.data?.data) return res.data.data;
    return {
      email: true,
      whatsapp: true,
      sms: false,
      push: true,
      tripUpdates: true,
      promotionalOffers: true,
      priceDropAlerts: true
    };
  },

  updateNotificationPreferences: async (userId, preferences) => {
    const res = await request('/api/notifications/preferences', {
      method: 'PUT',
      body: JSON.stringify({ userId, preferences })
    });
    return res;
  },

  // Help Desk & Problem Messaging Support System
  createSupportTicket: async (ticketPayload) => {
    const res = await request('/api/support/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketPayload)
    });
    return res;
  },

  getSupportTickets: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/api/support/tickets${query ? `?${query}` : ''}`);
    if (res.ok && res.data) return res.data;
    return { success: true, count: 0, data: [] };
  },

  getSupportTicketById: async (id) => {
    const res = await request(`/api/support/tickets/${id}`);
    if (res.ok && res.data) return res.data;
    return null;
  },

  addTicketMessage: async (ticketId, messagePayload) => {
    const res = await request(`/api/support/tickets/${ticketId}/message`, {
      method: 'POST',
      body: JSON.stringify(messagePayload)
    });
    return res;
  },

  requestCallback: async (callbackPayload) => {
    const res = await request('/api/support/callback', {
      method: 'POST',
      body: JSON.stringify(callbackPayload)
    });
    return res;
  },

  sendDirectSupportMail: async (mailPayload) => {
    const res = await request('/api/support/direct-mail', {
      method: 'POST',
      body: JSON.stringify(mailPayload)
    });
    return res;
  },

  // Cancellation & Refund Engine
  calculateRefund: async (calcPayload) => {
    const res = await request('/api/refunds/calculate', {
      method: 'POST',
      body: JSON.stringify(calcPayload)
    });
    if (res.ok && res.data?.data) return res.data.data;
    return null;
  },

  requestRefund: async (refundPayload) => {
    const res = await request('/api/refunds/request', {
      method: 'POST',
      body: JSON.stringify(refundPayload)
    });
    return res;
  },

  trackRefund: async (query) => {
    const res = await request(`/api/refunds/track/${encodeURIComponent(query)}`);
    if (res.ok && res.data?.data) return res.data.data;
    return null;
  },

  getRefunds: async (userQuery = '') => {
    const res = await request(`/api/refunds${userQuery ? `?user=${encodeURIComponent(userQuery)}` : ''}`);
    if (res.ok && res.data?.data) return res.data.data;
    return [];
  }
};
