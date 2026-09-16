# Changelog

All notable changes to the **EazeTrip** travel booking and e-commerce platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.9.0] - 2026-09-16

### Master UI/UX Audit & Complete Design System Rebuild (10/10 Standard)

#### Added & Refined
- **Master Design System Primitives (`client/src/index.css`)**:
  - Unified typography hierarchy with dual-font architecture (`Outfit` display headings + `Plus Jakarta Sans` UI body).
  - Standardized 8-point spacing grid (`--space-1` to `--space-16`) and radius scale (`--radius-xs` to `--radius-full`).
  - Master Button Hierarchy: Standardized `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-ghost`, `.btn-danger` across Small (`34px`), Medium (`42px`), and Large (`50px`) heights with focus-visible accessibility rings.
  - Master Form Controls: Unified input height (`44px`), hover borders, 3px focus glow, and error states.
  - Master Status Badges: Standardized `.badge-success`, `.badge-warning`, `.badge-danger`, `.badge-info`, `.badge-vip`.
  - Master Cards & Surfaces: Consistent 16px radius, elevation hierarchy (`--shadow-xs` to `--shadow-xl`), and interactive hover lifts.
  - Master Tables & Modals: Standardized responsive tables with horizontal scroll wrappers and spring-animated modal dialogs.
- **Master Responsive Breakpoints (`client/src/App.css`)**:
  - Implemented seamless scaling across Ultra-Wide, Desktop, Tablet (`1024px`), Mobile (`768px`), Small Mobile (`480px`), and Extra Small Mobile (`360px`).
  - Guaranteed minimum 44x44px touch targets on all interactive controls for mobile accessibility.
  - Standardized listing page 2-column grid and checkout sticky fare sidebar.

---

## [1.8.0] - 2026-09-16

### Production Google OAuth 2.0 & Identity Services Integration

#### Added
- **Google OAuth 2.0 Backend Verification Engine (`server/services/googleAuthService.js`)**:
  - Validates Google ID tokens (GIS) via Google's official `https://oauth2.googleapis.com/tokeninfo` endpoint with cryptographic claim verification (`iss`, `aud`, `sub`, `email_verified`).
  - Supports OAuth 2.0 authorization code exchange via `https://oauth2.googleapis.com/token` with `GOOGLE_CLIENT_SECRET`.
  - Smart Sandbox simulation fallback for test suites and offline environments when client keys are not yet configured.
- **REST Endpoints (`server/index.js`)**:
  - `GET /api/auth/google-client-id`: Exposes public Google Client ID configuration to the frontend SPA.
  - `POST /api/auth/google`: Authenticates Google JWT credentials, synchronizes user profile in `mockStore`, and issues 256-bit session tokens.
- **Google Identity Services (GIS) Client (`client/`)**:
  - Integrated `https://accounts.google.com/gsi/client` SDK in `client/index.html`.
  - Configured `envDir: '../'` in `client/vite.config.js` for automatic `.env` variable loading.
  - Updated `AuthContext.jsx` with Google Identity Services initialization and token exchange.
  - Updated `LoginModal.jsx`, `AuthPage.jsx`, and `GoogleOneTapPrompt.jsx` to seamlessly launch Google One-Tap and Google Sign-in.
