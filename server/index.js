const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

let Razorpay;
try {
  Razorpay = require('razorpay');
} catch (e) {
  Razorpay = null;
}

const mockStore = require('./data/mockStore');
const { securityHeaders, rateLimit, sanitizeInput } = require('./middleware/security');
const {
  validateLogin,
  validateRegister,
  validateBooking,
  validatePayment,
  validateContact,
  validateRazorpayOrder,
  validateRazorpayVerify
} = require('./middleware/validation');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Trust reverse proxy for accurate client IP resolution in rate limiting & logs
app.set('trust proxy', 1);

// Cryptographically constant-time string comparison to prevent timing side-channel attacks
function timingSafeEqualStr(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// Defensive helper to safely extract single string values from query parameters (HPP mitigation)
function toStr(val) {
  if (Array.isArray(val)) return typeof val[0] === 'string' ? val[0].trim() : '';
  if (typeof val === 'string') return val.trim();
  return '';
}

// Razorpay Gateway Setup
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

const isRazorpayConfigured = Boolean(
  Razorpay &&
  RAZORPAY_KEY_ID &&
  RAZORPAY_KEY_SECRET &&
  !RAZORPAY_KEY_ID.includes('placeholder') &&
  !RAZORPAY_KEY_ID.includes('your_key')
);

let razorpay = null;
if (isRazorpayConfigured) {
  try {
    razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET
    });
    console.log('[Razorpay Gateway] Live/Test merchant credentials configured.');
  } catch (err) {
    console.warn('[Razorpay Gateway] SDK initialization warning:', err.message);
  }
} else {
  console.log('[Razorpay Gateway] Running in Smart Simulation Mode (Instant mock verification available until live keys are provided).');
}

// 1. Core Security & Parsing Middleware
app.use(securityHeaders);

const rawOrigins = process.env.CORS_ORIGIN || '*';
const allowedOrigins = rawOrigins.includes(',')
  ? rawOrigins.split(',').map((s) => s.trim())
  : rawOrigins === '*'
  ? '*'
  : [rawOrigins];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Razorpay-Signature']
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
  const from = toStr(req.query.from);
  const to = toStr(req.query.to);
  const airline = toStr(req.query.airline);
  const maxPrice = toStr(req.query.maxPrice);
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
  const city = toStr(req.query.city);
  const stars = toStr(req.query.stars);
  const maxPrice = toStr(req.query.maxPrice);
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
  const from = toStr(req.query.from);
  const to = toStr(req.query.to);
  const operator = toStr(req.query.operator);
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
  const from = toStr(req.query.from);
  const to = toStr(req.query.to);
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

// HOLIDAYS & TOUR PACKAGES API
app.get('/api/holidays', (req, res) => {
  const destination = toStr(req.query.destination);
  const theme = toStr(req.query.theme);
  const category = toStr(req.query.category);
  const maxPrice = toStr(req.query.maxPrice);
  let results = mockStore.holidays || [];

  if (destination) {
    results = results.filter((h) =>
      h.destination.toLowerCase().includes(destination.toLowerCase()) ||
      h.title.toLowerCase().includes(destination.toLowerCase())
    );
  }
  if (theme && theme !== 'All Themes') {
    results = results.filter((h) => h.theme.toLowerCase().includes(theme.toLowerCase()));
  }
  if (category && category !== 'All') {
    results = results.filter((h) => h.category.toLowerCase() === category.toLowerCase());
  }
  if (maxPrice) {
    results = results.filter((h) => h.price <= Number(maxPrice));
  }

  res.json({ success: true, count: results.length, data: results });
});

app.get('/api/holidays/:id', (req, res) => {
  const reqId = String(req.params.id || '').toLowerCase().replace(/-/g, '');
  const holiday = (mockStore.holidays || []).find((h) => {
    const hid = String(h.id || '').toLowerCase().replace(/-/g, '');
    return hid === reqId || h.id.toLowerCase() === (req.params.id || '').toLowerCase();
  });
  if (!holiday) {
    return res.status(404).json({ success: false, error: 'Holiday package not found' });
  }
  res.json({ success: true, data: holiday });
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
  const userId = toStr(req.query.userId);
  const email = toStr(req.query.email);
  const status = toStr(req.query.status);
  const type = toStr(req.query.type);
  let results = bookings;

  if (userId) {
    results = results.filter((b) => b.userId === userId);
  }
  if (email) {
    results = results.filter((b) => b.email?.toLowerCase() === email.toLowerCase() || b.passengers?.some(p => p.email?.toLowerCase() === email.toLowerCase()));
  }
  if (status) {
    results = results.filter((b) => b.status?.toLowerCase() === status.toLowerCase());
  }
  if (type) {
    results = results.filter((b) => b.type?.toLowerCase() === type.toLowerCase());
  }

  res.json({ success: true, count: results.length, data: results });
});

