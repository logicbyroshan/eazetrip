# Changelog

All notable changes to the **EazeTrip** travel booking and e-commerce platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.1.5] - 2026-09-16

### Visual Polish & Experience Redesign (FAQ, About Us, Contact Desk & Payment Portal)

#### Help Center & FAQ Overhaul (`client/src/pages/FaqPage.jsx`, `client/src/App.css`)
- **Luxury FAQ Design System**:
  - Rebuilt the FAQ search hero (`.faq-hero-box`, `.faq-search-input-wrap`) with gradient styling, ambient glow, and high-contrast keyword search bar.
  - Standardized category filter pills (`.category-filter-strip`, `.cat-pill-btn`) into an elevated pill bar with active royal blue elevation and distinct pill items (`All`, `Flights`, `Hotels`, `Buses & Trains`, `Payments & Refunds`).
  - Implemented interactive accordion cards (`.faq-accordion-item`, `.faq-question-btn`, `.faq-answer-content`) with chevron indicators and readable typography.
  - Added 24/7 Concierge CTA box (`.contact-cta-card`) with direct links to call and chat.

#### About Us Experience Elevation (`client/src/pages/AboutPage.jsx`, `client/src/App.css`)
- **4-Grid Key Statistics Cards (`.about-stats-grid`, `.stat-card-luxury`)**:
  - Replaced sparse text list with 4 elevated glassmorphism cards featuring icons, gradient metrics (1.2M+ Travelers, 450+ Partners, 15,000+ Hotel Stays, 24/7 Live Support).
  - Enhanced Core Values grid (`.about-values-grid`, `.value-box`) and corporate headquarters contact card.

#### 24/7 Concierge & Contact Desk Split Grid (`client/src/pages/ContactPage.jsx`, `client/src/App.css`)
- **Desktop 2-Column Responsive Split (`.contact-layout-grid`)**:
  - Implemented side-by-side grid (`1fr 1.35fr`) with dedicated Concierge Info column on the left and Interactive Support Desk on the right.
  - Added custom-colored icon circles for helpline, email, headquarters, and SLA guarantee.

#### Payment Gateway & Custom Checkout Cleanup (`client/src/pages/PaymentPage.jsx`)
- **Collapsible Developer Integration Drawer (`.credentials-accordion-wrap`)**:
  - Replaced intrusive inline debug `.env` code block with a clean, collapsible toggle so checkout remains 100% focused on consumer-grade payment flow.

---

## [2.1.4] - 2026-09-16

### Site-Wide Tab Section Header Architecture & Flex Utility Alignment

#### Unified Tab Section Headers Across All Profile Hubs (`client/src/pages/ProfilePage.jsx`, `client/src/App.css`)
- **Resolved Dropped/Stacked Action Buttons**:
  - Replaced legacy unstyled `.section-title-wrap` and `.section-header-row` across all 6 tabs in `ProfilePage` (My Trips, Refunds & Claims, Personal Info, Saved Travellers, Travel Preferences, and Communications & Queue) with the standardized `.tab-section-header` and `.tab-section-title-wrap` system.
  - Aligned all primary/secondary tab actions (`+ Submit Direct Claim`, `+ Add New Traveller`, `🔄 Refresh Queue`, `Manage All Bookings →`) to the top-right of the header container with `.manage-all-link` and `.manage-all-link.primary-cta` styling.
- **Fixed Utility Tokens (`client/src/index.css`)**:
  - Corrected `.flex-between-center` and `.flex-align-center` to enforce `display: flex !important;` alongside `justify-content: space-between` and `align-items: center`, preventing child buttons from falling below block text.

---

## [2.1.3] - 2026-09-16

### Button Text Wrapping Elimination & Comprehensive Action Row Standardization

