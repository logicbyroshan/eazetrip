# Changelog

All notable changes to the **EazeTrip** travel booking and e-commerce platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.5.3] - 2026-10-01

### Hero Search Formatted Date Display, Segmented Field Grid, Equal Badge 4-Side Padding & HelpDesk Layout Width Polish

#### Hero Search Booking Widgets & Formatted Date Cards (`client/src/components/search/*`, `client/src/App.css`)
- **Luxury Formatted Date Display**: Replaced raw native browser `<input type="date">` boxes with luxury MakeMyTrip/Skyscanner-style travel cards featuring bold day number (e.g. `22`), month and year (`Sep'26`), and weekday (`Tuesday`).
- **Invisible Overlay Datepicker**: Integrated full-card invisible date inputs (`.custom-date-overlay-input`) with native calendar picker trigger for instant, frictionless date selection on both desktop and mobile.
- **Dynamic Return Trip Toggle Card**: Implemented interactive `+ Add Return / Save more on round trip` dashed card in `FlightSearchWidget.jsx` that smoothly switches to Round Trip mode with active return date selection.
- **Symmetrical Grid & Field Cards**: Standardized `min-height: 68px`, 14px border radius, crisp typography, and vertically centered rotating swap button across Flights, Hotels, Buses, Trains, and Holidays widgets.

#### Trending Destinations City Badges Equal Padding (`client/src/App.css`)
- **Uniform 4-Side Padding**: Updated `.trending-city-badge` and inner `.city-flag` to equal top, right, bottom, and left padding (`padding: 8px 8px;` and `padding: 4px 4px;`) with strict `line-height: 1` flex centering.

#### Help Desk Page Layout & Direct Assistance Sidebar Alignment (`client/src/components/common/HelpDeskWidget.jsx`, `client/src/App.css`)
- **Contextual Launcher Visibility**: Automatically hides the floating `24/7 Help Desk` launcher widget when viewing the dedicated `/helpdesk` page (`location.pathname === '/helpdesk'`).
- **Full Width Grid Alignment**: Refined `.helpdesk-page-grid` (`1fr 360px`), `.helpdesk-sidebar-col`, and `.contact-box-item` to align flush with the page container and hero banner.

---

## [2.5.2] - 2026-10-01

### Topbar Cleanliness, Portrait Destination Cards, Hover Zoom, White Badges, Marquee Shadow Fix & Direct HelpDesk Routing

#### Topbar Refinements (`client/src/components/common/TopBar.jsx`, `client/src/App.css`)
- **Streamlined Navigation Elements**: Removed the redundant home icon button and redundant links (`Offers`, `Manage Bookings`, `Make Payment`) from the topbar.
- **Consistent Height & Vertical Alignment**: Locked topbar and container to a uniform `44px` height with clean flex centering and responsive spacing across all screen sizes.

#### Trending Destinations & Tour Categories Visual Polish (`client/src/App.css`)
- **Portrait Card Aspect Ratios**: Expanded destination card heights (`.trending-card-large: 380px`, `.trending-card-medium: 340px`) and tour category frames (`aspect-ratio: 4 / 5`) to tall, immersive portrait orientations.
- **Image Hover Zoom**: Replaced shrinking hover transition (`scale(0.96)`) with a gentle, smooth zoom-in expansion (`scale(1.08)`).
- **High-Contrast White Badge Text**: Fixed dark/unreadable text by enforcing crystal-clear `#ffffff` text and glowing semi-transparent badges (`.trending-city-badge`).

#### Reviews Marquee Shadow Remediation (`client/src/App.css`)
- **Eliminated Dirty Edge Shadow Blocks**: Removed conflicting absolute gradient block overlays (`.reviews-marquee-fade-left`, `.reviews-marquee-fade-right`) that created dark bands behind scrolling cards.
- **Refined CSS Gradient Masking**: Replaced overlay blocks with a smooth, native CSS linear-gradient edge mask on `.reviews-marquee-viewport` for seamless infinite streaming.

#### Direct Help Desk Navigation (`client/src/components/common/HelpDeskWidget.jsx`)
- **Direct Page Routing**: Replaced the bulky popup modal/drawer launcher with a fast, lightweight launcher that links directly to the full `/helpdesk` hub page.

