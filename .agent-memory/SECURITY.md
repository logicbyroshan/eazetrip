# Security Model & Guidelines: EazeTrip

## 1. Security Architecture

EazeTrip implements defense-in-depth security across both backend API layers and frontend client flows.

### A. HTTP Security Headers
Every Express API response carries headers enforced in `server/middleware/security.js`:
* `X-Content-Type-Options: nosniff` (prevents MIME-sniffing)
* `X-Frame-Options: SAMEORIGIN` (mitigates clickjacking)
* `X-XSS-Protection: 1; mode=block` (legacy XSS defense)
* `Referrer-Policy: strict-origin-when-cross-origin`
* `Cross-Origin-Opener-Policy: same-origin-allow-popups` (allows secure Razorpay popup overlays)
* `X-DNS-Prefetch-Control: off`
* `X-Download-Options: noopen`
* `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` (enforced in production)

### B. Input Sanitization & Prototype Pollution Defense
The `sanitizeInput` middleware recursively strips:
* Null bytes (`\0`)
* Prototype pollution vectors (`__proto__`, `constructor`, `prototype`)
* Extraneous trailing and leading whitespace

### C. Cryptography & Signature Verification
* **Constant-Time HMAC Comparison**: Webhook signatures (`X-Razorpay-Signature`) and payment verifications utilize `crypto.timingSafeEqual` to eliminate side-channel timing attacks.
* **Token Generation**: User session tokens use cryptographically secure random bytes (`crypto.randomBytes(32).toString('hex')`).

### D. Rate Limiting
* **General API Limiter**: 120 requests per minute per IP.
* **Sensitive Endpoints Limiter**: 20 requests per minute per IP on `/api/auth/login`, `/api/auth/register`, `/api/payment/*`, and `/api/contact`.
* **Automatic Pruning**: Stale IP records are pruned periodically to prevent memory leaks.

---

## 2. Secrets Management & Environment Configuration

* Secrets must be defined in `.env` (refer to `.env.example`).
* **NEVER** write live secrets, API keys, or private certificates into code or git commits.
* Sensitive environment keys:
  * `PORT`
  * `NODE_ENV`
  * `CORS_ORIGIN`
  * `RAZORPAY_KEY_ID`
  * `RAZORPAY_KEY_SECRET`
  * `RAZORPAY_WEBHOOK_SECRET`
