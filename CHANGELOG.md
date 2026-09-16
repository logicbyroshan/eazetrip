# Changelog

All notable changes to the **EazeTrip** travel booking and e-commerce platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-09-16

### Deep Razorpay Payment Hub & Zero Detail Re-Entry

#### Added
- **Deeply Integrated Razorpay Payment Hub**: Replaced simulated card and bank form fields on `/booking-payment` with official direct Razorpay payment channels (Express 1-Click Checkout, UPI & QR, Credit/Debit Cards & EMI, Net Banking, and Wallets & PayLater).
- **Zero Detail Re-Entry (`readonly` Prefill)**: Added prefill sanitization (clean 10-digit mobile number, trimmed email, and lead passenger name) with `readonly: { contact: true, email: true, name: true }` so Razorpay never re-prompts the user for details already provided on the review page.
- **Verified Traveller Summary Card**: Added a prominent, green-verified passenger & contact info card at the top of `/booking-payment` confirming pre-filled status with an instant edit shortcut.
- **Real-Time Payment Processing Overlay**: Added luxury blurred loading overlay with status updates while Razorpay generates orders and verifies cryptographic signatures with the backend.

---

## [1.1.1] - 2026-09-16

### Checkout & Modal UX Fix

#### Removed
- **Legacy CheckoutModal Overlay**: Removed obsolete modal dialog (`CheckoutModal.jsx`) that was popping up on top of `/review-booking`. All booking mediums (Flights, Hotels, Buses, Trains, Holidays) now transition cleanly and directly to the dedicated multi-step booking review and payment pages.

---

## [1.1.0] - 2026-09-16

### Live Payment Integration & Agent Operating Rules

#### Added
- **Live/Test Razorpay Gateway Activation**: Integrated active merchant API keys into `.env`, enabling live order creation (`order_...`), public key distribution, and cryptographic HMAC signature verification.
- **Agent Operating Constitution**: Added mandatory Git branch creation and `gh` CLI Pull Request workflow rules to `AGENTS.md` and `.agent-memory/CONVENTIONS.md`.
- **Security Guard**: Added `.env` exclusion to `client/.gitignore` to protect against client-side credential exposure.

---

## [1.0.0] - 2026-09-15

### Baseline Architecture & Production Release

#### Added
- **Full-Stack Multi-Modal Platform**: Comprehensive booking engine supporting Flights, Hotels, Intercity Buses, Indian Railways (IRCTC partner integration), and Holiday Tour Packages.
- **Dedicated Multi-Step Booking Flow**:
  - `/review-booking`: Dynamic itinerary card, multi-passenger forms, optional GST invoicing, travel insurance, zero cancellation shield, and promo code deck.
  - `/booking-payment`: Integrated payment hub supporting UPI QR code scanning, Credit/Debit cards, NetBanking, Mobile Wallets, and Razorpay Smart Checkout.
- **Backend API & Data Store**: Express 4 REST backend with in-memory persistence (`server/data/mockStore.js`), 15+ REST endpoints, recursive null-byte and prototype pollution sanitizers, OWASP security headers, and IP rate limiting.
- **Payment Gateway Engine**: Native Razorpay SDK integration with automatic fallback to Smart Simulation Mode when API keys are unconfigured.
- **Test Suite**: 35 automated tests (`tests/server.test.js`) verifying health, listings, booking lifecycles, auth tokens, input sanitization, prototype pollution protection, and payment webhooks.
- **Design System & UX**: Curated luxury typography (Outfit & Plus Jakarta Sans), smooth Lenis wheel scrolling, glassmorphic filters, and interactive search widgets.

#### Fixed
- Fixed card header alignment on `/review-booking` and `/booking-payment` to ensure icons and titles display side-by-side in horizontal flex rows.
- Configured `overflow-x: clip` in `index.css` and sticky sidebar styles (`position: sticky; top: 90px; height: fit-content; align-self: start;`) on right-column fare summaries.
- Removed redundant full-width top strips and integrated breadcrumb navigation cleanly inside page containers.
- Fixed contact information SMS header icon alignment, enhanced coupon input bar height, and balanced Fare Summary vertical CTA spacing.