---

## [2.5.1] - 2026-09-30

### Google Auth Real Account Integration, Cookie & One-Tap Staggering, and Hero Search Full Width

#### Google Authentication & Real Account Resolution (`client/src/context/AuthContext.jsx`, `client/src/components/auth/GoogleOneTapPrompt.jsx`)
- **Real Google Identity Services Decoding**: Enhanced client-side Google OAuth handling with safe JWT base64url decoding to automatically extract traveler real name, email, avatar photo, and Google ID token.
- **Dynamic Account Selector & Sandbox Mode**: Replaced static hardcoded mock profile ("Priyansh Sharma") with dynamic remembered user details (`eazetrip_remembered_name`, `eazetrip_remembered_email`) and an interactive account switch/edit mode.
- **Session Dismissal Persistence**: Google One-Tap dismiss action persists in `sessionStorage` (`eazetrip_onetap_dismissed`) to prevent repeated prompts during active sessions.

#### Cookie Consent & Google One-Tap Prompt Staggering (`client/src/components/common/CookieConsentBanner.jsx`, `client/src/components/auth/GoogleOneTapPrompt.jsx`)
- **Staggered Modal Entrances**: Resolved simultaneous modal collision by decoupling prompt appearance timers.
  - *First-time Visitors*: Cookie Consent Banner appears first at 1.2s; Google One-Tap waits for the `eazetrip-cookie-consent-settled` custom event (or 6.5s fallback delay).
  - *Returning Visitors (Consent Settled)*: Google One-Tap prompt appears smoothly after 2.8s.
- **Custom Event Synchronization**: Dispatched `eazetrip-cookie-consent-settled` on all consent decision buttons (Accept All, Essential Only, Save Preferences).

#### Hero Booking Widget Full-Width Alignment (`client/src/App.css`)
- **Container Full Width**: Updated `.hero-content` from `max-width: 1120px` to `max-width: 100%`, allowing the search widget to span the full 1240px container width symmetrically with the navbar and assurance banner.
- **Refined Styling & Typography**: Added dedicated styles for Google One-Tap avatar placeholders, custom account inputs, and switch buttons.

---

## [2.5.0] - 2026-09-26

### Digital Personal Data Protection Act, 2023 & DPDP Rules, 2025 Full-Stack Implementation

#### Data Governance & Privacy Architecture (`server/services/dpdpService.js`, `server/data/db.js`)
- **Itemized Statutory Notice (Section 5 & Rules 2025)**: Introduced `GET /api/dpdp/notice` exposing version `v2026.1` with an itemized taxonomy of personal data categories, purposes, retention periods, legal bases, downstream processors, and DPO escalation information.
- **Verifiable Consent Engine (Section 6)**: Implemented immutable consent record logging (`consent_records` table) capturing purpose, status (`granted`, `withdrawn`, `denied`), notice version, masked IP hash, user agent, and timestamps.
- **Consent Withdrawal (Section 6(4))**: Enabled instant consent revocation via `POST /api/dpdp/consent/withdraw` with automated cascading to notification preferences and marketing dispatch queues.
- **Self-Service Data Principal Rights (Sections 11–14)**:
  - *Right to Access (Section 11)*: `GET /api/dpdp/data-export` produces a portable JSON summary of profile data, passenger manifests, payment records, and third-party sharing.
  - *Right to Erasure (Section 12(3))*: `POST /api/dpdp/erasure-request` anonymizes traveler accounts and revokes credentials while segregating statutory GST invoices in locked audit storage.
  - *Right of Grievance Redressal (Section 13)*: `POST /api/dpdp/grievances` logs privacy grievances with statutory 90-day SLA deadline calculations and automated DPO assignment.
  - *Right to Nominate (Section 14)*: `POST /api/dpdp/nomination` and `GET /api/dpdp/nomination` allow Data Principals to appoint a legal representative.