#### Profile & Manage Bookings Action Columns (`client/src/App.css`, `client/src/pages/ManageBookingsPage.jsx`)
- **Resolved Button Text Wrapping**:
  - Removed duplicate CSS rule in `App.css` (lines 16167-16208) that constrained `.profile-card-action-btns` to 140px width and caused "Cancel & Refund" to wrap awkwardly onto two lines.
  - Standardized `.profile-card-action-btns` and `.action-buttons-stack` to `width: 180px; min-width: 180px;` across both `ProfilePage` and `ManageBookingsPage`.
  - Added icons (`<RotateCcw size={13} />`, `<Zap size={13} />`) and unified 10px rounded borders, 13px bold font, and high-contrast solid/outline states for `.view-ticket-btn`, `.profile-cancel-btn`, `.cancel-trip-btn`, and `.track-refund-secondary-btn`.

#### Universal Button White-Space Immunity (`client/src/index.css`, `client/src/App.css`)
- **Master Button Hierarchy (`client/src/index.css`)**:
  - Extended master inline-flex and `white-space: nowrap !important;` rule across all primary, secondary, outline, danger, ghost, booking, refund, pill, and campaign action classes (`.flight-book-btn`, `.luxury-hotel-book-btn`, `.luxury-bus-select-btn`, `.book-train-action-btn`, `.holiday-book-btn`, `.holiday-view-btn`, `.camp-btn`, `.copy-track-link-btn`, `.receipt-download-btn`).
- **Verified Zero Text-Wrapping & Clean Layout**:
  - Fully tested across all viewports; 62/62 automated tests passing, 0 Vite build errors.

---

## [2.1.2] - 2026-09-16

### Profile Header Streamlining & Action Button Contrast Pass

#### Profile Trips Header (`client/src/pages/ProfilePage.jsx`, `client/src/App.css`)
- **De-Cluttered Section Header (`.tab-section-header`)**:
  - Replaced redundant inline secondary buttons with a clean, modern title and a single right-aligned `Manage All Bookings →` action link.
  - Rebuilt the filter pill bar (`.trip-filter-pill-bar`, `.trip-pill-btn`) with active royal blue elevation and smooth hover states.
- **Trip Card Buttons Contrast Fix (`.view-ticket-btn`, `.profile-cancel-btn`)**:
  - Removed conflicting duplicate CSS override that caused white text on light blue backgrounds.
  - Standardized `.view-ticket-btn` to high-contrast solid Royal Blue with drop shadow and crisp typography.
  - Standardized `.profile-cancel-btn` to clean outlined red and `.profile-track-refund-btn` to amber pill styles.

---

## [2.1.1] - 2026-09-16

### Master Universal Spacing Tokens & Segmented Tab Navigation Pass

#### Universal Spacing & Layout Tokens (`client/src/index.css`)
- Added comprehensive 8-point utility tokens for margins (`.mt-0` through `.mt-8`, `.mb-0` through `.mb-8`, `.my-1` through `.my-6`), paddings (`.p-0` through `.p-6`, `.py-1` through `.py-6`, `.px-1` through `.px-5`), flex alignment (`.flex`, `.inline-flex`, `.flex-col`, `.items-center`, `.justify-between`), gaps (`.gap-1` through `.gap-8`), typography, and color helpers.
- Resolved zero-margin sticking across all pages where Tailwind-like utility classes were used without prior CSS definitions.

#### Profile & Account Hub Overhaul (`client/src/App.css`, `client/src/pages/ProfilePage.jsx`)
- **Luxury Segmented Tab Bar (`.profile-tabs-strip`)**:
  - Rebuilt tab bar into an elevated container with 16px radius, background surface, and active blue pill highlighting with soft drop shadow.
- **Hero & Stat Metric Card Spacing**:
  - Added 24px bottom margins to `.profile-hero-banner`, `.profile-stats-strip`, `.bookings-hero-banner`, and `.bookings-stats-strip`.
