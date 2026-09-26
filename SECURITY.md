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

### E. DPDP Act 2023 & DPDP Rules 2025 Data Governance
- **PII Log Sanitization (`piiMasker.js`):** Automatically masks sensitive phone numbers, email addresses, names, and financial identifiers before writing to server logs or third-party telemetry.
- **Child Protection (DPDP Section 9):** Automated detection of minor travelers (`isMinor: true`) with hard blocking of targeted advertising, tracking, or behavioral profiling.
- **RBI CoFT Card Security:** Zero raw card number or CVV retention; leverages RBI-mandated tokenization via PCI-DSS certified gateway (Razorpay).
- **Statutory Retention Segregation:** When a Data Principal requests account erasure, personal profiles and marketing consents are permanently purged while transaction invoices are moved to a restricted, encrypted compliance archive for the mandatory 7-year CGST/DGCA retention window.
- **Data Protection Board of India (DPBI) Incident Response:** Automated breach triage engine with formal DPBI intimation generation and affected Data Principal notification workflows.

---

## 3. Reporting Vulnerabilities & Grievances

If you discover a security vulnerability or wish to exercise data rights under DPDP:
1. **Security Vulnerabilities:** Email `security@eazetrip.com` with steps to reproduce.
2. **Privacy Grievances / DPO:** Submit online at `/privacy` or email `dpo@eazetrip.com` (Statutory 90-day resolution SLA).
3. Security patches are prioritized and released promptly.