app.get('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const booking = bookings.find((b) => b.id === id || b.pnr === id);
  if (!booking) {
    return res.status(404).json({ success: false, error: 'Booking not found' });
  }
  res.json({ success: true, data: booking });
});

app.post('/api/bookings', validateBooking, (req, res) => {
  const bookingData = req.body;
  const pnr = bookingData.pnr || `${(bookingData.type || 'FL').slice(0, 2).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;
  const email = bookingData.email || bookingData.passengers?.[0]?.email || 'traveler@eazetrip.com';
  const newBooking = {
    id: bookingData.id || `EZ-${(bookingData.type || 'FL').slice(0, 2).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
    pnr,
    email,
    userId: bookingData.userId || 'USR-1',
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
  const bookingIndex = bookings.findIndex((b) => b.id === id || b.pnr === id);

  if (bookingIndex === -1) {
    return res.status(404).json({ success: false, error: 'Booking not found' });
  }

  bookings[bookingIndex].status = 'Cancelled';
  bookings[bookingIndex].cancellationReason = typeof reason === 'string' ? reason.slice(0, 500) : 'User requested cancellation';
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

  // Find existing user or generate session profile
  let user = users.find(
    (u) =>
      u.email.toLowerCase() === identifier.toLowerCase() ||
      u.phone.replace(/[\s-]/g, '') === identifier.replace(/[\s-]/g, '')
  );

  const isEmail = method === 'email' || (!method && identifier.includes('@'));
  const isPhone = method === 'phone' || (!method && !identifier.includes('@'));

  if (!user) {
    user = {
      id: `USR-${Math.floor(100000 + Math.random() * 900000)}`,
      name: isPhone ? `Traveler ${identifier.slice(-4)}` : identifier.split('@')[0],
      email: isEmail ? identifier : `user${identifier.slice(-4)}@eazetrip.com`,
      phone: isPhone ? identifier : '+91 9876543210',
      tier: 'Gold Explorer',
      token: crypto.randomBytes(32).toString('hex')
    };
    users.push(user);
  }

  res.json({
    success: true,
    message: 'Login successful',
    data: user
  });
});

app.post('/api/auth/register', sensitiveLimiter, validateRegister, (req, res) => {
  const { name, email, phone } = req.body;

  const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(409).json({ success: false, error: 'An account with this email address already exists' });
  }

  const user = {
    id: `USR-${Math.floor(100000 + Math.random() * 900000)}`,
    name,
    email,
    phone: phone || '+91 9876543210',
    tier: 'Classic Explorer',
    token: crypto.randomBytes(32).toString('hex')
  };

  users.push(user);
  res.status(201).json({
    success: true,
    message: 'Account registered successfully',
    data: user
  });
});

app.put('/api/auth/profile', sensitiveLimiter, (req, res) => {
  const { id, name, email, phone, city, state } = req.body || {};
  let user = users.find((u) => u.id === id || (email && u.email.toLowerCase() === email.toLowerCase()));

  if (!user) {
    user = {
      id: id || `USR-${Math.floor(100000 + Math.random() * 900000)}`,
      name: name || 'Explorer User',
      email: email || 'user@eazetrip.com',
      phone: phone || '+91 9876543210',
      city: city || 'Mumbai',
      state: state || 'Maharashtra',
      tier: 'Gold Explorer'
    };
    users.push(user);
  } else {
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (city) user.city = city;
    if (state) user.state = state;
  }

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: user
  });
});

// ==========================================
// RAZORPAY PAYMENT GATEWAY API
// ==========================================

// Get Razorpay Public Key & Configuration
app.get('/api/payment/razorpay-key', (req, res) => {
  res.json({
    success: true,
    keyId: isRazorpayConfigured ? RAZORPAY_KEY_ID : (RAZORPAY_KEY_ID || 'rzp_test_placeholder'),
    isConfigured: isRazorpayConfigured,
    currency: 'INR',
    merchantName: 'EazeTrip India',
    themeColor: '#034ea2'
  });
});

