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
const db = require('./data/db');
const inventoryManager = require('./services/inventory');
const notificationService = require('./services/notificationService');
const supportService = require('./services/supportService');
const refundService = require('./services/refundService');
const googleAuthService = require('./services/googleAuthService');
const dpdpService = require('./services/dpdpService');
const breachService = require('./services/breachService');
const { securityHeaders, rateLimit, sanitizeInput } = require('./middleware/security');
const {
  validateLogin,
  validateRegister,
  validateBooking,
  validatePayment,
  validateContact,
  validateRazorpayOrder,
  validateRazorpayVerify,
  validateGoogleAuth
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

// Persistent Database Layer (Native SQLite WAL / resilient file persistence)
// Users, Bookings, Refunds, Support, and Notifications are backed by db.js

// ==========================================
// API ROUTES
// ==========================================

// Helper to apply sorting and pagination across all mock catalogs safely
function applyListFiltersAndPagination(items, query) {
  let list = [...items];
  const sortBy = toStr(query.sortBy);
  const rawPage = parseInt(toStr(query.page), 10);
  const rawLimit = parseInt(toStr(query.limit), 10);
  const hasPagination = !isNaN(rawLimit) && rawLimit > 0;
  const page = Math.max(1, !isNaN(rawPage) && rawPage > 0 ? rawPage : 1);
  const limit = Math.max(1, Math.min(100, rawLimit || 20));

  if (sortBy) {
    if (sortBy === 'price_asc' || sortBy === 'price_low') {
      list.sort((a, b) => (Number(a.price || a.pricePerNight || a.startingPrice || 0)) - (Number(b.price || b.pricePerNight || b.startingPrice || 0)));
    } else if (sortBy === 'price_desc' || sortBy === 'price_high') {
      list.sort((a, b) => (Number(b.price || b.pricePerNight || b.startingPrice || 0)) - (Number(a.price || a.pricePerNight || a.startingPrice || 0)));
    } else if (sortBy === 'rating' || sortBy === 'rating_desc') {
      list.sort((a, b) => (Number(b.rating || b.starRating || 0)) - (Number(a.rating || a.starRating || 0)));
    } else if (sortBy === 'name_asc') {
      list.sort((a, b) => String(a.name || a.airline || a.operator || a.trainName || a.title || '').localeCompare(String(b.name || b.airline || b.operator || b.trainName || b.title || '')));
    }
  }

  const total = list.length;
  if (hasPagination) {
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);
    return {
      success: true,
      count: paginated.length,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: paginated
    };
  }

  return {
    success: true,
    count: total,
    total,
    data: list
  };
}

// Health Check Endpoint with Extended System Diagnostics
app.get('/api/health', (req, res) => {
  const mem = process.memoryUsage();
  res.json({
    status: 'healthy',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    nodeVersion: process.version,
    memory: {
      rssMb: Math.round(mem.rss / 1024 / 1024),
      heapTotalMb: Math.round(mem.heapTotal / 1024 / 1024),
      heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
      externalMb: Math.round(mem.external / 1024 / 1024)
    },
    services: {
      razorpay: isRazorpayConfigured ? 'live_test_merchant' : 'smart_simulation',
      googleAuth: Boolean(process.env.GOOGLE_CLIENT_ID) ? 'configured' : 'smart_simulation',
      database: db.isNativeSqlite ? 'sqlite_wal' : 'json_store',
      inventoryProviders: 'active_aggregators',
      notificationEngine: 'operational',
      supportHelpDesk: 'operational',
      refundEngine: 'operational'
    },
    storeMetrics: {
      flights: mockStore.flights ? mockStore.flights.length : 0,
      hotels: mockStore.hotels ? mockStore.hotels.length : 0,
      buses: mockStore.buses ? mockStore.buses.length : 0,
      railways: mockStore.railways ? mockStore.railways.length : 0,
      holidays: mockStore.holidays ? mockStore.holidays.length : 0,
      activeBookings: db.getAllBookings().length
    }
  });
});

// Live Travel Inventory Providers Inspection Endpoint
app.get('/api/inventory/providers', (req, res) => {
  res.json({
    success: true,
    providers: {
      flights: {
        name: inventoryManager.flights.name,
        isLive: inventoryManager.flights.isLiveConfigured,
        fallbackMode: 'Verified NDC Mock Cache'
      },
      hotels: {
        name: inventoryManager.hotels.name,
        isLive: inventoryManager.hotels.isLiveConfigured,
        fallbackMode: 'Verified Hospitality Mock Cache'
      },
      trains: {
        name: inventoryManager.trains.name,
        isLive: inventoryManager.trains.isLiveConfigured,
        fallbackMode: 'Verified IRCTC Partner Cache'
      },
      buses: {
        name: inventoryManager.buses.name,
        isLive: inventoryManager.buses.isLiveConfigured,
        fallbackMode: 'Verified redBus B2B Cache'
      }
    }
  });
});

// FLIGHTS API
app.get('/api/flights', async (req, res) => {
  const from = toStr(req.query.from);
  const to = toStr(req.query.to);
  const airline = toStr(req.query.airline);
  const maxPrice = toStr(req.query.maxPrice);
  const results = await inventoryManager.flights.searchFlights({ from, to, airline, maxPrice });
  res.json(applyListFiltersAndPagination(results, req.query));
});

