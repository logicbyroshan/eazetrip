/**
 * PII Masking and Data Protection Utilities
 * Aligned with DPDP Act 2023 Section 8(5) for secure processing and privacy-preserving logs
 */

/**
 * Mask an email address (e.g. priyansh.sharma@gmail.com -> p***a@gmail.com)
 */
function maskEmail(email) {
  if (!email || typeof email !== 'string') return '';
  const clean = email.trim();
  const parts = clean.split('@');
  if (parts.length !== 2) return '***@***.***';
  
  const [name, domain] = parts;
  if (name.length <= 2) {
    return `${name.charAt(0)}***@${domain}`;
  }
  const maskedName = `${name.charAt(0)}${'*'.repeat(Math.min(name.length - 2, 4))}${name.slice(-1)}`;
  return `${maskedName}@${domain}`;
}

/**
 * Mask a phone number (e.g. +91 9876543210 -> +91 98765*****)
 */
function maskPhone(phone) {
  if (!phone || typeof phone !== 'string') return '';
  const clean = phone.trim();
  const digits = clean.replace(/\D/g, '');
  if (digits.length < 5) return '****';

  if (clean.startsWith('+91') || (digits.length === 12 && digits.startsWith('91'))) {
    const num = digits.startsWith('91') ? digits.slice(2) : digits;
    return `+91 ${num.slice(0, 5)}*****`;
  }

  if (clean.startsWith('+')) {
    const visible = digits.slice(0, 4);
    return `+${visible}*****`;
  }

  return `${digits.slice(0, 5)}*****`;
}

/**
 * Mask full names in public/unauthorized outputs (e.g. "Rohit Sharma" -> "R**** S****")
 */
function maskName(name) {
  if (!name || typeof name !== 'string') return '';
  const parts = name.trim().split(/\s+/);
  return parts.map(part => {
    if (part.length <= 1) return part;
    return `${part.charAt(0)}${'*'.repeat(Math.min(part.length - 1, 4))}`;
  }).join(' ');
}

/**
 * Mask a bank account number (e.g. "123456789012" -> "XXXX-XXXX-9012")
 */
function maskBankAccount(acc) {
  if (!acc || typeof acc !== 'string') return '';
  const clean = acc.replace(/[\s-]/g, '');
  if (clean.length <= 4) return 'XXXX';
  return `XXXX-XXXX-${clean.slice(-4)}`;
}

/**
 * Deep mask an object for safe debugging / audit logging without leaking PII
 */
function sanitizeForLogs(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeForLogs);

  const sensitiveKeys = ['password', 'token', 'secret', 'cvv', 'cardnumber', 'pin', 'idtoken', 'credential'];
  const piiKeys = ['email', 'phone', 'mobile', 'bankaccount', 'upiid', 'passportnumber', 'aadhaar'];

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    if (sensitiveKeys.some(k => lowerKey.includes(k))) {
      sanitized[key] = '[REDACTED_SECRET]';
    } else if (lowerKey.includes('email') && typeof value === 'string') {
      sanitized[key] = maskEmail(value);
    } else if ((lowerKey.includes('phone') || lowerKey.includes('mobile')) && typeof value === 'string') {
      sanitized[key] = maskPhone(value);
    } else if (lowerKey.includes('bank') && typeof value === 'string') {
      sanitized[key] = maskBankAccount(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeForLogs(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

module.exports = {
  maskEmail,
  maskPhone,
  maskName,
  maskBankAccount,
  sanitizeForLogs
};