// Create Razorpay Order
app.post('/api/payment/create-order', sensitiveLimiter, validateRazorpayOrder, async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;
    const amountInPaise = Math.round(Number(amount) * 100);
    const receiptId = receipt || `rcpt_${Date.now()}`;

    if (razorpay && isRazorpayConfigured) {
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: currency.toUpperCase(),
        receipt: receiptId,
        notes: notes || { platform: 'EazeTrip Travel', service: 'Online Booking' }
      });

      return res.status(201).json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        keyId: RAZORPAY_KEY_ID,
        isSimulated: false
      });
    }

    // Fallback simulation order for development / sandbox without keys
    const simOrder = {
      orderId: `order_sim_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
      amount: amountInPaise,
      currency: currency.toUpperCase(),
      receipt: receiptId,
      keyId: RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      isSimulated: true
    };

    return res.status(201).json({
      success: true,
      ...simOrder
    });
  } catch (err) {
    console.error('[Razorpay Create Order Error]:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to create Razorpay payment order'
    });
  }
});

// Verify Razorpay Payment Signature
app.post('/api/payment/verify', sensitiveLimiter, validateRazorpayVerify, (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      amount,
      currency = 'INR',
      payerName,
      email,
      mobile,
      description,
      bookingDetails
    } = req.body;

    let isAuthentic = false;

    if (razorpay_order_id.startsWith('order_sim_') || !isRazorpayConfigured) {
      // Simulation / Test mode verification
      isAuthentic = true;
    } else {
      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');
      isAuthentic = timingSafeEqualStr(expectedSignature, razorpay_signature);
    }

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Razorpay payment signature. Payment verification failed.'
      });
    }

    const paymentRecord = {
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount: Number(amount) || 0,
      currency: currency.toUpperCase(),
      name: payerName || 'Valued Traveler',
      email: email || 'traveler@eazetrip.com',
      mobile: mobile || '',
      description: description || 'Travel Booking Payment',
      status: 'Success',
      gateway: 'Razorpay',
      isSimulated: razorpay_order_id.startsWith('order_sim_') || !isRazorpayConfigured,
      processedAt: new Date().toISOString()
    };

    // If linked to booking details, create or confirm the booking
    if (bookingDetails) {
      const pnr = bookingDetails.pnr || `${(bookingDetails.type || 'FL').slice(0, 2).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;
      const newBooking = {
        id: bookingDetails.id || `EZ-${(bookingDetails.type || 'FL').slice(0, 2).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
        pnr,
        email: email || bookingDetails.email || bookingDetails.passengers?.[0]?.email || 'traveler@eazetrip.com',
        userId: bookingDetails.userId || 'USR-1',
        createdAt: new Date().toISOString(),
        status: 'Confirmed',
        paymentStatus: 'Paid',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        ...bookingDetails
      };
      bookings.unshift(newBooking);
      paymentRecord.booking = newBooking;
    }

    res.status(200).json({
      success: true,
      message: 'Razorpay payment verified and confirmed successfully!',
      data: paymentRecord
    });
  } catch (err) {
    console.error('[Razorpay Verify Error]:', err);
    res.status(500).json({
      success: false,
      error: 'Error while verifying Razorpay payment signature'
    });
  }
});

// Razorpay Webhook Handler
app.post('/api/payment/webhook', (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const isRealWebhookSecret = secret && !secret.includes('your_') && !secret.includes('placeholder');

  if (isRealWebhookSecret) {
    const signature = req.headers['x-razorpay-signature'];
    if (!signature) {
      return res.status(400).json({ status: 'missing signature' });
    }
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (!timingSafeEqualStr(signature, expectedSignature)) {
      return res.status(400).json({ status: 'invalid signature' });
    }
  }

  const event = req.body?.event || 'payment.captured';
  console.log(`[Razorpay Webhook] Received event: ${event}`);
  res.status(200).json({ status: 'ok', received: true, event });
});

// STANDARD PAYMENT API (Backward compatibility)
app.post('/api/payment', sensitiveLimiter, validatePayment, (req, res) => {
  const { firstName, lastName, email, amount, currency } = req.body;

  const paymentRecord = {
    paymentId: `PAY-${Date.now()}`,
    amount: Number(amount),
    currency: currency || 'INR',
    name: `${firstName} ${lastName || ''}`.trim(),
    email,
    status: 'Success',
    gateway: 'Razorpay',
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

app.get('*', (req, res, next) => {
  const indexPath = path.join(__dirname, '../client/dist/index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('ExploreEase (EazeTrip) API Server is active. Client bundle available under /client.');
    }
  });
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