- **Environment Configuration (`.env`, `.env.example`)**:
  - Added dedicated copy-paste variables `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `VITE_GOOGLE_CLIENT_ID` with step-by-step Google Cloud Console instructions.
- **Automated Tests (`tests/server.test.js`)**:
  - Added Tests 53, 54, and 55 for Google OAuth config, token validation, and bad payload rejection (55/55 tests passing).

---

## [1.7.3] - 2026-09-16

### Deepened Traveler Recognition in Profile & Booking Review Flows

#### Added
- **Account Access Personalization (`ProfilePage.jsx`)**: Unauthenticated account access card dynamically greets returning travelers with `Welcome Back, [Name]! Please Sign In` and one-click `Sign In as [Name]`.
- **Pre-populated Primary Passenger Fields (`ReviewBookingPage.jsx`)**: Form fields automatically pre-populate with the remembered traveler's name for faster, seamless checkout.

---

## [1.7.2] - 2026-09-16

### Site-Wide Personalized Traveler Experience & Persistent Memory

#### Added
- **Persistent Traveler Identity & Recognition Engine (`AuthContext.jsx`)**:
  - Automatically remembers the traveler's first name (`eazetrip_remembered_name`) upon login, Google One-Tap, or registration.
  - Exposes `firstName`, `rememberedName`, and `getPersonalizedTitle` helper utilities to all components across the site.
  - Recognizes returning visitors in the top navigation bar with a personalized `Hi [Name] (Login)` prompt even before explicit re-authentication.
- **Dynamic Site-Wide Titles & Headlines**:
  - **Homepage Hero (`HomePage.jsx`)**: Displays dynamic `Welcome Back, [Name]!` title with glassmorphic VIP badge pill (`Personalized Experience for [Name] • [Tier]`).
  - **Special Offers Section (`SpecialOffersSection.jsx`)**: Displays exact customized `Offers Only For You, [Name]` header, `Curated For [Name]` badge, and `Exclusive Member Deals for [Name]` banner.
  - **Dedicated Offers Page (`OffersPage.jsx`)**: Top banner and headlines dynamically update to `Offers Only For You, [Name]` with tailored member descriptions.
  - **Flight Search Results (`FlightBookingPage.jsx`)**: Displays `Flights Selected for [Name]` with personalized member fare tags.
  - **Hotel Search Results (`HotelBookingPage.jsx`)**: Displays `Luxury Stays Handpicked for [Name]` with complimentary upgrade badges.
  - **Bus Search Results (`BusBookingPage.jsx`)**: Displays `Bus Routes Curated for [Name]`.
  - **Railway Booking (`RailwayBookingPage.jsx`)**: Displays `IRCTC Train Schedules for [Name]`.
  - **Holiday Packages (`HolidayBookingPage.jsx`)**: Displays `Customized Holiday Packages for [Name]` with VIP concierge tags.
  - **Manage Bookings (`ManageBookingsPage.jsx`)**: Displays `Manage Your Bookings, [Name]`.
  - **Cancellation & Refund Hub (`CancellationRefundPage.jsx`)**: Displays `Cancellation & Refund Resolution Hub for [Name]`.
  - **Review Booking & Payment (`ReviewBookingPage.jsx`, `BookingPaymentPage.jsx`)**: Displays `[Name]'s Flight Itinerary` and `[Name]'s Traveller & Contact Details Verified`.
  - **24/7 Help Desk & Contact Page (`HelpDeskWidget.jsx`, `ContactPage.jsx`)**: Displays `Hi [Name], How Can We Help?` and `Hello [Name], We're Here to Help`.
  - **Top Navigation Bar (`TopBar.jsx`)**: Displays `Hi, [Name]` in profile button.

---

## [1.7.1] - 2026-09-16

### Direct Refund Claim Wizard & Profile Refunds & Claims Resolution Hub

#### Added
- **Direct Refund Request / Claim Wizard Modal (`CancellationRefundPage.jsx`)**:
  - Direct "+ Submit Direct Refund Claim" CTA in the Cancellation & Refund hero banner.
  - Fast-track 3-step interactive claim modal supporting key dispute categories:
    - *Airline Cancellation / Schedule Delay (>3h)*: Auto-applies 100% Zero Penalty Shield waiver.
    - *Medical / Compassionate Emergency*: Medical certificate & hospital discharge waiver.
    - *Payment Debited but Booking Failed*: Duplicate transaction ID auto-reconciliation.
    - *IRCTC / Railways Waitlist Auto-Refund*: Automated PNR reconciliation.
    - *Hotel Overbooked / Service Deficiency*: On-spot relocation & compensation claim.
  - Payout destination selector: **Instant EazeWallet Credit** (0-sec settlement + 5% bonus balance), **Original Payment Source** (24-48 hrs), **Direct UPI ID**, or **Direct Bank Account (NEFT/IMPS)**.
  - Generates official `#RFND-XXXXX` tracking reference and immediately binds to the interactive 4-step on-page timeline.
  - Integrated "Copy Tracking Link" and "Print Credit Note" actions.
- **Dedicated Profile "Refunds & Claims" Hub (`ProfilePage.jsx`)**:
  - Added 6th tab in `/profile` with real-time active counter badges and status filters (`All`, `Completed`, `In Progress`, `Under Review`).
  - Metric summary strip displaying: Total Claims Raised, Total Disbursed (₹), In Banking Clearing, and Instant SLA Rate.
  - High-fidelity refund claim cards detailing Service Name, PNR, Category, Disbursement Destination, NPCI ARN banking tracking code, and Net Refund Amount.
  - Direct "Cancel & Refund" action on Confirmed bookings in "My Trips" launching an integrated 3-step cancellation modal.
  - Direct "Track Refund" action on Cancelled bookings jumping straight to the Profile Claims hub.
- **State Persistence & Context Synchronization (`BookingContext.jsx`)**:
  - Implemented `initialDemoRefunds` fallback data (`RFND-10492` flight refund and `RFND-20941` hotel refund) persisted in `localStorage` (`eazetrip_refund_claims`).
- **Automated Test Suite Expansion (`tests/server.test.js`)**:
  - Added Tests 51 & 52 verifying refund claim listings by user email and direct airline cancellation dispute claim processing with Zero Shield waiver (**52 / 52 automated tests passing with 100% success rate**).

---

## [1.7.0] - 2026-09-16

### Refund Resolution Engine, Cookie & Privacy Consent, Personalized Experience & Pre-Payment Auth

