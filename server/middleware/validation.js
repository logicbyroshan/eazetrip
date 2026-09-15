/**
 * Request Validation Middleware & Schemas
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

function validateLogin(req, res, next) {
  const { identifier, method } = req.body || {};
  if (!identifier) {
    return res.status(400).json({ success: false, error: 'Mobile number or email identifier is required' });
  }

  if (method === 'email' && !EMAIL_REGEX.test(identifier)) {
    return res.status(400).json({ success: false, error: 'Please provide a valid email address' });
  }

  next();
}

function validateRegister(req, res, next) {
  const { name, email, password } = req.body || {};
  
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ success: false, error: 'Full name must be at least 2 characters long' });
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ success: false, error: 'A valid email address is required' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long' });
  }

  next();
}

function validateBooking(req, res, next) {
  const { type, title, totalAmount, passengers } = req.body || {};

  if (!type || !['flight', 'hotel', 'bus', 'train'].includes(type.toLowerCase())) {
    return res.status(400).json({ success: false, error: 'Valid booking type (flight, hotel, bus, train) is required' });
  }

  if (!title) {
    return res.status(400).json({ success: false, error: 'Booking title or itinerary description is required' });
  }

  if (typeof totalAmount !== 'number' || totalAmount <= 0) {
    return res.status(400).json({ success: false, error: 'Total amount must be a positive number' });
  }

  if (!Array.isArray(passengers) || passengers.length === 0) {
    return res.status(400).json({ success: false, error: 'At least one passenger or guest detail is required' });
  }

  next();
}

function validatePayment(req, res, next) {
  const { firstName, email, amount } = req.body || {};

  if (!firstName || firstName.trim().length < 1) {
    return res.status(400).json({ success: false, error: 'First name is required' });
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ success: false, error: 'A valid email address is required' });
  }

  const numAmount = Number(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ success: false, error: 'Amount must be a positive number' });
  }

  next();
}

function validateContact(req, res, next) {
  const { name, email, message } = req.body || {};

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ success: false, error: 'Name must be at least 2 characters long' });
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ success: false, error: 'A valid email address is required' });
  }

  if (!message || message.trim().length < 5) {
    return res.status(400).json({ success: false, error: 'Message must be at least 5 characters long' });
  }

  next();
}

module.exports = {
  validateLogin,
  validateRegister,
  validateBooking,
  validatePayment,
  validateContact
};
