/**
 * Production-Grade Request Validation Middleware & Schemas
 */

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^\+?[0-9\s-]{10,15}$/;

function validateLogin(req, res, next) {
  const { identifier, method, password } = req.body || {};
  if (!identifier || typeof identifier !== 'string' || identifier.trim().length === 0) {
    return res.status(400).json({ success: false, error: 'Mobile number or email identifier is required' });
  }

  const cleanIdentifier = identifier.trim();

  if (method === 'email' || (!method && cleanIdentifier.includes('@'))) {
    if (!EMAIL_REGEX.test(cleanIdentifier) || cleanIdentifier.length > 254) {
      return res.status(400).json({ success: false, error: 'Please provide a valid email address' });
    }
  } else if (method === 'phone' || !method) {
    const digitsOnly = cleanIdentifier.replace(/[\s-]/g, '');
    if (!PHONE_REGEX.test(digitsOnly) || digitsOnly.length < 10) {
      return res.status(400).json({ success: false, error: 'Please provide a valid 10-15 digit phone number' });
    }
  }

  next();
}

function validateRegister(req, res, next) {
  const { name, email, password, phone } = req.body || {};
  
  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.length > 100) {
    return res.status(400).json({ success: false, error: 'Full name must be between 2 and 100 characters long' });
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim()) || email.length > 254) {
    return res.status(400).json({ success: false, error: 'A valid email address is required' });
  }

  if (!password || typeof password !== 'string' || password.length < 6 || password.length > 128) {
    return res.status(400).json({ success: false, error: 'Password must be between 6 and 128 characters' });
  }

  if (phone) {
    const digitsOnly = String(phone).replace(/[\s-]/g, '');
    if (!PHONE_REGEX.test(digitsOnly)) {
      return res.status(400).json({ success: false, error: 'Please provide a valid phone number' });
    }
  }

  next();
}

function validateBooking(req, res, next) {
  const { type, title, totalAmount, passengers } = req.body || {};

  if (!type || !['flight', 'hotel', 'bus', 'train', 'holiday'].includes(String(type).toLowerCase())) {
    return res.status(400).json({ success: false, error: 'Valid booking type (flight, hotel, bus, train, holiday) is required' });
  }

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    return res.status(400).json({ success: false, error: 'Booking title or itinerary description is required' });
  }

  const numAmount = Number(totalAmount);
  if (isNaN(numAmount) || numAmount <= 0 || numAmount > 10000000) {
    return res.status(400).json({ success: false, error: 'Total amount must be a positive number up to ₹1,00,00,000' });
  }

  if (!Array.isArray(passengers) || passengers.length === 0) {
    return res.status(400).json({ success: false, error: 'At least one passenger or guest detail is required' });
  }

  for (let i = 0; i < passengers.length; i++) {
    const p = passengers[i];
    if (!p || typeof p !== 'object' || !p.name || typeof p.name !== 'string' || p.name.trim().length < 2) {
      return res.status(400).json({ success: false, error: `Passenger #${i + 1} must have a valid full name` });
    }
  }

  next();
}

function validatePayment(req, res, next) {
  const { firstName, email, amount, currency } = req.body || {};

  if (!firstName || typeof firstName !== 'string' || firstName.trim().length < 1 || firstName.length > 60) {
    return res.status(400).json({ success: false, error: 'First name is required (max 60 characters)' });
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim()) || email.length > 254) {
    return res.status(400).json({ success: false, error: 'A valid email address is required' });
  }

  const numAmount = Number(amount);
  if (isNaN(numAmount) || numAmount <= 0 || numAmount > 10000000) {
    return res.status(400).json({ success: false, error: 'Amount must be a valid positive number' });
  }

  if (currency && typeof currency === 'string' && !['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD'].includes(currency.toUpperCase())) {
    return res.status(400).json({ success: false, error: 'Unsupported currency specified' });
  }

  next();
}

function validateRazorpayOrder(req, res, next) {
  const { amount, currency } = req.body || {};
  const numAmount = Number(amount);

  if (isNaN(numAmount) || numAmount <= 0 || numAmount > 10000000) {
    return res.status(400).json({ success: false, error: 'Valid positive amount is required' });
  }

  if (currency && typeof currency === 'string' && !['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD'].includes(currency.toUpperCase())) {
    return res.status(400).json({ success: false, error: 'Unsupported currency specified' });
  }

  next();
}

function validateRazorpayVerify(req, res, next) {
  const { razorpay_payment_id, razorpay_order_id } = req.body || {};

  if (!razorpay_payment_id || typeof razorpay_payment_id !== 'string' || razorpay_payment_id.trim().length === 0) {
    return res.status(400).json({ success: false, error: 'razorpay_payment_id is required' });
  }

  if (!razorpay_order_id || typeof razorpay_order_id !== 'string' || razorpay_order_id.trim().length === 0) {
    return res.status(400).json({ success: false, error: 'razorpay_order_id is required' });
  }

  next();
}

function validateContact(req, res, next) {
  const { name, email, message } = req.body || {};

  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.length > 100) {
    return res.status(400).json({ success: false, error: 'Name must be between 2 and 100 characters long' });
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim()) || email.length > 254) {
    return res.status(400).json({ success: false, error: 'A valid email address is required' });
  }

  if (!message || typeof message !== 'string' || message.trim().length < 5 || message.length > 3000) {
    return res.status(400).json({ success: false, error: 'Message must be between 5 and 3000 characters long' });
  }

  next();
}

module.exports = {
  validateLogin,
  validateRegister,
  validateBooking,
  validatePayment,
  validateRazorpayOrder,
  validateRazorpayVerify,
  validateContact
};