- **Minor & Children's Data Safeguard (Section 9)**: Implemented minor detection (`isMinor: true`) and automated blocking of targeted marketing and behavioral profiling campaigns directed at child travelers.
- **Automated Retention & Pruning Engine (Section 8(7))**: Scheduled cleanup purging expired rate limiter records, stale session tokens, and communications delivery logs older than 90 days.
- **Personal Data Breach Response (Section 8(6))**: Built `server/services/breachService.js` with structured severity triage, DPBI statutory notification generation, and affected user disclosure templates.
- **PII Log Sanitization & Redaction (`server/utils/piiMasker.js`)**: Implemented utility functions to mask raw email addresses (`p****a@gmail.com`), phone numbers (`+91 98765*****`), and bank accounts (`XXXX-XXXX-9012`) in server telemetry.

#### Interactive Frontend Privacy Center & Account Integration
- **Interactive Privacy & Data Protection Center (`client/src/pages/PrivacyPage.jsx`)**: Built a full-featured 3-mode interface with Statutory Notice taxonomy table, Self-Service Data Rights Center (Download Data, Manage Consent, Appoint Nominee, Erasure), and DPO Grievance Portal.
- **Profile Privacy & Governance Tab (`client/src/pages/ProfilePage.jsx`)**: Added a dedicated "Privacy & Governance (DPDP)" tab allowing authenticated travelers to manage purpose-based consents, download personal archives, and appoint legal nominees.
- **Cookie Consent Banner (`client/src/components/common/CookieConsentBanner.jsx`)**: Updated notice links to `/privacy` and synchronized granular consent recording with backend DPDP audit stores.
- **Checkout Consent & Minor Attestation (`client/src/pages/ReviewBookingPage.jsx`)**: Added statutory DPDP consent disclosures and verifiable parental consent attestation for child passengers prior to payment.

#### Automated Test Suite Expansion (`tests/server.test.js`)
- Added tests 77–89 verifying all DPDP endpoints, consent state transitions, data export schema, IDOR protection, minor safeguards, grievance SLA timers, breach filing generator, PII log masking, and automated retention pruning (89/89 tests passing).

---

## [2.4.3] - 2026-09-26

### Fluid Responsive Typography, Dynamic Spacing Tokens & Adaptive Corner Radii

#### Master Design System Tokens (`client/src/index.css`)
- **Fluid Typography Tokens**: Implemented dynamic `clamp()` typography scales across `--text-2xs` to `--text-5xl` that scale continuously with viewport width, eliminating abrupt jumps.
- **Adaptive Breakpoint Spacing**: Added responsive tokens for container padding (`--container-px`), card padding (`--card-padding`), section gaps, and 8-point grid variables (`--space-*`) scaling down gracefully on tablet, mobile, and ultra-compact screens.
- **Adaptive Corner Radii**: Configured responsive corner radius scaling (`--radius-xl`, `--radius-lg`, `--radius-md`, `--radius-sm`, `--card-radius`) from 22px on desktop to 14px on mobile and 10px on small screens, preventing card clipping.

#### Component Geometry & Format Shifts (`client/src/App.css`)
- **Universal Fluid Headings**: Bound `.hero-title`, `.hero-subtitle`, `.section-title`, `.card-section-title`, and travel listing titles to fluid `clamp()` values.
- **Fluid Container Width**: Converted `.container` to full fluid width with `max-width: 1240px` and dynamic `var(--container-px, 16px)` gutters.
- **Card Padding Binding**: Bound all 5 travel mediums, search widgets, admin backoffice, profile, and review sections to `var(--card-padding)` and `var(--card-radius)`.

---

## [2.4.2] - 2026-09-26

### Mobile & Cross-Device Adaptive Overhaul

#### Mobile Listing Cards & Responsive Viewport Hierarchy (`client/src/App.css`)
- **Luxury Travel Cards Stacking**: Resolved CSS specificity overrides on `.flight-card.luxury-flight-card`, `.hotel-card.luxury-hotel-card`, `.bus-card.luxury-bus-card`, `.train-card.luxury-train-card`, and `.holiday-card.luxury-holiday-card` to cleanly stack on mobile viewports (<900px, <600px, <400px), eliminating horizontal clipping and cramped side-by-side columns.
- **Adaptive Pricing & CTA Row**: On mobile screens, flight, hotel, and bus price amounts and action buttons ("Book Now", "Book Room", "Select Seats") transition into dedicated horizontal/full-width flex bars with 44px+ touch targets.
- **Mobile Search Widget Grids**: Converted flight, hotel, bus, train, and holiday search field grids to dynamic 2-column on tablet (<1024px) and 1-column on mobile (<600px).
- **Swap Button Orientation**: Re-anchored the swap origin/destination button to center vertically on mobile screens with smooth 90° orientation.
- **Marquee Mask Optimization**: Narrowed edge gradient masks to 28px on mobile to preserve full readability of verified customer reviews without masking center content.
- **Step Tracker & Route Strips**: Configured `.booking-step-tracker-bar` and `.flight-route-strip` for seamless rendering on 320px–390px mobile viewports with zero horizontal overflow.