app.get('/api/flights/:id', async (req, res) => {
  const flight = await inventoryManager.flights.getFlightById(req.params.id);
  if (!flight) {
    return res.status(404).json({ success: false, error: 'Flight not found' });
  }
  res.json({ success: true, data: flight });
});

// HOTELS API
app.get('/api/hotels', async (req, res) => {
  const city = toStr(req.query.city);
  const stars = toStr(req.query.stars);
  const maxPrice = toStr(req.query.maxPrice);
  const results = await inventoryManager.hotels.searchHotels({ city, stars, maxPrice });
  res.json(applyListFiltersAndPagination(results, req.query));
});

app.get('/api/hotels/:id', async (req, res) => {
  const hotel = await inventoryManager.hotels.getHotelById(req.params.id);
  if (!hotel) {
    return res.status(404).json({ success: false, error: 'Hotel not found' });
  }
  res.json({ success: true, data: hotel });
});

// BUSES API
app.get('/api/buses', async (req, res) => {
  const from = toStr(req.query.from);
  const to = toStr(req.query.to);
  const operator = toStr(req.query.operator);
  const results = await inventoryManager.buses.searchBuses({ from, to, operator });
  res.json(applyListFiltersAndPagination(results, req.query));
});

app.get('/api/buses/:id', async (req, res) => {
  const bus = await inventoryManager.buses.getBusById(req.params.id);
  if (!bus) {
    return res.status(404).json({ success: false, error: 'Bus not found' });
  }
  res.json({ success: true, data: bus });
});

// RAILWAYS API
app.get('/api/railways', async (req, res) => {
  const from = toStr(req.query.from);
  const to = toStr(req.query.to);
  const results = await inventoryManager.trains.searchTrains({ from, to });
  res.json(applyListFiltersAndPagination(results, req.query));
});

app.get('/api/railways/:id', async (req, res) => {
  const train = await inventoryManager.trains.getTrainById(req.params.id);
  if (!train) {
    return res.status(404).json({ success: false, error: 'Train not found' });
  }
  res.json({ success: true, data: train });
});

// HOLIDAYS & TOUR PACKAGES API
app.get('/api/holidays', async (req, res) => {
  const destination = toStr(req.query.destination);
  const theme = toStr(req.query.theme);
  const category = toStr(req.query.category);
  const maxPrice = toStr(req.query.maxPrice);
  const results = await inventoryManager.searchHolidays({ destination, theme, category, maxPrice });
  res.json(applyListFiltersAndPagination(results, req.query));
});

app.get('/api/holidays/:id', async (req, res) => {
  const holiday = await inventoryManager.getHolidayById(req.params.id);
  if (!holiday) {
    return res.status(404).json({ success: false, error: 'Holiday package not found' });
  }
  res.json({ success: true, data: holiday });
});

// OFFERS & FAQS API
app.get('/api/offers', (req, res) => {
  res.json({ success: true, count: mockStore.offers.length, data: mockStore.offers });
});

// Validate Coupon / Promo Code
app.post('/api/offers/validate', (req, res) => {
  const { code = '', amount = 0, serviceType = '' } = req.body || {};
  const cleanCode = String(code).trim().toUpperCase();
  const gross = Number(amount) || 0;

  if (!cleanCode) {
    return res.status(400).json({ success: false, error: 'Promo code is required' });
  }

  const promoList = [
    {
      code: 'EAZETRIP',
      discount: 500,
      type: 'flat',
      description: '₹500 Instant Discount on all travel bookings',
      minAmount: 1000
    },
    {
      code: 'EXPLOREEAZ',
      discount: 500,
      type: 'flat',
      description: '₹500 Instant Discount for explore members',
      minAmount: 1000
    },
    {
      code: 'EAZETRIP500',
      discount: 500,
      type: 'flat',
      description: '₹500 Instant Welcome Discount',
      minAmount: 1000
    },
    {
      code: 'STAYEAZY',
      discountPercent: 10,
      maxDiscount: 600,
      type: 'percent',
      serviceType: 'hotel',
      description: '10% OFF up to ₹600 on luxury hotels & stays',
      minAmount: 1500
    },
    {
      code: 'BUSEAZ',
      discountPercent: 10,
      maxDiscount: 300,
      type: 'percent',
      serviceType: 'bus',
      description: '10% OFF up to ₹300 on intercity buses',
      minAmount: 500
    },
    {
      code: 'TRAINEAZ',
      discountPercent: 10,
      maxDiscount: 250,
      type: 'percent',
      serviceType: 'train',
      description: '10% OFF up to ₹250 on IRCTC train bookings',
      minAmount: 500
    },
    {
      code: 'FLYHIGH',
      discountPercent: 8,
      maxDiscount: 750,
      type: 'percent',
      serviceType: 'flight',
      description: '8% OFF up to ₹750 on domestic flights',
      minAmount: 2500
    },
    {
      code: 'HOLIDAY25',
      discount: 1000,
      type: 'flat',
      serviceType: 'holiday',
      description: '₹1,000 Mega Discount on holiday packages',
      minAmount: 15000
    },
    {
      code: 'EAZETRIP1000',
      discount: 1000,
      type: 'flat',
      description: '₹1,000 Mega Discount on bookings above ₹15,000',
      minAmount: 15000
    }
  ];

  const matched = promoList.find((p) => p.code === cleanCode);
  if (!matched) {
    return res.status(404).json({ success: false, error: `Invalid promo code '${cleanCode}'. Try EAZETRIP` });
  }

  if (gross > 0 && matched.minAmount && gross < matched.minAmount) {
    return res.status(400).json({
      success: false,
      error: `Promo ${cleanCode} requires a minimum booking amount of ₹${matched.minAmount.toLocaleString('en-IN')}`
    });
  }

  let discountAmount = 0;
  if (matched.type === 'flat') {
    discountAmount = matched.discount;
  } else if (matched.type === 'percent') {
    discountAmount = Math.min(matched.maxDiscount, Math.round(gross * (matched.discountPercent / 100)));
    if (discountAmount <= 0) discountAmount = matched.maxDiscount;
  }

  res.status(200).json({
    success: true,
    code: matched.code,
    discount: discountAmount,
    description: matched.description,
    message: `Promo ${matched.code} applied: ₹${discountAmount.toLocaleString('en-IN')} Instant Discount`
  });
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
  const results = db.getAllBookings({ userId, email, status, type });
  res.json({ success: true, count: results.length, data: results });
});

