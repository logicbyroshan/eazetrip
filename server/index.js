const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// In-memory data store
const mockData = {
  flights: [
    { id: 'FL-601', airline: 'IndiGo', flightNumber: '6E-2041', from: 'BOM', fromCity: 'Mumbai', to: 'DEL', toCity: 'New Delhi', departureTime: '06:00', arrivalTime: '08:15', duration: '2h 15m', stops: 0, price: 4999 },
    { id: 'FL-602', airline: 'Air India', flightNumber: 'AI-806', from: 'BOM', fromCity: 'Mumbai', to: 'DEL', toCity: 'New Delhi', departureTime: '08:30', arrivalTime: '10:45', duration: '2h 15m', stops: 0, price: 5550 },
    { id: 'FL-603', airline: 'Akasa Air', flightNumber: 'QP-1355', from: 'BOM', fromCity: 'Mumbai', to: 'DEL', toCity: 'New Delhi', departureTime: '11:15', arrivalTime: '13:35', duration: '2h 20m', stops: 0, price: 4599 },
    { id: 'FL-604', airline: 'SpiceJet', flightNumber: 'SG-8169', from: 'BOM', fromCity: 'Mumbai', to: 'DEL', toCity: 'New Delhi', departureTime: '15:20', arrivalTime: '17:40', duration: '2h 20m', stops: 0, price: 4850 }
  ],
  hotels: [
    { id: 'HT-101', name: 'The Grand Heritage Palace & Spa', city: 'Goa', pricePerNight: 5499, starRating: 5, userRating: 4.8 },
    { id: 'HT-102', name: 'Ocean Breeze Resort & Suites', city: 'Goa', pricePerNight: 3899, starRating: 4, userRating: 4.5 },
    { id: 'HT-103', name: 'Radisson Blu Plaza Hotel', city: 'New Delhi', pricePerNight: 6999, starRating: 5, userRating: 4.7 }
  ],
  buses: [
    { id: 'BUS-301', operator: 'Orange Travels', busType: 'Bharat Benz A/C Sleeper', from: 'Pune', to: 'Mumbai', departureTime: '22:30', arrivalTime: '02:45', price: 799 },
    { id: 'BUS-302', operator: 'Zingbus Plus', busType: 'Volvo 9600 Multi-Axle A/C Sleeper', from: 'Pune', to: 'Mumbai', departureTime: '23:45', arrivalTime: '04:15', price: 949 }
  ],
  railways: [
    { id: 'TR-12952', trainNumber: '12952', trainName: 'Mumbai Rajdhani Express', from: 'NDLS', to: 'BCT', departureTime: '16:55', arrivalTime: '08:35', duration: '15h 40m' },
    { id: 'TR-12954', trainNumber: '12954', trainName: 'August Kranti Rajdhani', from: 'NDLS', to: 'BCT', departureTime: '17:15', arrivalTime: '10:05', duration: '16h 50m' }
  ],
  offers: [
    { id: 1, title: 'Take Off with Big Savings', code: 'EXPLOREEAZ', discount: 'Up to ₹1,500 OFF', category: 'Flights' },
    { id: 2, title: 'Exclusive Luxury Hotel Deals', code: 'STAYEAZY', discount: 'Flat 20% OFF', category: 'Hotels' },
    { id: 3, title: 'Intercity Bus Bonanza', code: 'BUSEAZ', discount: 'Up to ₹250 OFF', category: 'Buses' },
    { id: 4, title: 'Special Railway Fast Track', code: 'TRAINEAZ', discount: 'Zero Fee', category: 'Railway' }
  ]
};

let bookingsStore = [];

// Flights API
app.get('/api/flights', (req, res) => {
  const { from, to } = req.query;
  let results = mockData.flights;
  if (from) results = results.filter((f) => f.from.toLowerCase() === from.toLowerCase() || f.fromCity.toLowerCase().includes(from.toLowerCase()));
  if (to) results = results.filter((f) => f.to.toLowerCase() === to.toLowerCase() || f.toCity.toLowerCase().includes(to.toLowerCase()));
  res.json(results);
});

