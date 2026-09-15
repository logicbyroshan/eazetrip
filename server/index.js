const express = require('express');
const cors = require('cors');
const path = require('path');

const mockStore = require('./data/mockStore');
const { securityHeaders, rateLimit, sanitizeInput } = require('./middleware/security');
const {
  validateLogin,
  validateRegister,
  validateBooking,
  validatePayment,
  validateContact
} = require('./middleware/validation');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// 1. Core Security & Parsing Middleware
app.use(securityHeaders);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json({ limit: '100kb' }));
app.use(sanitizeInput);

// General API rate limiter (120 req / min)
const generalLimiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use('/api/', generalLimiter);

// Sensitive endpoints rate limiter (20 req / min)
const sensitiveLimiter = rateLimit({ windowMs: 60 * 1000, max: 20, message: 'Too many attempts. Please wait a minute.' });

// State Stores
let bookings = [...mockStore.bookings];
let users = [];

// ==========================================
// API ROUTES
// ==========================================

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

// FLIGHTS API
app.get('/api/flights', (req, res) => {
  const { from, to, airline, maxPrice } = req.query;
  let results = mockStore.flights;

  if (from) {
    results = results.filter(
      (f) =>
        f.from.toLowerCase() === from.toLowerCase() ||
        f.fromCity.toLowerCase().includes(from.toLowerCase())
    );
  }
  if (to) {
    results = results.filter(
      (f) =>
        f.to.toLowerCase() === to.toLowerCase() ||
        f.toCity.toLowerCase().includes(to.toLowerCase())
    );
  }
  if (airline) {
    results = results.filter((f) => f.airline.toLowerCase() === airline.toLowerCase());
  }
  if (maxPrice) {
    results = results.filter((f) => f.price <= Number(maxPrice));
  }

  res.json({ success: true, count: results.length, data: results });
});

app.get('/api/flights/:id', (req, res) => {
  const flight = mockStore.flights.find((f) => f.id === req.params.id);
  if (!flight) {
    return res.status(404).json({ success: false, error: 'Flight not found' });
  }
  res.json({ success: true, data: flight });
});

// HOTELS API
app.get('/api/hotels', (req, res) => {
  const { city, stars, maxPrice } = req.query;
  let results = mockStore.hotels;

  if (city) {
    results = results.filter((h) => h.city.toLowerCase().includes(city.toLowerCase()));
  }
  if (stars) {
    results = results.filter((h) => h.starRating === Number(stars));
  }
  if (maxPrice) {
    results = results.filter((h) => h.pricePerNight <= Number(maxPrice));
  }

  res.json({ success: true, count: results.length, data: results });
});

app.get('/api/hotels/:id', (req, res) => {
  const hotel = mockStore.hotels.find((h) => h.id === req.params.id);
  if (!hotel) {
    return res.status(404).json({ success: false, error: 'Hotel not found' });
  }
  res.json({ success: true, data: hotel });
});

// BUSES API
app.get('/api/buses', (req, res) => {
  const { from, to, operator } = req.query;
  let results = mockStore.buses;

  if (from) {
    results = results.filter((b) => b.from.toLowerCase() === from.toLowerCase());
  }
  if (to) {
    results = results.filter((b) => b.to.toLowerCase() === to.toLowerCase());
  }
  if (operator) {
    results = results.filter((b) => b.operator.toLowerCase().includes(operator.toLowerCase()));
  }

  res.json({ success: true, count: results.length, data: results });
});

app.get('/api/buses/:id', (req, res) => {
  const bus = mockStore.buses.find((b) => b.id === req.params.id);
  if (!bus) {
    return res.status(404).json({ success: false, error: 'Bus not found' });
  }
  res.json({ success: true, data: bus });
});

// RAILWAYS API
app.get('/api/railways', (req, res) => {
  const { from, to } = req.query;
  let results = mockStore.railways;

  if (from) {
    results = results.filter((r) => r.from.toLowerCase() === from.toLowerCase());
  }
  if (to) {
    results = results.filter((r) => r.to.toLowerCase() === to.toLowerCase());
  }

  res.json({ success: true, count: results.length, data: results });
});

app.get('/api/railways/:id', (req, res) => {
  const train = mockStore.railways.find((r) => r.id === req.params.id);
  if (!train) {
    return res.status(404).json({ success: false, error: 'Train not found' });
  }
  res.json({ success: true, data: train });
});