#### Added
- **3-Step Cancellation & Refund Experience (`ManageBookingsPage.jsx`)**:
  - Step 1: Automated breakdown calculation comparing Gross Fare, Operator Penalty, EazeTrip Fee Waiver (₹0), and Net Refund Amount (with Zero Cancellation Shield support).
  - Step 2: Multi-mode payout destination selection (**Instant EazeWallet Credit** with 0-sec transfer + 5% bonus credit, **Original Payment Source** 24-48 hrs, **Direct UPI ID**, and **Direct Bank Account NEFT/IMPS**).
  - Step 3: Instant confirmation and official EazeTrip Refund Credit Note voucher with Tracking Reference (`#RFND-XXXXX`) and banking ARN code.
- **Cancellation & Refund Resolution Hub (`CancellationRefundPage.jsx`)**:
  - Live Refund Status Tracker with real-time 4-step progress stepper (Request Registered -> Fare Rule Verification -> Banking Disbursement -> Credit to Account).
  - Interactive Instant Refund Estimator & Calculator supporting Flights, Hotels, Buses, and Railways with notice window adjustments.
  - DGCA & IRCTC statutory cancellation policy accordion grids with time slabs and deduction rates.
  - Official Refund Credit Note printable invoice view.
- **DPDP & GDPR Cookie Consent & User Agreement Banner (`CookieConsentBanner.jsx`)**:
  - Glassmorphic floating consent banner with "Accept All", "Essential Only", and "Preferences" modal.
  - Granular privacy toggles for Strictly Necessary, Personalization & Travel Memory, Analytics, and Tailored Offers.
- **Site-Wide Personalized Greetings & Dynamic Headlines**:
  - Remembers logged-in traveler name persistently across sessions.
  - Personalizes Homepage Hero, Special Offers Section, Offers Page, and Booking Review with custom greetings (e.g. *"Special Offers For You, Priyansh"*).
- **Mandatory Authentication Before Payment**:
  - Automatically verifies authentication state before launching payment gateway on `/review-booking`.
  - Prompts login modal while safely preserving the active booking draft in session memory.
  - Added authenticated traveler welcome badge and unauthenticated fare lock banner.
- **Backend Refund Engine & REST API (`refundService.js`, `server/index.js`)**:
  - `POST /api/refunds/calculate`
  - `POST /api/refunds/request`
  - `GET /api/refunds/track/:query`
  - `GET /api/refunds`
- **Automated Test Suite Expansion**: Added Tests 46–50 in `tests/server.test.js` (**50 / 50 tests passing with 100% success rate**).

---

## [1.6.0] - 2026-09-16

### 24/7 Concierge Help Desk, Problem Escalation & Multi-Channel Connect Hub

#### Added
- **Global Floating Help Desk Drawer (`HelpDeskWidget.jsx`)**: Added a 24/7 floating concierge launcher (`🎧 24/7 Help Desk`) accessible across the entire application with a glassmorphic drawer modal.
- **Direct Problem Reporting & Instant Ticket Generation**: Travelers can submit issues with problem categorization (`Booking Issue`, `Cancellation & Refund`, `Flight Reschedule / Delay`, `Payment / Billing`, `Special Assistance`), urgency tagging (`Urgent (Within 1 hr)`, `High (Within 3 hrs)`, `Normal (Within 24 hrs)`), linked PNR code, and automatic ticket assignment (`#TKT-XXXXX`).
- **1-Click Official WhatsApp Connect**: Embedded WhatsApp chat launcher (`+91 8269054018`) with auto-generated contextual message pre-filling the traveler's name, linked PNR, and problem description directly into `https://wa.me/918269054018`.
- **Direct Email Us Composer & Client Launch**: Integrated in-app direct email composer dispatching to `support@eazetrip.com` alongside a 1-click external email client launcher (`mailto:support@eazetrip.com`).
- **5-Minute Priority Call-Back Queue**: Priority voice assistance request channel that places travelers in the concierge callback queue with a guaranteed 5-minute SLA.
- **Interactive Ticket Tracking & Live Conversation Thread**: Built a real-time ticket viewer allowing travelers to track ticket status (`Open`, `In Progress`, `Resolved`), assigned concierge specialist, and send follow-up replies in chat bubble threads.
- **Multi-Channel Auto-Acknowledgment**: Every filed ticket automatically queues acknowledgment notifications across In-App, Email, and WhatsApp via `notificationService`.
- **Contact Page (`ContactPage.jsx`) Mode Switcher**: Integrated seamless switching between Inquiry Mode, Report Issue Ticket Mode, and Priority 5-Min Callback Mode.
- **Support Backend Service & REST API**: Implemented `server/services/supportService.js` with endpoints:
  - `POST /api/support/tickets`
  - `GET /api/support/tickets` & `GET /api/support/tickets/:id`
  - `POST /api/support/tickets/:id/message`
  - `POST /api/support/callback`
  - `POST /api/support/direct-mail`
- **Automated Test Suite Expansion**: Added 5 new automated tests (Tests 41–45) in `server.test.js` (45 / 45 tests passing with 100% success rate).

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