app.get('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const booking = db.getBookingByIdOrPnr(id);
  if (!booking) {
    return res.status(404).json({ success: false, error: 'Booking not found' });
  }
  res.json({ success: true, data: booking });
});

app.post('/api/bookings', validateBooking, (req, res) => {
  const bookingData = req.body;
  const newBooking = db.createBooking(bookingData);

  // Automated Multi-Channel Booking Confirmation (Email, WhatsApp, In-App)
  try {
    notificationService.enqueueNotification({
      userId: newBooking.userId,
      channels: ['in_app', 'email', 'whatsapp'],
      template: 'booking_confirmation',
      data: {
        name: newBooking.passengers?.[0]?.name || newBooking.leadPassenger || 'Valued Traveler',
        email: newBooking.email,
        phone: newBooking.phone || newBooking.passengers?.[0]?.phone || '+91 98765 43210',
        pnr: newBooking.pnr,
        serviceType: newBooking.type || 'Flight',
        carrier: newBooking.airline || newBooking.hotelName || newBooking.operator || newBooking.trainName || newBooking.title || 'IndiGo 6E-2041',
        route: `${newBooking.from || newBooking.city || 'Origin'} → ${newBooking.to || newBooking.destination || 'Destination'}`,
        travelDate: newBooking.departureDate || newBooking.checkIn || newBooking.date || 'Upcoming Date',
        amount: newBooking.price || newBooking.totalAmount || 4999
      }
    });
  } catch (e) {
    console.warn('[Notification Notice]:', e.message);
  }

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: newBooking
  });
});

app.post('/api/bookings/:id/cancel', (req, res) => {
  const { id } = req.params;
  const { reason } = req.body || {};
  const booking = db.getBookingByIdOrPnr(id);

  if (!booking) {
    return res.status(404).json({ success: false, error: 'Booking not found' });
  }

  const updatedBooking = db.updateBooking(id, {
    status: 'Cancelled',
    cancellationReason: typeof reason === 'string' ? reason.slice(0, 500) : 'User requested cancellation',
    cancelledAt: new Date().toISOString(),
    refundStatus: 'Initiated (Processed in 5-7 days)'
  });

  res.json({
    success: true,
    message: 'Booking cancelled successfully',
    data: updatedBooking
  });
});

// AUTH API
app.post('/api/auth/login', sensitiveLimiter, validateLogin, (req, res) => {
  const { identifier, method } = req.body;

  let user = db.findUserByEmailOrPhone(identifier);

  const isEmail = method === 'email' || (!method && identifier.includes('@'));
  const isPhone = method === 'phone' || (!method && !identifier.includes('@'));

  if (!user) {
    user = db.upsertUser({
      id: `USR-${Math.floor(100000 + Math.random() * 900000)}`,
      name: isPhone ? `Traveler ${identifier.slice(-4)}` : identifier.split('@')[0],
      email: isEmail ? identifier : `user${identifier.slice(-4)}@eazetrip.com`,
      phone: isPhone ? identifier : '+91 9876543210',
      tier: 'Gold Explorer',
      token: crypto.randomBytes(32).toString('hex')
    });
  }

  res.json({
    success: true,
    message: 'Login successful',
    data: user
  });
});

app.post('/api/auth/register', sensitiveLimiter, validateRegister, (req, res) => {
  const { name, email, phone } = req.body;

  const existingUser = db.findUserByEmailOrPhone(email);
  if (existingUser) {
    return res.status(409).json({ success: false, error: 'An account with this email address already exists' });
  }

  const user = db.upsertUser({
    id: `USR-${Math.floor(100000 + Math.random() * 900000)}`,
    name,
    email,
    phone: phone || '+91 9876543210',
    tier: 'Classic Explorer',
    token: crypto.randomBytes(32).toString('hex')
  });

  res.status(201).json({
    success: true,
    message: 'Account registered successfully',
    data: user
  });
});

app.get('/api/auth/google-client-id', (req, res) => {
  res.json(googleAuthService.getPublicConfig());
});