// OFFERS & FAQS API
app.get('/api/offers', (req, res) => {
  res.json({ success: true, count: mockStore.offers.length, data: mockStore.offers });
});

app.get('/api/faqs', (req, res) => {
  res.json({ success: true, data: mockStore.faqs });
});

// BOOKINGS API
app.get('/api/bookings', (req, res) => {
  res.json({ success: true, count: bookings.length, data: bookings });
});

app.post('/api/bookings', validateBooking, (req, res) => {
  const bookingData = req.body;
  const newBooking = {
    id: `EZ-${(bookingData.type || 'FL').slice(0, 2).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
    createdAt: new Date().toISOString(),
    status: 'Confirmed',
    paymentStatus: 'Paid',
    ...bookingData
  };

  bookings.unshift(newBooking);
  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: newBooking
  });
});

app.post('/api/bookings/:id/cancel', (req, res) => {
  const { id } = req.params;
  const { reason } = req.body || {};
  const bookingIndex = bookings.findIndex((b) => b.id === id);

  if (bookingIndex === -1) {
    return res.status(404).json({ success: false, error: 'Booking not found' });
  }

  bookings[bookingIndex].status = 'Cancelled';
  bookings[bookingIndex].cancellationReason = reason || 'User requested cancellation';
  bookings[bookingIndex].cancelledAt = new Date().toISOString();
  bookings[bookingIndex].refundStatus = 'Initiated (Processed in 5-7 days)';

  res.json({
    success: true,
    message: 'Booking cancelled successfully',
    data: bookings[bookingIndex]
  });
});

// AUTH API
app.post('/api/auth/login', sensitiveLimiter, validateLogin, (req, res) => {
  const { identifier, method } = req.body;

  const user = {
    id: `USR-${Math.floor(100000 + Math.random() * 900000)}`,
    name: method === 'phone' ? `Traveler ${identifier.slice(-4)}` : identifier.split('@')[0],
    email: method === 'email' ? identifier : `user${identifier.slice(-4)}@exploreeaz.com`,
    phone: method === 'phone' ? identifier : '+91 9876543210',
    tier: 'Gold Explorer',
    token: `jwt-sim-${Date.now()}`
  };

  res.json({
    success: true,
    message: 'Login successful',
    data: user
  });
});

app.post('/api/auth/register', sensitiveLimiter, validateRegister, (req, res) => {
  const { name, email, phone } = req.body;

  const user = {
    id: `USR-${Math.floor(100000 + Math.random() * 900000)}`,
    name,
    email,
    phone: phone || '+91 9876543210',
    tier: 'Classic Explorer',
    token: `jwt-sim-${Date.now()}`
  };

  users.push(user);
  res.status(201).json({
    success: true,
    message: 'Account registered successfully',
    data: user
  });
});

// PAYMENT API
app.post('/api/payment', sensitiveLimiter, validatePayment, (req, res) => {
  const { firstName, lastName, email, amount, currency } = req.body;

  const paymentRecord = {
    paymentId: `PAY-${Date.now()}`,
    amount: Number(amount),
    currency: currency || 'INR',
    name: `${firstName} ${lastName || ''}`.trim(),
    email,
    status: 'Success',
    processedAt: new Date().toISOString()
  };

  res.status(201).json({
    success: true,
    message: 'Payment verified and processed successfully',
    data: paymentRecord
  });
});

// CONTACT API
app.post('/api/contact', sensitiveLimiter, validateContact, (req, res) => {
  const { name, email, message, subject } = req.body;

  const inquiry = {
    id: `INQ-${Math.floor(10000 + Math.random() * 90000)}`,
    name,
    email,
    subject: subject || 'General Inquiry',
    message,
    receivedAt: new Date().toISOString()
  };

  res.status(201).json({
    success: true,
    message: 'Inquiry received. Customer care will respond within 30 minutes.',
    data: inquiry
  });
});

// 2. API 404 Handler
app.use(notFoundHandler);

// 3. Static Assets & Client Serving
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// 4. Centralized Error Handler
app.use(errorHandler);

// Server Startup (Only when executed directly)
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`[ExploreEase Server] Running on http://localhost:${PORT} (${NODE_ENV} mode)`);
  });

  // Graceful Shutdown
  function gracefulShutdown(signal) {
    console.log(`[ExploreEase Server] Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log('[ExploreEase Server] Closed out remaining connections.');
      process.exit(0);
    });

    setTimeout(() => {
      console.error('[ExploreEase Server] Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  }

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

module.exports = app;
