# Security Policy & Architecture

ExploreEase (EazeTrip) is engineered following defensive security practices, strict input validation, HTTP security headers, and rate limiting to protect user data and ensure system resilience.

---

## 1. Security Architecture Overview

```
[ Incoming Request ]
        │
        ▼
[ Security Headers Middleware ] ──► (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy)
        │
        ▼
[ CORS Origin Verification ]   ──► (Restricted Allowed Origins)
        │
        ▼
[ Rate Limiting Layer ]        ──► (General 120/min, Sensitive 20/min with isolated IP buckets)
        │
        ▼
[ Input Sanitization ]         ──► (Trim, recursive string validation, payload size limit 100kb)
        │
        ▼
[ Endpoint-level Validation ]  ──► (Strict RegEx for Email/Phone/Dates, positive numeric amounts)
        │
        ▼
[ Business Logic / Store ]
        │
        ▼
[ Error Handling & Masking ]   ──► (No stack trace leakage in non-development modes)
```

---

## 2. Implemented Security Controls

### A. Security Headers
- `X-Content-Type-Options: nosniff`: Prevents MIME-sniffing attacks.
- `X-Frame-Options: SAMEORIGIN`: Protects against clickjacking.
- `X-XSS-Protection: 1; mode=block`: Blocks reflected XSS in compatible browsers.
- `Referrer-Policy: strict-origin-when-cross-origin`: Restricts referrer data leakage.
- `X-Powered-By`: Removed to avoid server fingerprinting.
- `Cache-Control: no-store, no-cache`: Enforced for all `/api/*` routes to avoid caching sensitive user records.

### B. Rate Limiting & DoS Prevention
- General API Rate Limiting: 120 requests per minute per IP.
- Sensitive Endpoints (`/api/auth/*`, `/api/payment`, `/api/contact`): 20 requests per minute per IP.
- Standard response headers provided: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`.

### C. Input Validation & Sanitization
- Body parser capped at `100kb` to prevent memory flooding.
- Inputs sanitized by trimming and stripping control sequences.
- Regex validations enforced on email addresses, dates (ISO format validation), and phone numbers.
- Payment amounts validated strictly for positive integers and floating point values.

### D. Client-Side Defensive Controls
- Modal interactions trap focus and listen for `Escape` key dismissals.
- Datepicker inputs dynamically enforce chronological validity (e.g. `checkOut >= checkIn`, `returnDate >= departureDate`).
- Forms include HTML5 fallback validation attributes (`required`, `type="email"`, `pattern`, `min`).

---

## 3. Reporting Vulnerabilities

If you discover a security vulnerability in ExploreEase:
1. Please do not create a public GitHub issue.
2. Email security details to `security@exploreeaz.com` or `roshan@eazetrip.internal`.
3. Include detailed steps to reproduce the issue.
4. Security patches are prioritized and released promptly.