// Hotels API
app.get('/api/hotels', (req, res) => {
  const { city } = req.query;
  let results = mockData.hotels;
  if (city) results = results.filter((h) => h.city.toLowerCase().includes(city.toLowerCase()));
  res.json(results);
});

// Buses API
app.get('/api/buses', (req, res) => {
  const { from, to } = req.query;
  let results = mockData.buses;
  if (from) results = results.filter((b) => b.from.toLowerCase().includes(from.toLowerCase()));
  if (to) results = results.filter((b) => b.to.toLowerCase().includes(to.toLowerCase()));
  res.json(results);
});

// Railways API
app.get('/api/railways', (req, res) => {
  const { from, to } = req.query;
  let results = mockData.railways;
  if (from) results = results.filter((r) => r.from.toLowerCase() === from.toLowerCase());
  if (to) results = results.filter((r) => r.to.toLowerCase() === to.toLowerCase());
  res.json(results);
});

// Offers API
app.get('/api/offers', (req, res) => {
  res.json(mockData.offers);
});

// Bookings API
app.get('/api/bookings', (req, res) => {
  res.json(bookingsStore);
});

app.post('/api/bookings', (req, res) => {
  const bookingData = req.body;
  if (!bookingData) return res.status(400).json({ error: 'Missing booking details' });

  const newBooking = {
    id: `EZ-${(bookingData.type || 'FL').slice(0, 2).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
    createdAt: new Date().toISOString(),
    status: 'Confirmed',
    paymentStatus: 'Paid',
    ...bookingData
  };

  bookingsStore.unshift(newBooking);
  res.status(201).json({ message: 'Booking confirmed successfully', booking: newBooking });
});

app.post('/api/bookings/:id/cancel', (req, res) => {
  const { id } = req.params;
  const { reason } = req.body || {};
  const bookingIndex = bookingsStore.findIndex((b) => b.id === id);

  if (bookingIndex === -1) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  bookingsStore[bookingIndex].status = 'Cancelled';
  bookingsStore[bookingIndex].cancellationReason = reason || 'User requested cancellation';
  bookingsStore[bookingIndex].cancelledAt = new Date().toISOString();
  bookingsStore[bookingIndex].refundStatus = 'Initiated (Processed in 5-7 days)';

  res.json({ message: 'Booking cancelled successfully', booking: bookingsStore[bookingIndex] });
});

// Auth API
app.post('/api/auth/login', (req, res) => {
  const { identifier, password, method } = req.body || {};
  if (!identifier) return res.status(400).json({ error: 'Missing credentials' });

  const user = {
    id: `USR-${Math.floor(100000 + Math.random() * 900000)}`,
    name: method === 'phone' ? `Traveler ${identifier.slice(-4)}` : identifier.split('@')[0],
    email: method === 'email' ? identifier : `user${identifier.slice(-4)}@exploreeaz.com`,
    phone: method === 'phone' ? identifier : '+91 9876543210',
    tier: 'Gold Explorer'
  };

  res.json({ message: 'Login successful', user });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, phone } = req.body || {};
  if (!email || !name) return res.status(400).json({ error: 'Missing registration details' });

  const user = {
    id: `USR-${Math.floor(100000 + Math.random() * 900000)}`,
    name,
    email,
    phone: phone || '+91 9876543210',
    tier: 'Classic Explorer'
  };

  res.status(201).json({ message: 'Account registered successfully', user });
});

// Payment API
app.post('/api/payment', (req, res) => {
  const { firstName, email, amount } = req.body || {};
  if (!firstName || !email || !amount) {
    return res.status(400).json({ error: 'First name, email and amount are required' });
  }

  res.status(201).json({
    message: 'Payment verified and processed successfully',
    paymentId: `PAY-${Date.now()}`
  });
});

// Contact API
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required' });
  }
  res.status(201).json({ message: 'Inquiry received. We will contact you shortly.' });
});

// Serve static build in production
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`ExploreEase Server running on http://localhost:${PORT}`);
});