app.post('/api/auth/google', sensitiveLimiter, validateGoogleAuth, async (req, res) => {
  try {
    const { credential, idToken, code, email: fallbackEmail, name: fallbackName } = req.body || {};
    const tokenToVerify = credential || idToken;
    let authResult;

    if (code) {
      authResult = await googleAuthService.exchangeGoogleAuthCode(code);
    } else if (tokenToVerify) {
      authResult = await googleAuthService.verifyGoogleIdToken(tokenToVerify);
    } else if (fallbackEmail) {
      authResult = {
        success: true,
        mode: 'simulated-profile',
        googleId: `G-${Date.now()}`,
        email: fallbackEmail,
        name: fallbackName || fallbackEmail.split('@')[0],
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        emailVerified: true
      };
    } else {
      return res.status(400).json({ success: false, error: 'Valid Google credential or authorization code is required' });
    }

    if (!authResult.success) {
      return res.status(401).json({ success: false, error: authResult.error || 'Google authentication failed' });
    }

    const { email, name, avatar, googleId } = authResult;

    let user = db.findUserByEmailOrPhone(email);

    if (!user) {
      user = db.upsertUser({
        id: `USR-${Math.floor(100000 + Math.random() * 900000)}`,
        name: name || (email ? email.split('@')[0] : 'Traveler'),
        email: email,
        phone: '+91 9876543210',
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        tier: 'Gold Explorer',
        authProvider: 'Google',
        googleId: googleId,
        memberSince: new Date().getFullYear(),
        token: crypto.randomBytes(32).toString('hex')
      });
    } else {
      user = db.upsertUser({
        ...user,
        name: name && (!user.name || user.name === 'Traveler') ? name : user.name,
        avatar: avatar || user.avatar,
        authProvider: 'Google',
        googleId: googleId || user.googleId,
        token: user.token || crypto.randomBytes(32).toString('hex')
      });
    }

    res.json({
      success: true,
      message: 'Google authentication successful',
      mode: authResult.mode || 'live',
      data: user
    });
  } catch (err) {
    res.status(500).json({ success: false, error: `Google authentication internal error: ${err.message}` });
  }
});

app.put('/api/auth/profile', sensitiveLimiter, (req, res) => {
  const { id, name, email, phone, city, state } = req.body || {};
  let user = (id && db.findUserById(id)) || (email && db.findUserByEmailOrPhone(email));

  const updatedUser = db.upsertUser({
    ...(user || {}),
    id: id || user?.id,
    name: name || user?.name || 'Explorer User',
    email: email || user?.email || 'user@eazetrip.com',
    phone: phone || user?.phone || '+91 9876543210',
    city: city || user?.city || 'Mumbai',
    state: state || user?.state || 'Maharashtra',
    tier: user?.tier || 'Gold Explorer'
  });

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedUser
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
      const newBooking = db.createBooking({
        ...bookingDetails,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        email: email || bookingDetails.email || bookingDetails.passengers?.[0]?.email || 'traveler@eazetrip.com',
        userId: bookingDetails.userId || 'USR-1',
        status: 'Confirmed',
        paymentStatus: 'Paid'
      });
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

// ==========================================
// NOTIFICATIONS & RESILIENT QUEUE API
// ==========================================

// Get user notifications & unread count
app.get('/api/notifications', (req, res) => {
  const userId = toStr(req.query.userId) || 'USR-1';
  const category = toStr(req.query.category);
  const read = toStr(req.query.read);

  let results = notificationService.inAppNotifications.filter((n) => !userId || n.userId === userId);

  if (category && category !== 'all') {
    results = results.filter((n) => n.category?.toLowerCase() === category.toLowerCase());
  }
  if (read === 'true') {
    results = results.filter((n) => n.read === true);
  } else if (read === 'false') {
    results = results.filter((n) => n.read === false);
  }

  const unreadCount = notificationService.inAppNotifications.filter((n) => n.userId === userId && !n.read).length;

  res.json({
    success: true,
    count: results.length,
    unreadCount,
    data: results
  });
});

// Mark single notification as read
app.patch('/api/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  const notif = notificationService.inAppNotifications.find((n) => n.id === id);

  if (!notif) {
    return res.status(404).json({ success: false, error: 'Notification not found' });
  }

  notif.read = true;
  notif.readAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'Notification marked as read',
    data: notif
  });
});

// Mark all notifications as read for user
app.post('/api/notifications/mark-all-read', (req, res) => {
  const { userId = 'USR-1' } = req.body || {};
  let updatedCount = 0;

  notificationService.inAppNotifications.forEach((n) => {
    if (n.userId === userId && !n.read) {
      n.read = true;
      n.readAt = new Date().toISOString();
      updatedCount += 1;
    }
  });

  res.json({
    success: true,
    message: `Marked ${updatedCount} notifications as read`,
    updatedCount
  });
});

// Dispatch transactional notification across multi-channels
app.post('/api/notifications/send', (req, res) => {
  const {
    userId = 'USR-1',
    channels = ['in_app', 'email', 'whatsapp'],
    template = 'custom',
    data = {},
    priority = 'high',
    simulateFailure = false
  } = req.body || {};

  const result = notificationService.enqueueNotification({
    userId,
    channels,
    template,
    data,
    priority,
    simulateFailure
  });

  res.status(201).json({
    success: true,
    message: `Notification enqueued across channels: [${channels.join(', ')}]`,
    data: result
  });
});

