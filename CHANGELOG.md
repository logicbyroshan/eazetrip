# Changelog

All notable changes to the **EazeTrip** travel booking and e-commerce platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.5.0] - 2026-09-16

### Smart Multi-Channel Notification Engine & Resilient Delivery Queue with Dead-Letter Recovery (DLQ)

#### Added
- **Multi-Channel Notification Architecture**: Built full-stack notification engine supporting luxury HTML Email templates, authentic WhatsApp message formatting, SMS updates, and in-app feed.
- **Personalized Customer Re-Engagement Campaigns**: Automated campaign generator crafting customized holiday offers (e.g. 25% OFF with code `HOLIDAY25` for customers inactive for 3+ months), instant booking E-Ticket vouchers, 24h flight check-in alerts, and route price drops.
- **Resilient Delivery Queue & Exponential Backoff**: Fault-tolerant queue engine with retry schedule ($T = \text{baseDelay} \times 2^{\text{attempts}}$) that never drops messages during transient provider outages.
- **Dead-Letter Queue (DLQ) & 1-Click Recovery**: Safely isolates permanently failed notifications with failure diagnostics, error traces, and provides 1-click single/bulk retry recovery.
- **Navbar Notification Center (`NotificationCenter.jsx`)**: Added interactive bell with unread badge pill, category filter tabs (`All`, `Trips & PNR`, `Offers`, `Alerts`), mark-as-read, and deep-link action buttons.
- **WhatsApp & HTML Email Live Preview Modal (`NotificationPreviewModal.jsx`)**: Interactive modal rendering authentic WhatsApp chat bubbles (with business badge and delivery ticks) and responsive HTML email client previews.
- **Profile Communications & Queue Dashboard**: Dedicated hub in `/profile` with channel subscription switches, 1-click campaign test triggers, live health strip, and Dead-Letter Queue table.
- **Automated Test Suite Expansion**: Added 5 new automated tests in `server.test.js` (40 / 40 tests passing with 100% success rate).

---

## [1.4.1] - 2026-09-16

### User Profile & Trip Management Dashboard Enhancement

#### Added
- **Dynamic "My Trips & Bookings" Hub**: Added a dedicated booking history tab in `/profile` displaying recent and upcoming trips across Flights, Hotels, Buses, Trains, and Holiday packages.
- **Trip Category Filters**: Quick-filter trips by type (`All`, `Flights`, `Hotels`, `Buses`, `Trains`, `Holidays`) with real-time count badges and status indicators (`CONFIRMED`).
- **One-Click E-Ticket Modal Access**: Each booking card in the profile features an instant **View E-Ticket** action that opens the interactive EazeTrip ticket voucher with PNR, passenger manifest, route details, print, and PDF download triggers.
- **Dynamic Profile Travel Metrics**: Connected top hero stats (Total Bookings, Trips Confirmed, EazeRewards balance, Saved Travellers) directly to active booking context state.
- **Synchronized Auth State & Quick Logout**: Pre-filled user profile form updates automatically on login / Google sign-in with seamless profile save and logout actions.

---

## [1.4.0] - 2026-09-16

### Google One-Tap Floating Prompt & Full Authentication Suite

#### Added
- **Google One-Tap Floating Prompt Card**: Implemented `GoogleOneTapPrompt.jsx` that automatically floats into the top-right corner after landing on the site for unauthenticated visitors.
- **1-Click Google Sign-In**: Displays official 4-color Google G icon, user profile card (*Priyansh Sharma* / *priyansh.sharma@gmail.com*), and **`Continue as Priyansh`** CTA for instant authentication.
- **Session-Aware Prompt Dismissal**: Dismissing the card with the `X` button saves the preference in `sessionStorage` to avoid intrusive re-prompts.
- **Full Authentication Suite Verified**: Validated registration, email/password login, mobile OTP login, Google sign-in, and profile state sync.

---

## [1.3.4] - 2026-09-16

### Razorpay Prefill & Input Field Constraint Optimization

#### Fixed
- **Contact Input Binding in Razorpay Widget**: Removed restrictive `readonly: { contact: true }` property in `razorpay.js` so that Razorpay's input binding handler can smoothly auto-populate and validate the customer's phone number without locking the text field.

---

## [1.3.3] - 2026-09-16

### Direct Native Razorpay Checkout & Instant Confirmation

#### Added
- **Direct 1-Click Pay Action from `/review-booking`**: Eliminated redundant intermediate payment option selection pages. Clicking **PAY ₹X,XXX NOW** directly on the booking review page generates the order and triggers the official Razorpay payment gateway immediately.
- **Native Gateway Multi-Method Support**: All payment options (UPI & QR, Cards, EMI, Net Banking, and Wallets) are natively handled within the official Razorpay checkout interface.
- **Instant E-Ticket Confirmation**: Upon payment authorization and signature verification, the page displays the full E-Ticket confirmation view with PNR, Print, and PDF download capabilities.

---

## [1.3.2] - 2026-09-16

### Review Booking Error Boundary Resolution & Razorpay Modal Verification

#### Fixed
- **Missing ShieldCheck Import in `/review-booking`**: Re-imported `ShieldCheck` icon from `lucide-react` in `ReviewBookingPage.jsx` to resolve the runtime `ReferenceError` causing the React ErrorBoundary glitch view.
- **Razorpay Mobile Number Prefill**: Configured clean 10-digit number handling in `razorpay.js` so Razorpay accepts prefill seamlessly.
- **End-to-End Verification**: Confirmed that clicking **BOOK NOW** on any listing card smoothly loads `/review-booking`, and clicking **PROCEED TO PAYMENT** navigates to `/booking-payment` where the Razorpay checkout opens directly.

---

## [1.3.1] - 2026-09-16

### Seamless 2-Step Booking to Payment Page Flow

#### Added
- **Direct Transition from `/review-booking` to `/booking-payment`**: Clicking **PROCEED TO PAYMENT** on `/review-booking` directly compiles all traveler inputs, add-ons, pricing, and contact details, saving the draft to context and smoothly navigating to `/booking-payment`.
- **Verified Passenger Hub Integration**: `/booking-payment` displays the complete Verified Traveller card, 15-minute fare hold timer, and interactive Razorpay payment channels.
- **Auto-Populated & Locked Razorpay Details**: Triggering any payment mode opens the official Razorpay checkout pre-filled with the verified lead traveler name, email, and `+91` mobile number locked in readonly mode.

---

## [1.3.0] - 2026-09-16

### Streamlined Direct Razorpay Checkout & Country Code Prefill

#### Added
- **Direct 1-Click Razorpay Checkout from `/review-booking`**: Clicking **PAY VIA RAZORPAY** on the booking review page immediately generates the order and launches the official Razorpay payment gateway without requiring intermediate navigation screens.
- **Auto-Populated Phone with Country Prefix**: Formatted prefill phone with `+91${cleanPhone10}` so Razorpay accurately populates both the country dropdown and the mobile number field without prompting "Enter mobile & email to continue".
- **Instant E-Ticket Confirmation**: Upon successful payment authorization, cryptographic signature verification runs immediately and displays the confirmed booking E-Ticket screen with PNR, print ticket, and download PDF options.

---

## [1.2.1] - 2026-09-16

### Sidebar Trust & Security Box Formatting Fix

#### Fixed
- **Fare Summary Sidebar Spacing**: Resolved CSS collision on `.assurance-item` that was causing oversized vertical gaps and an unwanted border artifact in the sidebar security box. Scoped styles to `.sidebar-trust-box` and `.trust-point-item` with compact 7px item gaps, clean padding (10px 14px), and crisp alignment.

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