- **Trip & Refund Cards Polish**:
  - Structured `.profile-booking-item-card` with generous 22x26px padding, 48px rounded icon badges, clean typography, right-aligned amount boxes, and styled `.view-ticket-btn` / `.profile-cancel-btn`.

---

## [2.1.0] - 2026-09-16

### Legal Hub & Profile Communications UI/UX Consolidation

#### Legal & Compliance Hub (`client/src/pages/TermsPage.jsx`, `client/src/pages/PrivacyPage.jsx`)
- **Master Legal Design System & Layout**:
  - Rebuilt Terms & Conditions (`/terms`), User Agreement (`/user-agreement`), and Privacy Policy (`/privacy`) into an enterprise-grade 2-column layout (`280px` sticky sidebar + structured document card).
  - Integrated rich gradient hero banners with real-time clause search filter and Print Agreement action buttons.
  - Added sticky Table of Contents navigation with smooth-scrolling section anchors.
  - Structured all statutory clauses (Acceptance, User Eligibility, DGCA/IRCTC carrier rules, RBI Payment Tokenization, Zero Shield Cancellation, User Conduct, Grievance Officer SLA) with icons and highlight callouts.

#### Profile Communications & Dead-Letter Queue Recovery (`client/src/pages/ProfilePage.jsx`)
- **Unified Campaign & Queue Design Tokens**:
  - Replaced ad-hoc utility classes with standardized design system components (`.campaign-card`, `.campaign-icon-wrap`, `.campaign-badge`, `.campaign-action-btn-row`, `.camp-btn`).
  - Standardized micro-interaction buttons for WhatsApp preview, HTML Email preview, and queue dispatch.
  - Refined the Dead-Letter Queue (DLQ) recovery monitor with consistent metric cards (`.q-metric-box`) and structured table layouts.

---

## [2.0.0] - 2026-09-16

### Deep Production-Readiness Remediation (10/10 Industry Standard)

#### Performance & Code-Splitting
- **Vite Dynamic Route Lazy-Loading & Manual Chunking (`client/vite.config.js`, `client/src/App.jsx`)**:
  - Code-split all 20 full-page routes into on-demand async chunks with `<Suspense>` fallback loader.
  - Granular vendor chunking: `vendor-react` (400 kB), `vendor-lucide` (48 kB), `vendor-router` (39 kB), `vendor-lenis` (18 kB), `vendor-misc` (4 kB).
  - Reduced initial JavaScript bundle payload by **89.3%** from 1.33 MB down to 143 kB, eliminating all chunk-size warnings and maximizing Core Web Vitals (LCP, FID/INP).

#### API & Backend Reliability
- **Universal Pagination & Sorting (`server/index.js`)**:
  - Added `page`, `limit`, and `sortBy` query parameters across Flights, Hotels, Buses, Indian Railways, and Holiday Tour Packages.
  - Implemented defensive bounding (clamped pagination, maximum limit capped at 100) preventing memory exhaustion or negative offset errors.
- **Extended System Health Diagnostics (`GET /api/health`)**:
  - Returns real-time system metrics: `rssMb`, `heapTotalMb`, `heapUsedMb`, `externalMb`, Node.js runtime version, uptime, and store counts.
- **Process Lifecycle & Crash Resilience (`server/index.js`)**:
  - Added global listeners for `unhandledRejection` and `uncaughtException` to log diagnostic traces and prevent unhandled daemon crashes.

#### Client API Resilience
- **Timeout & Retry Backoff (`client/src/services/api.js`)**:
  - Implemented 10-second `AbortController` timeouts on all network requests.
  - Added automated Bearer token injection from `localStorage` (`eazetrip_token`).
  - Added jittered retry backoff on idempotent GET requests upon transient network interruptions.

#### Test Suite Expansion
- **Automated Tests (`tests/server.test.js`)**:
  - Expanded test suite from 55 to 62 automated tests passing with zero failures covering health metrics, pagination, sorting, and boundary security.

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