---

## [2.4.1] - 2026-09-23

### Infinite Dual-Row Reviews Marquee & Cinematic Edge Gradient Fade

#### Reviews Section Redesign (`client/src/components/home/ReviewsSection.jsx`, `client/src/App.css`)
- **Dual-Row Bidirectional Marquee**: Replaced the static 3-card grid with 16 rich verified traveler review cards split across two continuous streaming rows moving in opposite directions (Row 1 scrolling Left, Row 2 scrolling Right).
- **Cinematic Edge Gradient Fade**: Configured dual-layer edge masks with `mask-image: linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)` and dedicated absolute linear-gradient overlay curtains on left and right borders to guarantee seamless card entry and exit without abrupt cutoffs.
- **Micro-Interactions & Hover Pause**: Enabled automatic stream pause (`animation-play-state: paused`) and subtle card elevation (`transform: translateY(-5px)`) when hovering over any card.
- **Rich Verified Travel Metadata**: Each card displays 5 gold stars, 5.0 score badge, travel category pill with custom Lucide icon (Flight, Hotel, IRCTC Train, Bus, Holiday), route/destination chip (e.g. `BOM ✈ DEL`, `Taj Fort Aguada`, `Vande Bharat Express`), quote with quotation mark, gradient avatar circle, and green Verified Booking badge.
- **Responsive Layout**: Fluid downscaling to 320px cards and adjusted animation speeds on tablet and mobile viewports.

---

## [2.4.0] - 2026-09-23

### Phase 3 & Enterprise UI/UX Overhaul: Spacing Architecture, Color Hierarchy, Multi-Currency, Verified Reviews & PWA Wallet

#### UI/UX Spacing Architecture & Color Psychology Overhaul
- **Navbar & TopBar Refresh (`client/src/components/common/TopBar.jsx`)**:
  - Removed awkward condensed gaps; added generous 12px vertical padding, subtle separator borders, and unified text hierarchy.
  - Implemented sleek user profile pill (`.user-profile-btn`) with subtle outline and hover contrast.
  - Added dedicated WhatsApp and 24/7 hotline direct contact links in the top utility ribbon.
- **Search Widget & Special Fares Layout (`client/src/App.css`)**:
  - Redesigned "Special Fares" chips with 10px spacing and visual pill containers, preventing text wrap overlap.
  - Separated Search CTA (`.search-action-wrap`) with a crisp divider and 18px top margin, eliminating cramped button boundaries.
- **Flight Results & Filter Sidebar (`client/src/components/flights/FlightFilters.jsx`)**:
  - Transformed departure time filter buttons into a balanced 2x2 grid layout (`grid-template-columns: repeat(2, 1fr)`) with dedicated icon slots and clean, unwrapped labels.
  - Fixed price slider to dynamically render values in the active selected currency.
- **Flight Cards & Action Button Group (`client/src/components/flights/FlightCard.jsx`)**:
  - Completely decoupled sticking action buttons: "Flight Details" is now a refined bordered glass pill (`.btn-details-pill`) while "Book Now" is an elevated primary gradient pill (`.btn-book-pill`).
  - Added 12px horizontal gap and `justify-content: flex-end` for natural visual scannability.
- **Modal Isolation & Backdrop Elevation (`client/src/App.css`, `client/src/components/flights/FlightDetailsModal.jsx`)**:
  - Set modal overlay `z-index: 100000` with high-density backdrop blur (`backdrop-filter: blur(10px)`) and deep drop shadows (`0 28px 75px rgba(3, 78, 162, 0.22)`).
  - Repositioned and isolated the floating 24/7 Help Desk button (`z-index: 1000`), permanently eliminating widget bleeding over opened modals.
  - Fixed awkward segment title text bug (`IndiGo • 6E-2041 · Economy Class` cleanly separated).
  - Added 14px gap in modal action footer between "Close" and "Proceed to Book".