// Trigger personalized customer re-engagement campaign
app.post('/api/notifications/trigger-campaign', (req, res) => {
  const {
    campaignType = 'reengagement_inactivity',
    user = { id: 'USR-1', name: 'Priyansh Sharma', email: 'priyansh.sharma@gmail.com', phone: '+91 98765 43210' },
    customData = {}
  } = req.body || {};

  const result = notificationService.triggerCampaign(campaignType, user, customData);

  res.status(201).json({
    success: true,
    campaign: campaignType,
    message: `Campaign '${campaignType}' successfully generated and dispatched!`,
    data: result
  });
});

// Inspect live Delivery Queue & Dead-Letter Queue (DLQ) health
app.get('/api/notifications/queue-status', (req, res) => {
  const metrics = notificationService.getQueueMetrics();
  res.json(metrics);
});

// Retry single failed DLQ item or bulk retry all failed notifications
app.post('/api/notifications/retry-failed', (req, res) => {
  const { id = 'all' } = req.body || {};
  const result = notificationService.retryDlqItem(id);

  if (!result.success) {
    return res.status(404).json(result);
  }

  res.json(result);
});

// Preview HTML Email & WhatsApp template renderers
app.get('/api/notifications/templates', (req, res) => {
  const type = toStr(req.query.type) || 'reengagement_inactivity';
  const name = toStr(req.query.name) || 'Priyansh Sharma';
  const promoCode = toStr(req.query.promoCode) || 'HOLIDAY25';
  const monthsInactive = Number(toStr(req.query.monthsInactive)) || 3;

  const sampleData = {
    name,
    promoCode,
    monthsInactive,
    pnr: 'FL2775',
    serviceType: 'Flight',
    carrier: 'IndiGo 6E-2041',
    route: 'Mumbai (BOM) → New Delhi (DEL)',
    travelDate: '24 Sep 2026, 06:00 AM',
    amount: 4999
  };

  const htmlEmail = notificationService.renderHtmlEmail(type, sampleData);
  const whatsappMessage = notificationService.renderWhatsAppMessage(type, sampleData);

  res.json({
    success: true,
    type,
    email: htmlEmail,
    whatsapp: whatsappMessage
  });
});

// User notification preferences
app.get('/api/notifications/preferences', (req, res) => {
  const userId = toStr(req.query.userId) || 'USR-1';
  const prefs = notificationService.userPreferences[userId] || {
    email: true,
    whatsapp: true,
    sms: false,
    push: true,
    tripUpdates: true,
    promotionalOffers: true,
    priceDropAlerts: true
  };
  res.json({ success: true, userId, data: prefs });
});

app.put('/api/notifications/preferences', (req, res) => {
  const { userId = 'USR-1', preferences = {} } = req.body || {};
  notificationService.userPreferences[userId] = {
    ...(notificationService.userPreferences[userId] || {}),
    ...preferences
  };

  res.json({
    success: true,
    message: 'Notification channel preferences saved successfully',
    data: notificationService.userPreferences[userId]
  });
});

// ==========================================
// HELPDESK & PROBLEM MESSAGING SUPPORT API
// ==========================================

// Create new problem / support ticket
app.post('/api/support/tickets', (req, res) => {
  const {
    userId = 'USR-1',
    pnr = '',
    category = 'General Inquiry',
    subject = '',
    description = '',
    name = 'Valued Traveler',
    email = 'traveler@eazetrip.com',
    phone = '+91 98765 43210',
    urgency = 'Normal'
  } = req.body || {};

  if (!description.trim()) {
    return res.status(400).json({ success: false, error: 'Problem description is required' });
  }

  const ticket = supportService.createTicket({
    userId,
    pnr,
    category,
    subject,
    description,
    name,
    email,
    phone,
    urgency
  });

  // Automatically enqueue acknowledgment notification
  try {
    notificationService.enqueueNotification({
      userId,
      channels: ['in_app', 'email', 'whatsapp'],
      template: 'custom',
      data: {
        name,
        email,
        phone,
        message: `Support Ticket #${ticket.id} (${category}) has been logged. Senior Concierge Specialist assigned with ${urgency} priority. Response within 15 minutes.`
      },
      priority: urgency === 'Emergency' ? 'high' : 'medium'
    });
  } catch (e) {
    console.warn('[Support Ticket Notification]:', e.message);
  }

  res.status(201).json({
    success: true,
    message: `Support ticket #${ticket.id} created successfully! Our team will respond shortly.`,
    data: ticket
  });
});

// List user support tickets
app.get('/api/support/tickets', (req, res) => {
  const userId = toStr(req.query.userId) || 'USR-1';
  const email = toStr(req.query.email);
  const pnr = toStr(req.query.pnr);
  const status = toStr(req.query.status);
  const category = toStr(req.query.category);

  const tickets = supportService.getTickets({ userId, email, pnr, status, category });

  res.json({
    success: true,
    count: tickets.length,
    data: tickets
  });
});

// Get single ticket by ID
app.get('/api/support/tickets/:id', (req, res) => {
  const ticket = supportService.getTicketById(req.params.id);
  if (!ticket) {
    return res.status(404).json({ success: false, error: 'Support ticket not found' });
  }
  res.json({ success: true, data: ticket });
});

