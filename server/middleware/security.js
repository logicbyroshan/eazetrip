/**
 * Production Security & Rate Limiting Middleware
 */

function rateLimit({ windowMs = 60 * 1000, max = 60, message = 'Too many requests, please try again later.' } = {}) {
  const instanceMap = new Map();

  // Periodic pruning of stale rate limiter records to prevent memory leaks
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of instanceMap.entries()) {
      if (now - record.startTime > windowMs * 2) {
        instanceMap.delete(ip);
      }
    }
  }, Math.max(windowMs, 30000));

  if (cleanupTimer.unref) {
    cleanupTimer.unref();
  }

  return (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
      return next();
    }
    const ip = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    const now = Date.now();

    let record = instanceMap.get(ip);
    if (!record || now - record.startTime > windowMs) {
      record = { count: 1, startTime: now };
      instanceMap.set(ip, record);
    } else {
      record.count += 1;
    }

    // Set standard rate limit headers
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - record.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil((record.startTime + windowMs) / 1000));

    if (record.count > max) {
      return res.status(429).json({
        success: false,
        error: message
      });
    }

    next();
  };
}

// Security Headers Middleware
function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.setHeader('X-Download-Options', 'noopen');
  res.removeHeader('X-Powered-By');

  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  next();
}

// Deep recursive string sanitizer to strip null bytes, trim whitespace, and guard against prototype pollution
function sanitizeValue(value) {
  if (typeof value === 'string') {
    return value.replace(/\0/g, '').trim();
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value !== null && typeof value === 'object') {
    const cleaned = Object.create(null);
    for (const key of Object.keys(value)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      cleaned[key] = sanitizeValue(value[key]);
    }
    return cleaned;
  }
  return value;
}

function sanitizeInput(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeValue(req.query);
  }
  next();
}

module.exports = {
  rateLimit,
  securityHeaders,
  sanitizeInput
};