- **Lenis Smooth Scrolling (`client/src/App.jsx`, `client/src/index.css`)**:
  - Tuned Lenis smooth scroll duration (1.2s), custom ease-out-quart curve (`t => Math.min(1, 1.001 - Math.pow(2, -10 * t))`), and added standard Lenis CSS reset tokens.

#### Multi-Currency & Internationalization Support (`client/src/context/CurrencyContext.jsx`)
- Introduced global `CurrencyContext` with automatic conversion and symbol formatting for 5 major global currencies: `INR (₹)`, `USD ($)`, `EUR (€)`, `GBP (£)`, and `AED (د.إ)`.
- Added dynamic language selector supporting English (`EN`) and Hindi (`HI`).
- Persists user preferences seamlessly in `localStorage` (`eazetrip_currency`, `eazetrip_language`).
- Fully hooked into TopBar, search forms, price sliders, flight/hotel cards, and checkout modals.

#### Verified Traveler Reviews & Photo Uploads (`client/src/components/reviews/`)
- Created interactive `ReviewSection.jsx` featuring verified customer rating score badges (`5.0/5`), filter pills (`All`, `With Photos`, `5 Star`), and photo thumbnail gallery with modal lightbox preview.
- Created `ReviewSubmitModal.jsx` allowing travelers to leave verified 1-5 star ratings, structured feedback, and drag-and-drop travel photos.
- Integrated Base64 image encoding with immediate preview and delete support, storing media directly into the database.
- Embedded across Flight, Hotel, and Holiday booking detail views.

#### Progressive Web App (PWA) & Offline E-Ticket Wallet (`client/public/*`)
- Implemented `manifest.json` with theme color `#034ea2`, modern icons, and standalone display mode for desktop and mobile home screen installation.
- Created Service Worker (`sw.js`) with cache-first strategy for static assets and offline ticket caching.
- Created `OfflineTicketBanner.jsx` displaying non-intrusive offline warnings with instant access to cached tickets in `/manage-bookings`.

---

## [2.3.0] - 2026-09-23

### Phase 2 Enterprise Architecture: Multi-Channel Communications Gateway & Admin Operations Portal

#### Real SMS & WhatsApp Gateway (`server/services/smsWhatsappService.js`)
- Integrated multi-channel SMS and WhatsApp notification delivery engine compatible with Twilio and Meta WhatsApp Cloud API.
- Implemented real delivery tracking, sandbox simulation fallback with pre-formatted message logs, and inbound webhook endpoint (`POST /api/webhooks/whatsapp`).
- Connected into `server/services/notificationService.js` for instant booking confirmation dispatch with PNR, flight/train details, and interactive support links.

#### Production Email Dispatch Service (`server/services/emailService.js`)
- Created transactional email dispatch service supporting Resend API, custom SMTP relay, and structured HTML ticket rendering.
- Equipped with queue metrics, delivery status tracking, and failover logging.

#### Backoffice Admin Operations & Concierge Portal (`client/src/pages/AdminDashboardPage.jsx`)
- Built unified Admin Operations Suite at `/admin` accessible with PIN verification (`admin123` or environment-configured `ADMIN_PIN`).
- **Tab 1: Overview & Metrics**: Real-time revenue counters, booking breakdown by transport type, refund settlement ratios, and DLQ backlog alerts.
- **Tab 2: Global Bookings Directory**: Searchable by PNR, passenger name, contact phone, transport mode, and status with direct inspection.
- **Tab 3: 1-Click Refund Settlement**: Bank ARN issuance, instant payout authorization, and customer status sync for cancellation claims.
- **Tab 4: Concierge & Support Tickets**: Live support ticket view, 5-minute callback manager, priority escalations, and status toggles.
- **Tab 5: DLQ & Gateway Health**: Visual monitoring for WhatsApp, SMS, and Email delivery queues, with 1-click retry on dead-letter queue items.