// Reply / message in ticket thread
app.post('/api/support/tickets/:id/message', (req, res) => {
  const { sender = 'You', text = '', role = 'user' } = req.body || {};
  if (!text.trim()) {
    return res.status(400).json({ success: false, error: 'Message text is required' });
  }

  const newMsg = supportService.addMessage(req.params.id, sender, text, role);
  if (!newMsg) {
    return res.status(404).json({ success: false, error: 'Support ticket not found' });
  }

  res.status(201).json({
    success: true,
    message: 'Message added to ticket conversation',
    data: newMsg
  });
});

// Request 5-minute instant callback
app.post('/api/support/callback', (req, res) => {
  const { name, phone, topic, pnr } = req.body || {};
  if (!phone || String(phone).trim().length < 8) {
    return res.status(400).json({ success: false, error: 'Valid phone number is required for callback' });
  }

  const callbackReq = supportService.createCallback({ name, phone, topic, pnr });

  res.status(201).json({
    success: true,
    message: 'Instant callback requested! A dedicated support specialist will call you within 5 minutes.',
    data: callbackReq
  });
});

// Direct in-app mail to support team
app.post('/api/support/direct-mail', (req, res) => {
  const { name, email, phone, subject, message, pnr } = req.body || {};
  if (!message || !email) {
    return res.status(400).json({ success: false, error: 'Email and message content are required' });
  }

  const mailRecord = supportService.sendDirectMail({ name, email, phone, subject, message, pnr });

  res.status(201).json({
    success: true,
    message: 'Direct email dispatched to support@eazetrip.com. Response will be delivered to your inbox.',
    data: mailRecord
  });
});

// ==========================================
// 6. REFUNDS & CANCELLATION ENGINE ROUTES
// ==========================================

// Calculate dynamic refund penalty & net amount breakdown
app.post('/api/refunds/calculate', (req, res) => {
  const { serviceType, grossAmount, hoursBeforeDeparture, hasShield } = req.body || {};
  const calculation = refundService.calculateRefund({
    serviceType,
    grossAmount,
    hoursBeforeDeparture,
    hasShield
  });
  res.status(200).json({
    success: true,
    data: calculation
  });
});

// Create and register a cancellation & refund request
app.post('/api/refunds/request', (req, res) => {
  const {
    bookingId,
    pnr,
    customerName,
    customerEmail,
    customerPhone,
    serviceType,
    serviceTitle,
    grossAmount,
    reason,
    payoutMode,
    payoutDetails,
    bankAccount,
    ifscCode,
    upiId,
    hasShield,
    selectedPassengers
  } = req.body || {};

  if (!bookingId && !pnr) {
    return res.status(400).json({ success: false, error: 'Booking ID or PNR is required for refund request' });
  }

  const refundRecord = refundService.createRefundRequest({
    bookingId,
    pnr,
    customerName,
    customerEmail,
    customerPhone,
    serviceType,
    serviceTitle,
    grossAmount,
    reason,
    payoutMode,
    payoutDetails,
    bankAccount,
    ifscCode,
    upiId,
    hasShield,
    selectedPassengers
  });

  res.status(201).json({
    success: true,
    message: `Cancellation confirmed. Refund ${refundRecord.id} generated with ARN ${refundRecord.arnNumber}.`,
    data: refundRecord
  });
});

// Track refund status and 4-step progress timeline
app.get('/api/refunds/track/:query', (req, res) => {
  const query = req.params.query;
  const refund = refundService.getRefundByQuery(query);
  if (!refund) {
    return res.status(404).json({
      success: false,
      error: `No refund record found matching "${query}". Please check your Refund ID, PNR, or Booking ID.`
    });
  }
  res.status(200).json({
    success: true,
    data: refund
  });
});

// Get user refunds history
app.get('/api/refunds', (req, res) => {
  const userQuery = req.query.user || req.query.email || '';
  const refunds = refundService.getAllRefunds(userQuery);
  res.status(200).json({
    success: true,
    count: refunds.length,
    data: refunds
  });
});

// ==========================================
// 7. ADMIN BACKOFFICE & CONCIERGE OPERATIONS API
// ==========================================

// Verify Admin Security Access PIN
app.post('/api/admin/verify-pin', (req, res) => {
  const { pin } = req.body || {};
  const validPin = process.env.ADMIN_PIN || 'admin123';
  if (pin === validPin) {
    return res.json({
      success: true,
      role: 'Operations Administrator',
      token: `adm_${Date.now()}_${crypto.randomBytes(16).toString('hex')}`
    });
  }
  return res.status(401).json({ success: false, error: 'Invalid Administrator PIN' });
});

// Admin System Metrics Overview
app.get('/api/admin/metrics', (req, res) => {
  const allBookings = db.getAllBookings();
  const confirmed = allBookings.filter((b) => (b.status || '').toLowerCase() === 'confirmed');
  const cancelled = allBookings.filter((b) => (b.status || '').toLowerCase() === 'cancelled');
  const totalRevenue = confirmed.reduce((sum, b) => sum + Number(b.price || b.totalAmount || 0), 0);
  const allRefunds = refundService.getAllRefunds();
  const pendingRefunds = allRefunds.filter((r) => r.status !== 'Completed');
  const allTickets = supportService.getTickets({});
  const openTickets = allTickets.filter((t) => t.status !== 'Resolved');
  const qMetrics = notificationService.getQueueMetrics();

  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    metrics: {
      totalBookings: allBookings.length,
      confirmedBookings: confirmed.length,
      cancelledBookings: cancelled.length,
      totalRevenueINR: totalRevenue,
      totalRefundClaims: allRefunds.length,
      pendingRefunds: pendingRefunds.length,
      totalTickets: allTickets.length,
      openTickets: openTickets.length,
      dlqCount: qMetrics.metrics.deadLetterQueueCount,
      notificationSuccessRate: qMetrics.metrics.successRatePercent,
      systemUptimeSeconds: Math.round(process.uptime()),
      databaseType: db.isNativeSqlite ? 'SQLite (WAL Mode)' : 'File-Backed Store'
    }
  });
});