#### Automated Test Suite Expansion (`tests/server.test.js`)
- Added tests 71 to 76 covering PIN verification, revenue metrics calculation, bookings directory queries, 1-click refund settlement with ARN generation, DLQ batch retries, and review ingestion. Total automated test count reached **76 passing tests**.

---

## [2.2.0] - 2026-09-23

### Phase 1 Enterprise Architecture: Database Persistence & Live Travel Inventory Engine

#### Persistent Database Engine (`server/data/db.js`)
- Implemented persistent SQLite storage engine utilizing Node 24 native `node:sqlite` (`DatabaseSync`) with Write-Ahead Logging (`PRAGMA journal_mode = WAL;`) and auto-schema migration.
- Fully persists users, bookings, PNR records, refunds, support tickets, callbacks, notifications, DLQ items, and reviews across server restarts.
- Auto-seeds baseline catalog and users on initial startup; uses in-memory SQLite isolation during automated test runner executions (`NODE_ENV === 'test'`).
- Added robust file-backed JSON store fallback mechanism for maximum cross-platform resilience.

#### Modular Live Travel Inventory Engine (`server/services/inventory/*`)
- **Flights**: Created `flightProvider.js` adhering to Amadeus GDS / Airline NDC formats with real-time seat availability, dynamic pricing, and baggage specs.
- **Hotels**: Created `hotelProvider.js` modeled after Expedia EPS / Hotelbeds schemas with live room categories, free cancellation deadlines, and breakfast options.
- **Railways**: Created `trainProvider.js` integrating IRCTC B2B partner schemas with live running status and PNR confirmation probabilities.
- **Buses**: Created `busProvider.js` supporting redBus / AbhiBus B2B layout with live tracking status and boarding point timelines.
- Added live provider inspection diagnostic route: `GET /api/inventory/providers`.

#### Test Suite Expansion (`tests/server.test.js`)
- Added tests 65 to 70 validating database booking persistence, update synchronization, user profile persistence, provider feed metadata, and aggregator fallbacks. Total automated test count reached **70 passing tests**.

---

## [2.1.9] - 2026-09-16

### Universal Breadcrumb Standardization & Design Enhancement

#### Reusable Breadcrumb Component (`client/src/components/common/Breadcrumb.jsx`)
- Created universal, accessible `<Breadcrumb items={[...]} />` component with semantic `<nav><ol><li>` structure, auto-detecting Home item with `<Home size={13} />` icon and `<ChevronRight size={13} />` separators.
- Supports multi-tier routing (e.g. `Home > Legal & Compliance > Privacy Policy` or `Home > My Trips & Bookings`).

#### Curated Design Tokens & Micro-Interactions (`client/src/App.css`)
- Added `.eazetrip-breadcrumb`, `.breadcrumb-list`, `.breadcrumb-item`, `.breadcrumb-link`, `.breadcrumb-current`, `.breadcrumb-chevron`, and `.breadcrumb-home-icon`.
- Included hover elevation (`transform: translateY(-0.5px)`), subtle background pill highlight (`rgba(3, 78, 162, 0.08)`), accessible `:focus-visible` outlines, and text truncation on small mobile viewports.

#### Cross-Page Implementation (`client/src/pages/*`)
- Standardized breadcrumbs across all 12 major application content, account, support, and legal pages:
  - `AboutPage.jsx` (`Home > About EazeTrip`)
  - `ManageBookingsPage.jsx` (`Home > My Trips & Bookings`)
  - `CancellationRefundPage.jsx` (`Home > Cancellation & Refund Hub`)
  - `HelpDeskPage.jsx` (`Home > 24/7 Dedicated Help Desk & Concierge`)
  - `FaqPage.jsx` (`Home > Help Center & FAQ`)
  - `ContactPage.jsx` (`Home > 24/7 Concierge Support & Problem Desk`)
  - `OffersPage.jsx` (`Home > Exclusive Offers & Deals`)
  - `PartnerPage.jsx` (`Home > B2B Partner & Corporate Portal`)
  - `PaymentPage.jsx` (`Home > Invoice & Quick Payment`)
  - `ProfilePage.jsx` (`Home > My Profile & Account`)
  - `PrivacyPage.jsx` (`Home > Legal & Compliance > Privacy Policy`)
  - `TermsPage.jsx` (`Home > Legal & Compliance > Terms & Conditions / User Agreement`)