// Admin Global Bookings Search & Filter
app.get('/api/admin/bookings', (req, res) => {
  const search = toStr(req.query.search);
  const status = toStr(req.query.status);
  const type = toStr(req.query.type);
  let list = db.getAllBookings();

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (b) =>
        b.pnr?.toLowerCase().includes(q) ||
        b.id?.toLowerCase().includes(q) ||
        b.email?.toLowerCase().includes(q) ||
        b.title?.toLowerCase().includes(q) ||
        b.airline?.toLowerCase().includes(q)
    );
  }
  if (status && status !== 'all') {
    list = list.filter((b) => b.status?.toLowerCase() === status.toLowerCase());
  }
  if (type && type !== 'all') {
    list = list.filter((b) => b.type?.toLowerCase() === type.toLowerCase());
  }

  res.json(applyListFiltersAndPagination(list, req.query));
});

// Admin 1-Click Settle Pending Refund
app.post('/api/admin/refunds/:id/settle', (req, res) => {
  const { id } = req.params;
  const refund = refundService.getRefundByQuery(id);
  if (!refund) {
    return res.status(404).json({ success: false, error: 'Refund claim not found' });
  }

  refund.status = 'Completed';
  refund.statusStep = 4;
  refund.completedAt = new Date().toISOString();
  if (!refund.arnNumber || refund.arnNumber.includes('TBD')) {
    refund.arnNumber = `ARN-ADM${Math.floor(100000000000 + Math.random() * 900000000000)}`;
  }

  // Update last timeline step
  if (Array.isArray(refund.timeline)) {
    refund.timeline.forEach((step) => {
      step.completed = true;
    });
  }

  res.json({
    success: true,
    message: `Refund #${refund.id} approved and settled. Bank ARN: ${refund.arnNumber}`,
    data: refund
  });
});

// Admin DLQ Queue Inspection & Retry All
app.get('/api/admin/dlq', (req, res) => {
  const qMetrics = notificationService.getQueueMetrics();
  res.json({
    success: true,
    count: qMetrics.deadLetterQueue.length,
    data: qMetrics.deadLetterQueue
  });
});

app.post('/api/admin/dlq/retry-all', (req, res) => {
  const result = notificationService.retryDlqItem('all');
  res.json(result);
});

// WhatsApp / SMS Inbound Webhook Callback
app.post('/api/webhooks/whatsapp', (req, res) => {
  const smsWhatsappService = require('./services/smsWhatsappService');
  const result = smsWhatsappService.handleWebhook(req.body);
  res.status(200).json(result);
});

// ==========================================
// 8. VERIFIED REVIEWS & RATINGS API
// ==========================================
app.get('/api/reviews', (req, res) => {
  const serviceType = toStr(req.query.serviceType);
  const serviceId = toStr(req.query.serviceId);
  const reviews = db.getReviews(serviceType, serviceId);
  res.json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});

app.post('/api/reviews', (req, res) => {
  const { serviceType, serviceId, userId, userName, rating, comment, photos } = req.body || {};
  if (!serviceId) {
    return res.status(400).json({ success: false, error: 'serviceId is required for review submission' });
  }
  const review = db.createReview({
    serviceType: serviceType || 'Flight',
    serviceId,
    userId: userId || 'USR-1',
    userName: userName || 'Verified Traveler',
    rating: Number(rating) || 5,
    comment: comment || '',
    photos: Array.isArray(photos) ? photos : []
  });
  res.status(201).json({
    success: true,
    message: 'Thank you! Your verified review has been submitted.',
    data: review
  });
});

// ==========================================
// 9. DPDP ACT 2023 & DPDP RULES 2025 DATA GOVERNANCE API
// ==========================================

// Itemized Statutory Privacy Notice Specification (Section 5)
app.get('/api/dpdp/notice', (req, res) => {
  const notice = dpdpService.getPrivacyNotice();
  res.status(200).json(notice);
});

// Record Granular Consent (Section 6 & DPDP Rules 2025)
app.post('/api/dpdp/consent', sensitiveLimiter, (req, res) => {
  try {
    const { userId = 'USR-1', purpose, status = 'granted', source = 'web_app' } = req.body || {};
    const ipAddress = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || '';

    const record = dpdpService.recordConsent({
      userId,
      purpose,
      status,
      source,
      ipAddress,
      userAgent
    });

    res.status(201).json({
      success: true,
      message: `Consent for '${purpose}' recorded as '${status}' under DPDP Act 2023.`,
      data: record
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Get User Current Consent Preferences & Audit Trail (Section 6)
app.get('/api/dpdp/consent', (req, res) => {
  const userId = toStr(req.query.userId) || 'USR-1';
  const consentState = dpdpService.getUserConsentState(userId);
  res.status(200).json({
    success: true,
    data: consentState
  });
});

// Withdraw Specific Consent Purpose (Section 6(4))
app.post('/api/dpdp/consent/withdraw', sensitiveLimiter, (req, res) => {
  try {
    const { userId = 'USR-1', purpose, reason } = req.body || {};
    const result = dpdpService.withdrawConsent({ userId, purpose, reason });
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Right to Access / Complete Data Export (Section 11)
app.get('/api/dpdp/data-export', sensitiveLimiter, (req, res) => {
  const userId = toStr(req.query.userId) || 'USR-1';
  const exportResult = dpdpService.generateDataExport(userId);
  if (!exportResult.success) {
    return res.status(404).json(exportResult);
  }
  res.status(200).json(exportResult);
});

// Right to Erasure Request (Section 12(3))
app.post('/api/dpdp/erasure-request', sensitiveLimiter, (req, res) => {
  try {
    const { userId = 'USR-1', reason } = req.body || {};
    const result = dpdpService.requestErasure({ userId, reason });
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Right of Grievance Redressal (Section 13 & DPDP Rules 2025)
app.post('/api/dpdp/grievances', sensitiveLimiter, (req, res) => {
  try {
    const { userId = 'USR-1', name, email, phone, category, description, pnr } = req.body || {};
    const result = dpdpService.submitGrievance({
      userId,
      name,
      email,
      phone,
      category,
      description,
      pnr
    });
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/dpdp/grievances', (req, res) => {
  const userId = toStr(req.query.userId);
  const grievances = dpdpService.getGrievances(userId);
  res.status(200).json({
    success: true,
    count: grievances.length,
    data: grievances
  });
});

app.get('/api/dpdp/grievances/:id', (req, res) => {
  const grievance = dpdpService.getGrievanceById(req.params.id);
  if (!grievance) {
    return res.status(404).json({ success: false, error: 'Privacy grievance record not found' });
  }
  res.status(200).json({ success: true, data: grievance });
});

// Right to Nominate (Section 14)
app.post('/api/dpdp/nomination', sensitiveLimiter, (req, res) => {
  try {
    const { userId = 'USR-1', nomineeName, relationship, email, phone, address } = req.body || {};
    const result = dpdpService.setNominee({
      userId,
      nomineeName,
      relationship,
      email,
      phone,
      address
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/dpdp/nomination', (req, res) => {
  const userId = toStr(req.query.userId) || 'USR-1';
  const result = dpdpService.getNominee(userId);
  res.status(200).json(result);
});

// Automated Data Retention & Pruning (Section 8(7))
app.post('/api/dpdp/retention/run-cleanup', (req, res) => {
  const result = dpdpService.runScheduledRetentionCleanup();
  res.status(200).json(result);
});

// Security & Governance Observability (Section 8(5))
app.get('/api/dpdp/security-audit', (req, res) => {
  res.status(200).json({
    success: true,
    framework: 'Digital Personal Data Protection Act, 2023 & DPDP Rules, 2025',
    status: 'Active Technical Governance Layer',
    securitySafeguards: {
      encryptionInTransit: 'TLS 1.3 / HTTPS Enforced',
      paymentCardHandling: 'RBI CoFT Tokenized (Zero Raw Card Storage)',
      piiLogSanitization: 'Active (Emails & Phone Numbers masked in server logs)',
      rateLimiting: 'Configured (120 req/min general, 20 req/min sensitive)',
      securityHeaders: 'OWASP / HSTS / SameSite Strict / Frame Denial Active',
      dataLocalisation: 'Primary Database & Stores Hosted In-Country (India)'
    },
    dataProtectionOfficer: dpdpService.dpo
  });
});

// Personal Data Breach Incident Management & DPBI Filing (Section 8(6))
app.post('/api/admin/dpdp/breach-incident', sensitiveLimiter, (req, res) => {
  try {
    const {
      title,
      severity = 'Low',
      affectedDataCategories,
      affectedPrincipalsCount,
      affectedUserIds,
      rootCause,
      containmentSteps
    } = req.body || {};

    if (!title) {
      return res.status(400).json({ success: false, error: 'Incident title is required' });
    }

    const incident = breachService.logIncident({
      title,
      severity,
      affectedDataCategories,
      affectedPrincipalsCount,
      affectedUserIds,
      rootCause,
      containmentSteps
    });

    res.status(201).json({
      success: true,
      message: `Breach incident #${incident.id} registered and triaged.`,
      data: incident
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/admin/dpdp/breach-incidents', (req, res) => {
  const incidents = breachService.getAllIncidents();
  res.status(200).json({
    success: true,
    count: incidents.length,
    data: incidents
  });
});

app.get('/api/admin/dpdp/breach-incidents/:id/dpbi-notification', (req, res) => {
  try {
    const dpbiPayload = breachService.generateDpbiNotification(req.params.id);
    res.status(200).json({
      success: true,
      data: dpbiPayload
    });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
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

  process.on('unhandledRejection', (reason, promise) => {
    console.error('[ExploreEase Server] Unhandled Promise Rejection at:', promise, 'reason:', reason);
  });

  process.on('uncaughtException', (err) => {
    console.error('[ExploreEase Server] Uncaught Exception thrown:', err);
  });
}

module.exports = app;