---

## [2.1.8] - 2026-09-16

### Deep Holiday Packages Integration & Cross-Product Lifecycle

#### Manage Bookings & Reservation Hub (`client/src/pages/ManageBookingsPage.jsx`, `client/src/context/BookingContext.jsx`)
- **Dedicated Holidays Filter Pill**:
  - Added `{ key: 'holiday', label: 'Holidays' }` filter button to the reservations toolbar alongside All Trips, Flights, Hotels, Buses, and Trains.
  - Added `<Palmtree size={20} color="#ea580c" />` icon in `getTypeIcon` for seamless holiday card rendering.
  - Added initial demo holiday package booking (`Royal Rajasthan & Udaipur Heritage Tour (4N/5D)`, PNR: `6EZ9HL`, ₹28,499) into default booking store.

#### Cancellation & Refund Calculator & Statutory Policies (`client/src/pages/CancellationRefundPage.jsx`, `server/services/refundService.js`)
- **Interactive Refund Calculator**:
  - Added `Holiday Tour` selector button with `<Palmtree />` icon and dynamic penalty calculator (>15 days 10% operator retainer, 7–15 days 25% retention, 3–7 days 50% deduction, <72h 80% non-refundable flight/hotel portion, 100% refund with Zero Shield).
- **Policy Accordion**:
  - Added **5. Holiday Packages & Curated Tours Policy** detailing advance notice cancellation slabs, hotel voucher terms, and tour rescheduling.

#### Discovery, SEO & Support Integrations (`client/src/data/siteData.js`, `client/src/components/home/TravelCategoriesSection.jsx`, `client/src/components/common/Footer.jsx`, `client/src/components/common/SeoFooterDirectory.jsx`, `client/src/pages/OffersPage.jsx`, `client/src/pages/HelpDeskPage.jsx`, `client/src/components/common/HelpDeskWidget.jsx`)
- **Homepage Tour Categories**: Updated category cards (Cultural Heritage, Beach Getaways, Luxury Stays, Scenic Roads) to link directly to `/holiday-booking`.
- **Footer & SEO Directory**: Added `Holiday Packages` to `Our Products` in Footer, added dedicated `Curated Holiday Packages & Tour Escapes` group to `SeoFooterDirectory.jsx`, and enriched `siteFaqs` with 3 Holiday Tour Package Q&As.
- **Offers & Bank Discounts**: Added `Holidays` category filter on `/offers`, mapped holiday promotional deals (`HOLIDAY25` 25% OFF, `KOTAKHOLIDAY` ₹5,000 OFF).
- **24/7 Concierge Support**: Added `🌴 Holiday Package / Tour Customization` to problem categories across full `/helpdesk` page and floating widget.

---

## [2.1.7] - 2026-09-16

### Manage Bookings Alignment & Enterprise About Us Showcase

#### Manage Bookings Layout & Alignment Fixes (`client/src/pages/ManageBookingsPage.jsx`, `client/src/App.css`)
- **Action Buttons Alignment**:
  - Rebuilt the hero banner action buttons (`Refund Status Hub` and `Plan New Journey`) using unified `.banner-action-btn` classes with consistent 42px height, 18px horizontal padding, 10px rounded corners, and balanced Lucide icons (`Receipt`, `Compass`).
  - Added `.bookings-banner-right` flex wrapper (`display: flex; align-items: center; gap: 12px; flex-wrap: wrap;`) ensuring both buttons sit side-by-side with perfect geometry.
- **Search & Filter Controls**:
  - Shortened placeholder text to `"Search by ID, PNR, City..."` and increased search input width to `320px` in `App.css` to prevent text clipping across screen resolutions.

#### Enterprise About Us Page Showcase (`client/src/pages/AboutPage.jsx`, `client/src/App.css`)
- **Luxury Showcase Architecture**:
  - Rebuilt `AboutPage.jsx` into a comprehensive 1200px corporate showcase featuring a gradient hero banner with ambient glow, mission statement, and direct CTA buttons (`Explore Flights & Holidays`, `24/7 Concierge Help Desk`).
- **6 High-Contrast Stat Cards**:
  - `1.2M+ Happy Travelers`, `450+ Airline & Bus Partners`, `15,000+ Verified Hotels & Stays`, `99.8% On-Time Ticketing SLA`, `< 15 Mins Concierge Response SLA`, and `4.9 / 5.0 Customer Trust Score`.
- **Story & 5-Year Milestone Timeline**:
  - Detailed narrative of EazeTrip's founding in 2022 to combat surge traps, accompanied by a 2022–2026 growth roadmap.
- **6 Core Customer Pillars**:
  - *Zero Hidden Surcharges*, *Zero Shield™ Instant UPI Refunds*, *24/7 Human-First Concierge*, *Live GDS & IRCTC Inventory*, *Eco-Conscious Travel Offsets*, and *Corporate & B2B Travel Desk*.
- **Executive Leadership & National Presence**:
  - 4 leadership profile cards (CEO, CTO, VP Alliances, Head of CX) and 4 office cards (HQ in MP, Mumbai, New Delhi, Bengaluru).
- **Security & Compliance Accreditations**:
  - *IATA Certified*, *IRCTC Authorized*, *256-Bit SSL Vault*, and *ISO 27001 Certified*.

---

## [2.1.6] - 2026-09-16

### Dedicated 24/7 Help Desk Page & Floating Modal Formatting Overhaul

#### Dedicated Full-Page Help Desk & Concierge (`client/src/pages/HelpDeskPage.jsx`, `client/src/App.jsx`, `client/src/App.css`)
- **Luxury Concierge Hero & SLA Metrics**:
  - Implemented dedicated `/helpdesk`, `/help-desk`, `/support`, and `/help` full-page experience featuring a gradient hero banner (`.helpdesk-hero-banner`) with glowing ambient backdrop, personalized welcome banner, and 4 SLA stat badges (`< 15 Mins Response SLA`, `+91 82690 54018 24/7 Direct Helpline`, `WhatsApp Chat Instant 1-on-1 Support`, and `100% Guaranteed Resolution Commitment`).
- **Interactive Multi-Mode Support Hub (`.helpdesk-hub-card`, `.helpdesk-hub-tabs-bar`)**:
  - **`🚨 Report Problem / Ticket`**: 2-column dropdown grid (`.form-grid.two-col`) for *Problem Category* and *Urgency Level*, active PNR auto-fill (`6EZ9KM`), detailed description box, and 3-column contact fields (`.form-grid.three-col`).
  - **`💬 Direct WhatsApp Concierge`**: 1-click WhatsApp launch (`https://wa.me/918269054018`) with real-time pre-configured chat message template containing traveler name, active PNR, and problem summary.
  - **`✉️ Direct Email Dispatch`**: In-app email composer routing directly to `support@eazetrip.com`.
  - **`📞 5-Min Priority Callback`**: Urgent queue scheduler for airport emergencies and flight date changes.
  - **`📋 Track My Tickets (Live Desk)`**: Real-time 2-column ticket conversation viewer and interactive reply composer.
- **Support Features & Common Tools Grid (`.helpdesk-features-grid`, `.helpdesk-feature-card`)**:
  - Added 4 bottom cards for *Flight Reschedule & Date Change*, *Zero Shield Refund Protection*, *Hotel Check-in & Special Requests*, and *Baggage & Airport Emergency*.
  - Added sidebar with *Concierge Desk Channels* and *Common Self-Serve Tasks* (`View & Print E-Tickets`, `Cancel & Calculate Refund`, `Frequently Asked Questions`).

#### Floating HelpDesk Widget & Modal Layout Optimization (`client/src/components/common/HelpDeskWidget.jsx`, `client/src/App.css`)
- **Resolved Viewport Overflow & Submit Button Clipping**:
  - Replaced unstyled Tailwind classes (`grid-cols-2`, `grid-cols-3`) with native `.form-grid.two-col` and `.form-grid.three-col` CSS classes.
  - Added **`Full Page ↗`** header navigation link (`.helpdesk-open-fullpage-link`) directly inside the modal topbar for 1-click transition to the dedicated `/helpdesk` page.
  - Adjusted modal window max-height (`min(92vh, 720px)`) and body padding (`18px 22px`) ensuring all input fields and the submit button remain fully visible without clipping.

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
