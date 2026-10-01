# Changelog

All notable changes to the **EazeTrip** travel booking and e-commerce platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.6.9] - 2026-10-01

### Backend Robustness, CORS Hardening & Comprehensive Zero-Error Verification (102/102 Tests Passing)

#### Backend Architecture & Route Hardening (`server/index.js`, `tests/server.test.js`)
- **CORS Full Method & Header Support**: Configured CORS middleware to explicitly allow `PATCH` methods and custom security headers (`X-Admin-PIN`, `X-Razorpay-Signature`).
- **Resilient Async Route Error Forwarding**: Wrapped all async inventory search and detail routes (`/api/flights`, `/api/hotels`, `/api/buses`, `/api/railways`, `/api/holidays`) with `try/catch` and `next(err)` to prevent unhandled promise rejections.
- **Defensive Error Handling**: Guaranteed clean 404 JSON responses for nonexistent entity queries across all travel mediums without server-side uncaught exceptions.
- **Automated Test Suite Expansion**: Added tests 99 through 102 covering CORS header verification, nonexistent medium ID handling, promo minimum order edge cases, and partner registration validation (**102 / 102 tests passing**).

---

## [2.6.8] - 2026-10-01

### Backend Gaps Resolution & Full-Stack Hardening (98/98 Tests Passing)

#### Backend Enhancements (`server/index.js`, `server/data/db.js`, `server/services/supportService.js`, `tests/server.test.js`)
- **Profile & Me Endpoints (`GET /api/auth/profile`, `GET /api/auth/me`)**: Added session profile retrieval endpoints supporting `userId`, `email`, and Bearer token resolution with fallback safety.
- **Booking Lifecycle CRUD (`PUT /api/bookings/:id`, `DELETE /api/bookings/:id`)**: Implemented modification and deletion endpoints with database persistence in SQLite WAL.
- **B2B Partner & Corporate API (`POST /api/partner/register`, `POST /api/partner/login`)**: Added full-stack endpoints for travel agent onboarding and corporate session authentication.
- **Saved Co-Travelers API (`GET`, `POST`, `DELETE /api/users/:id/travellers`)**: Added persistent co-traveler profile storage and deletion in SQLite database.
- **Support Ticket Status Workflow (`PATCH /api/support/tickets/:id/status`)**: Added concierge agent assignment and status progression (`'Open'`, `'In Progress'`, `'Resolved'`, `'Closed'`).
- **Test Suite Expansion**: Added 5 new automated tests (tests 94-98), achieving 98/98 tests passing cleanly.

#### Frontend Client Integration (`client/src/services/api.js`, `client/src/pages/PartnerPage.jsx`)
- **Client API Methods**: Added `getProfile`, `updateBooking`, `deleteBooking`, `partnerRegister`, `partnerLogin`, `getSavedTravellers`, `saveTraveller`, `deleteTraveller`, and `updateTicketStatus`.
- **Active Partner Portal**: Wired `api.partnerRegister` and `api.partnerLogin` into `PartnerPage.jsx` with real-time feedback and state management.

---

## [2.6.7] - 2026-10-01

### Full-Stack Deep Dive Audit, Centralized Promo Validation, Verified Reviews & Test Expansion (93/93 Passing)

#### Backend Enhancements (`server/index.js`, `tests/server.test.js`)
- **Centralized Promo / Offer Validation API (`POST /api/offers/validate`)**: Added backend promo code calculation engine supporting flat and percentage-based discounts (`EAZETRIP`, `EXPLOREEAZ`, `EAZETRIP500`, `STAYEAZY`, `BUSEAZ`, `TRAINEAZ`, `FLYHIGH`, `HOLIDAY25`, `EAZETRIP1000`) with minimum booking threshold enforcement and service-specific validation.
- **Test Suite Expansion**: Added 4 new end-to-end automated tests (tests 90-93) verifying promo validation, verified traveler reviews, live inventory aggregators, and paise amount calculations, bringing total passing tests to 93/93.

#### Client Service & Review Consistency (`client/src/services/api.js`, `client/src/components/reviews/`, `client/src/pages/`)
- **API Client Abstraction**: Added `validateOffer`, `getReviews`, and `submitReview` methods to `api.js` for centralized error handling and offline fallback.
- **Universal Verified Reviews Across All 5 Mediums**: Integrated `ReviewSection` component into `BusBookingPage.jsx` and `RailwayBookingPage.jsx` alongside existing flights, hotels, and holidays.
- **Dynamic Asynchronous Promo Validation**: Updated `ReviewBookingPage.jsx` to dynamically validate coupons with `api.validateOffer` and provide instant feedback with offline safety.

---

## [2.6.6] - 2026-10-01

### Site-Wide UI Consistency, Currency-Aware Formatting & Code Simplification

#### Universal Currency Formatting Across All Filters & Cards (`client/src/components/`)
- **Global Context Integration**: Integrated `useCurrency()` and `formatPrice()` across all 5 domain filters (`FlightFilters.jsx`, `HotelFilters.jsx`, `TrainFilters.jsx`, `BusFilters.jsx`, `HolidayFilters.jsx`) and listing cards (`FlightCard.jsx`, `HotelCard.jsx`, `TrainCard.jsx`, `BusCard.jsx`, `HolidayCard.jsx`).
- **Dynamic Multi-Currency Support**: All max prices, nightly rates, base fares, ticket costs, packages, and taxes dynamically adapt with accurate conversion rates and currency symbols (`INR ₹`, `USD $`, `EUR €`, `GBP £`, `AED د.إ`).

#### Cohesive Design Tokens & Code Simplification (`client/src/App.css`)
- **Standardized Border Radii & Shadows**: Cleaned up card containers to uniform 16px radius with subtle `#e2e8f0` borders and 0 2px 10px shadows across all medium listings.
- **Unified Journey Timelines**: Consolidated track styles with centered medium badges for flights, trains, and buses.

---

## [2.6.5] - 2026-10-01

### 50% Floating Search CTA Alignment, Centered Vehicle Dashed Journey Track, Price Filter Priority & Double Outline Elimination

#### 50% Floating Search CTA Alignment (`client/src/App.css`)
- **Pixel-Perfect 50% Overlap**: Re-adjusted `.listing-search-card-wrapper` padding to `padding: 20px 24px 18px 24px;` and `.search-action-wrap-floating` with `bottom: -24px` so the floating search CTA button sits with an exact 50% overlap across the bottom border of the card on both Home and listing search widgets.

#### Centered Vehicle Dashed Journey Track (`client/src/components/flights/FlightCard.jsx`, `client/src/components/trains/TrainCard.jsx`, `client/src/components/buses/BusCard.jsx`, `client/src/App.css`)
- **Medium-Specific Vehicle Center Icons**: Replaced timeline lines with a sleek dashed track line (`--- [Icon] ---`) featuring a centered vehicle badge:
  - Flights: Centered blue Plane badge (`Plane`) on dashed track.
  - Trains: Centered purple Train badge (`Train`) on dashed track.
  - Buses: Centered emerald Bus badge (`Bus`) on dashed track.

#### Removed IRCTC Partner Strips (`client/src/pages/RailwayBookingPage.jsx`, `client/src/components/search/TrainSearchWidget.jsx`)
- **Direct Clean Layout**: Removed the IRCTC authorized banner strip from the top of the train booking results page and the header text from `TrainSearchWidget`.

#### Top-Positioned Price Filters & Smooth Sidebar Scrollbar (`client/src/components/holidays/HolidayFilters.jsx`, `client/src/App.css`)
- **Price Filter Priority #1**: Reordered filters in `HolidayFilters.jsx` so the Budget per Person slider is positioned at the very top, creating a unified standard where Price is the #1 filter across all 5 booking mediums.
- **Enhanced Sidebar Scrolling**: Styled `.listing-sidebar` with smooth scrolling, sleek 5px scrollbar thumb, rounded track, and clean right padding.

#### Double Outline & Focus Ring Elimination (`client/src/App.css`)
- **Eliminated Conflicting Outline Rings**: Removed redundant browser focus rings and double box-shadow rings on `.train-class-card.is-selected`, `.flight-card.selected`, time slot buttons, and filter pills, providing crisp single-border active states.

---

## [2.6.4] - 2026-10-01

### Borderless Filter Pane & Premium Listing Cards Refinement

#### Borderless Filter Sidebar (`client/src/App.css`)
- **Eliminated Outer Card Box**: Removed background color, borders, and box shadows from `.filter-sidebar` across all medium listing pages (Flights, Hotels, Trains, Buses, Holidays).
- **Clean Sectional Dividers**: Filter groups and headers now sit seamlessly directly on the layout with crisp `1px solid #e2e8f0` horizontal separation lines, maximizing screen space and eliminating nested container clutter.
- **Fluid & Responsive Alignment**: Maintained borderless presentation across both desktop and tablet/mobile viewports (`@media screen and (max-width: 1024px)`).

#### Luxury Listing Cards Refinement (`client/src/App.css`)
- **Consolidated Clean Luxury Cards**: Harmonized `.flight-card`, `.hotel-card`, `.bus-card`, `.train-card`, and `.holiday-card` styling with consistent `16px` border radii, subtle `#e2e8f0` borders, balanced padding, and gentle hover elevations.
- **Optimized Holiday Card Format**: Streamlined `.luxury-holiday-card` to a balanced 3-column format (`280px 1fr 220px`) with high-contrast duration/discount overlay badges, clear inclusion chips, bold per-person pricing with tax notes, and dual itinerary/booking CTAs.

---

## [2.6.3] - 2026-10-01

### Search CTA Clearance, Unified Clean Filter Sidebar & Luxury Listing Cards Redesign

#### Search Floating Button Clearance & Card Padding (`client/src/App.css`)
- **Centered Half-In / Half-Out Alignment**: Updated `.search-action-wrap-floating` bottom position to `bottom: -24px` for a balanced 50/50 overlap across the search card's bottom border.
- **Card Breathing Room**: Increased bottom padding on `.listing-search-card-wrapper` and `.hero-search-wrapper` to `padding: 24px 28px 36px 28px`, and set `.listing-top-search-banner { padding: 36px 0 46px; margin-bottom: 36px; }` to give the CTA button generous clearance above and below.

#### Unified Single-Card Filter Sidebar Layout (`client/src/App.css`, `client/src/components/holidays/HolidayFilters.jsx`)
- **Eliminated Nested Waste Space**: Replaced nested card boxes in Holiday filters with the standard single-card `.filter-sidebar` container.
- **Custom Pixel-Perfect Checkboxes & Radios**: Introduced lightweight custom CSS radio and checkbox controls (`.filter-checkbox-row input`) with smooth checkmark and dot states, eliminating double icons, weird misalignment, and oversized native circles.
- **Tidy Category Pills & 2x2 Time Slot Grid**: Standardized pill chips and departure time slot cards with uniform padding, clean active states, and centered typography.

#### Luxury Listing Cards Redesign (`client/src/App.css`, `client/src/components/holidays/HolidayCard.jsx`, `client/src/components/flights/FlightCard.jsx`)
- **Holiday Tour Cards**: Redesigned to a clean 3-column luxury travel format (`280px 1fr 220px`) with duration/discount overlay badges, star ratings with review counts, verified tour badges, neat inclusions chips, bold price with taxes inclusion note, and dual action buttons (`View Itinerary` + `BOOK PACKAGE →`).
- **Flight, Train, Bus & Hotel Cards**: Polished typography, badge alignment, pricing hierarchy, and tactile CTA buttons across all booking mediums.

---

## [2.6.2] - 2026-10-01

### Why Choose Us Spacing Alignment, 2-Tab Route Grid Containment, Standardized Micro-Animations & Page Transitions

#### Why Choose EazeTrip Spacing & Border Radius Alignment (`client/src/App.css`)
- **Equalized Vertical Spacing**: Adjusted `.assurance-banner-modern` top margin to `margin-top: 24px` to match the exact 24px horizontal and vertical `gap` of `.features-grid`.
- **Harmonized Corner Radius**: Standardized corner radius to `border-radius: 16px` across both `.feature-card` and `.assurance-banner-modern`.

#### Trending Train & Bus Routes 2-Tab Consistency & Grid Containment (`client/src/components/home/TrendingTrainRoutes.jsx`, `client/src/components/home/TrendingBusRoutes.jsx`, `client/src/data/siteData.js`, `client/src/App.css`)
- **2-Tab Switcher Standardization**: Streamlined tab selectors across all trending routes sections (Flights: Domestic / International, Trains: Vande Bharat & Premier / Superfast & Express, Buses: Volvo & AC Sleeper / Express & Intercity) for a unified 2-option UX pattern.
- **Strict Grid Width Containment**: Configured `.routes-cards-grid` with `grid-template-columns: repeat(4, minmax(0, 1fr))` and set `.route-item-card { min-width: 0; overflow: hidden; }` with ellipsis truncation on `.route-city-name` and `.route-sub-name`, preventing layout expansion or viewport overflow.
- **Fixed Photography Assets**: Replaced broken Varanasi ghat image URL with a verified high-resolution landmark photograph (`photo-1571536802807-30451e3955d8`).

#### Refined 5-Pattern Global Luxury Micro-Animations & Hover Effects (`client/src/App.css`)
- **Card Subtle Lift (`.hover-lift`)**: Smooth hardware-accelerated `-3px` Y-lift with layered ambient depth shadow on listing cards, deal cards, and feature boxes.
- **Button Micro-Press (`.btn-scale`)**: Tactile `-1.5px` hover lift and `0.985` active push scale on CTAs and search buttons.
- **Arrow Slide (`.hover-arrow-slide`)**: Smooth `+3px` X-translation on navigational trigger icons.
- **Soft Border Glow (`.hover-glow`)**: Soft focus ring and primary border tint on search input cells and selectors.
- **Ambient Micro-Pulse (`.micro-pulse`)**: Gentle breathing pulse on live tracking status pills and verified badges.

#### Smooth Page Route Transitions (`client/src/App.jsx`, `client/src/App.css`)
- **Keyed View Transitions**: Wrapped active `<Routes location={location}>` in `<div key={location.pathname} className="page-route-transition">` triggering a lightweight 0.28s cubic-bezier fade-and-rise entry animation upon route changes and search submissions.

---

## [2.6.1] - 2026-10-01

### Navbar Service Reordering, Search Swap Spacing Fix & Streamlined Train & Bus Showcase UI

#### Header Navigation Service Order (`client/src/components/common/Header.jsx`)
- **Synchronized Order**: Updated the navigation services array on both desktop and mobile drawer navigation to match the hero search tab switcher: **Flights** ➜ **Trains** ➜ **Buses** ➜ **Hotels** ➜ **Holidays**.

#### Search Widget Swap Spacing Fix (`client/src/App.css`)
- **From / To Gap Separation**: Added dedicated padding rules (`.search-cell-block.cell-from { padding-right: 20px; }` and `.search-cell-block.cell-to { padding-left: 24px; }`) ensuring the floating circular swap button centers between cells with clean breathing space without colliding with or overlapping origin or destination text.

#### Popular Trains & Popular Bus Operators UI Polish (`client/src/components/home/PopularTrains.jsx`, `client/src/components/home/PopularBusOperators.jsx`, `client/src/App.css`)
- **Minimalist Luxury Layout**: Streamlined both sections to match the clean visual grammar of `PopularAirlines.jsx`.
- **Eliminated Visual Clutter**: Removed bulky nested colored frames, extra section tag pills, and redundant multi-line badge stacks.
- **Clean Monogram + Title + Subtitle**: Standardized on clean 44x44px brand monograms, bold operator/locomotive names, and concise single-line subtitles (`Semi High-Speed`, `Premier AC Sleeper`, `Volvo 9600 • 4.9 ★`).

#### Trending Train Routes & Trending Bus Routes Grid Polish (`client/src/components/home/TrendingTrainRoutes.jsx`, `client/src/components/home/TrendingBusRoutes.jsx`, `client/src/components/home/TrendingFlightRoutes.jsx`, `client/src/App.css`)
- **Unified Card Geometry**: Standardized 4-column route cards with clean thumbnail photography, bidirectional city pairs (`.route-cities-row`), subtle carrier/train tags, and crisp starting price badges (`.route-sub-price`).
- **Clean Thematic Filters**: Minimalist scope toggle buttons with dedicated theme accents (Purple for Trains, Emerald Green for Buses, Sky Blue / Crimson for Flights).

---

## [2.6.0] - 2026-10-01

### Popular Bus Operators & Trending Bus Routes Sections Below Travel Categories

#### Popular Bus Operators Section (`client/src/components/home/PopularBusOperators.jsx`, `client/src/data/siteData.js`, `client/src/App.css`)
- **Carrier Strip Below Categories**: Added a dedicated intercity bus operator showcase modeled after Popular Airlines with two interactive scope tabs:
  - `Premier & Luxury Volvo`: *IntrCity SmartBus* (`4.9 ★`, Primo Certified), *Zingbus Plus* (`4.8 ★`, Live GPS), *NueGo Electric* (`4.8 ★`, 100% Electric EV), *VRL Travels* (`4.7 ★`, Super Luxury Multi-Axle), and *SRS Travels* (`4.6 ★`, Top Rated Scania).
  - `State RTC & Superfast`: *KSRTC Airavat* (`4.9 ★`, State Premier), *Orange Tours & Travels* (`4.8 ★`, On-Time Guaranteed), *UPSRTC Janrath* (`4.5 ★`, Govt. Certified), *MSRTC Shivneri* (`4.7 ★`, Scania AC), and *HRTC Himsuta* (`4.8 ★`, Hill Master Volvo).
- **1-Click Search Routing**: Direct navigation to `/bus-booking?operator=...` upon clicking any operator badge.

#### Trending Bus Routes Section (`client/src/components/home/TrendingBusRoutes.jsx`, `client/src/data/siteData.js`, `client/src/pages/HomePage.jsx`, `client/src/App.css`)
- **Positioning**: Positioned directly below Popular Bus Operators and above Why Choose EazeTrip.
- **Scope Filters**:
  - `VOLVO & AC SLEEPER`: High-demand intercity sleeper routes (*Bengaluru ⇄ Hyderabad*, *Delhi ⇄ Manali*, *Mumbai ⇄ Goa*, *Pune ⇄ Mumbai*, *Chennai ⇄ Bengaluru*, *Delhi ⇄ Jaipur*, etc.).
  - `ELECTRIC & GREEN BUS`: Zero-emission EV corridors (*Delhi ⇄ Agra*, *Bengaluru ⇄ Tirupati*, *Chennai ⇄ Pondicherry*, *Hyderabad ⇄ Warangal*, *Delhi ⇄ Chandigarh*, *Bengaluru ⇄ Mysore*, etc.).
  - `POPULAR INTERCITY`: Classic superfast bus connections (*Delhi ⇄ Shimla*, *Bengaluru ⇄ Ooty*, *Jaipur ⇄ Udaipur*, *Kolkata ⇄ Digha*, *Delhi ⇄ Rishikesh*, *Pune ⇄ Kolhapur*, etc.).
- **Rich 4-Column Grid**: Features landmark photos, bus model/operator names, duration pills, and starting price badges.

---

## [2.5.9] - 2026-10-01

### Integrated 4-Pillar Assurance Strip Inside Why Choose EazeTrip Section

#### Why Choose EazeTrip Section Layout (`client/src/pages/HomePage.jsx`, `client/src/App.css`)
- **Integrated Assurance Strip**: Relocated the 4-item assurance card (*Get more for less*, *No hassle no stress*, *Your journey our commitment*, *Instant confirmation & 24/7 care*) from a standalone section directly into `<section className="section-block why-choose-section">` positioned beneath the 3 core feature cards (*Best Price Guarantee*, *Fast & Easy Booking*, *100% Safe & Secure*).
- **Preserved Design System & Spacing**: Maintained identical modern 4-column divided card geometry, soft vertical dividing borders, pastel icon badges, and applied `margin-top: 32px` for clean proportional breathing space.

---

## [2.5.8] - 2026-10-01

### 5-Card Trending Destinations Layout, Popular Trains Section & Trending Train Routes Grid Above Travel Categories

#### Trending Destinations Section (`client/src/components/home/TrendingDestinations.jsx`, `client/src/data/siteData.js`)
- **Streamlined to 5 Handpicked Cards**: Removed the third bottom row of 3 cards, leaving a clean 2-card top hero row (*New Delhi*, *Mumbai*) and 3-card bottom row (*Goa*, *Bangalore*, *Jaipur* for Domestic; *Bangkok*, *Bali*, *London* for International).

#### Popular Trains Section (`client/src/components/home/PopularTrains.jsx`, `client/src/data/siteData.js`, `client/src/App.css`)
- **Premier & Express Locomotive Strip**: Added dedicated train carrier strip modeled after Popular Airlines with two interactive scope tabs:
  - `Premier & High-Speed`: *Vande Bharat Express* (Semi High-Speed 160 km/h), *Rajdhani Express* (Superfast AC Sleeper), *Shatabdi Express* (Day Express), *Tejas Express* (Smart Luxury), *Gatimaan Express* (160 km/h).
  - `Express & Heritage`: *Duronto Express* (Non-Stop), *Humsafar Express* (Comfort 3AC), *Amrit Bharat Express* (Push-Pull Superfast), *Garib Rath Express* (Economy 3AC), *Palace on Wheels* (Royal Heritage).
- **Direct Route Linking**: Clicking any train badge navigates directly to `/railways` with pre-filled train specifications.

#### Trending Train Routes Section (`client/src/components/home/TrendingTrainRoutes.jsx`, `client/src/data/siteData.js`, `client/src/pages/HomePage.jsx`, `client/src/App.css`)
- **Section Placement**: Positioned directly below Popular Trains and immediately above the Travel Categories section.
- **Scope Toggle Filters**:
  - `VANDE BHARAT`: Top high-speed corridors (*New Delhi ⇄ Varanasi*, *New Delhi ⇄ Katra*, *Mumbai CSMT ⇄ Goa*, *Chennai Central ⇄ Bengaluru*, *Howrah ⇄ Puri*, etc.).
  - `RAJDHANI & SHATABDI`: Premier AC metro connections (*Mumbai Rajdhani*, *Howrah Rajdhani*, *Kalka Shatabdi*, *Lucknow Tejas*, etc.).
  - `SUPERFAST INTERCITY`: High-frequency superfast routes (*Deccan Queen*, *Gatimaan Express*, *Patna Jan Shatabdi*, *Brindavan Express*, etc.).
- **Rich Route Cards**: Features landmark photography, origin/destination bidirectional arrows, train names, duration, and starting fare badges.

---

## [2.5.7] - 2026-10-01

### Unified Connected Segmented Search Container & Domain Customizations across All 5 Mediums (Flights, Trains, Buses, Hotels, Holidays)

#### Train Search Widget (`client/src/components/search/TrainSearchWidget.jsx`, `client/src/App.css`)
- **Connected 5-Column Segmented Grid**: Replaced disconnected legacy card layout with `.unified-segmented-box.train-unified-box` (From Station, To Station, Travel Date, Class, Quota) with synchronized label rows, swap button, and integrated date picker overlay.
- **Top Mode Selectors**: Added top radio selectors (`Book Train Tickets`, `Check PNR Status`, `Live Train Tracking`) with active pill indicators and `Zero PG Charges` badge.
- **Custom Train Quotas**: Integrated 6 interactive train quota chips (`General`, `Tatkal (TQ)`, `Ladies Quota`, `Senior Citizen`, `Divyangjan`, `Duty Pass`).
- **Assurance & Protection Strip**: Added bottom assurance bar featuring `Free Train Cancellation (Zero Charge)`, instant UPI refund badge, and `PNR Enquiry & Live Train` CTA.

#### Bus Search Widget (`client/src/components/search/BusSearchWidget.jsx`, `client/src/App.css`)
- **Connected 5-Column Segmented Grid**: Upgraded to `.unified-segmented-box.bus-unified-box` (From City, To City, Journey Date, Bus Type, Seats) with passenger seat counter dropdown overlay.
- **Top Category Radios**: Added `All Intercity Buses`, `AC Sleeper Coaches`, and `Primo / Luxury EV` with `Live GPS Tracking` badge.
- **Bus Preference Deal Chips**: Integrated 6 interactive deal chips (`Regular`, `Primo Certified`, `AC Sleeper`, `EV Green Bus`, `Women Exclusive`, `Round Trip Saver`).
- **Delay Assurance Strip**: Added bottom assurance bar featuring `Bus On-Time & Delay Assurance`, instant refund badge, and `Live Bus Tracker` CTA.

#### Hotel Search Widget (`client/src/components/search/HotelSearchWidget.jsx`, `client/src/App.css`)
- **Connected 5-Column Segmented Grid**: Upgraded to `.unified-segmented-box.hotel-unified-box` (Destination/Hotel, Check-In, Check-Out, Rooms & Guests, Property Type) with interactive counter popup for adults, children, and rooms.
- **Top Category Radios**: Added `Hotels & Resorts`, `Homestays & Villas`, and `Luxury 5-Star Palaces` with `Couple & Family Friendly` badge.
- **Hotel Deal Chips**: Integrated 6 interactive stay chips (`Best Rate`, `Free Breakfast`, `Couple Friendly`, `Beach & Pool`, `Business Travel`, `Private Villa`).
- **Guaranteed Check-in Strip**: Added bottom assurance bar with `Guaranteed Check-in (2x Refund Shield)` and `Last-Minute Hotel Deals` CTA.

#### Holiday Search Widget (`client/src/components/search/HolidaySearchWidget.jsx`, `client/src/App.css`)
- **Connected 5-Column Segmented Grid**: Upgraded to `.unified-segmented-box.holiday-unified-box` (Destination/Package, Starting From, Travel Month, Tour Theme, Travellers) with travellers popup counter.
- **Top Package Radios**: Added `All Tour Packages`, `Domestic Wonders`, and `International Escapes` with `Flights & Hotels Included` badge.
- **Holiday Theme Deal Chips**: Integrated 6 interactive holiday deal chips (`All-Inclusive`, `Honeymoon Special`, `Family Vacation`, `Adventure & Trek`, `Luxury Resorts`, `Budget Escape`).
- **Customizable Itinerary Strip**: Added bottom assurance bar with `100% Customizable Itinerary Option` and `Tour Expert Callback` CTA.

---

## [2.5.6] - 2026-10-01

### Precise 50% Floating Search CTA Protrusion, Horizontal Baseline Alignment for Input Cells, Single-Row Reviews Stream & Site-Wide Minimal Hover Polish

#### Hero Booking Search Widget Alignment & Floating Button (`client/src/App.css`, `client/src/components/search/FlightSearchWidget.jsx`)
- **Precise 50% In / 50% Out Protrusion**: Positioned the blue `SEARCH` button wrapper at `bottom: -44px` on `.search-action-wrap-floating` with button height `48px`, placing exactly 24px inside the search wrapper and 24px protruding outside across the bottom border. Added `margin-bottom: 42px` on `.hero-search-wrapper` for clean breathing clearance.
- **Horizontal Baseline Synchronization**: Unified all 6 segmented columns (`From`, `To`, `Departure`, `Return`, `Travellers`, `Cabin Class`) with identical `.search-cell-label-row` containers (height `16px`), aligning all text labels, chevrons, date numerals, and subtitles on the exact same horizontal baseline across all columns.
- **Compact Symmetrical Internal Padding**: Tightened `.hero-search-content` to `12px 18px 20px 18px` and `.search-cell-block` to `8px 12px; min-height: 72px;` for a compact, modern luxury appearance.
- **Invisible Full-Cell Date Picker Overlay**: Configured `.custom-date-overlay-input` to invisibly cover the entire date card (`inset: 0; opacity: 0; cursor: pointer;`) for seamless calendar triggers.

#### Single-Row Infinite Reviews Stream (`client/src/components/home/ReviewsSection.jsx`, `client/src/App.css`)
- **Single Marquee Stream**: Converted dual-row marquee to a single continuous infinite marquee track (`.track-single-marquee`) with all 16 verified traveler reviews looping smoothly left-to-right.
- **Polished Card Geometry & High Contrast**: Set card width to `360px`, `border-radius: 16px`, `padding: 18px 20px`, crisp `#0f172a` typography, amber `#d97706` rating badges, and soft border `#e2e8f0`.

#### Site-Wide Minimal Hover Interaction Audit (`client/src/App.css`)
- **Removed Excessive Scale & Jumping**: Toned down hover transforms across the entire application (replaced heavy `scale(1.08)` to `scale(1.15)` and `translateY(-8px)` with subtle `translateY(-1px)` to `translateY(-2px)` and gentle `scale(1.02)` image expansions).
- **Soft Border Shifts**: Replaced harsh thick hover outlines with gentle `#cbd5e1` / `#0284c7` border transitions.

---

## [2.5.5] - 2026-10-01

### Topbar Height Harmonization, Reordered Hero Tabs (Flights-Trains-Buses-Hotels-Holidays), Full-Width Offers Marquee & Post-Category Assurance Strip

#### Topbar Visual Alignment (`client/src/App.css`)
- **Matching Height & Padding**: Standardized WhatsApp Support badge, Phone button, Currency & Language selectors, and Login/Signup button to an exact `32px` uniform height with `line-height: 1` flex centering.
- **Cleaned Duplicate Style Overrides**: Removed conflicting `.topbar-whatsapp` rule to maintain uniform pill aesthetics across all viewports.

#### Hero Travel Tabs Reordering & Compact Symmetrical Padding (`client/src/pages/HomePage.jsx`, `client/src/App.css`)
- **Reordered Travel Tabs**: Arranged hero booking medium switcher in the requested logical sequence: **Flights** ➜ **Trains** ➜ **Buses** ➜ **Hotels** ➜ **Holidays**.
- **Compact Symmetrical 4-Side Padding**: Reduced excessive padding on `.hero-search-content` (`padding: 16px 20px 24px 20px` desktop, `14px 14px 22px 14px` mobile) for balanced, modern spacing.
- **Consistent Floating Search Buttons**: Integrated `.search-action-wrap-floating` with centered `.modern-floating-btn` (half inside, half outside bottom border) across Trains, Buses, Hotels, and Holidays search widgets.

#### Special Offers Edge-to-Edge Full-Width Marquee (`client/src/components/home/SpecialOffersSection.jsx`, `client/src/App.css`)
- **Removed Enclosing Card Box**: Removed `.special-offers-main-card` constraint, enabling the infinite single-row auto-scrolling bank offers marquee to stream edge-to-edge across full viewport width like the reviews marquee.

#### Modern Post-Category Assurance Strip (`client/src/pages/HomePage.jsx`, `client/src/App.css`)
- **Relocated Off Hero Section**: Removed the assurance banner from the hero section to keep the hero clean and focused purely on title, subheadline, and booking search widget.
- **Modern Post-Category Placement**: Positioned the assurance strip directly below the Tour Categories wave section with 4 clean divided boxes and modern Lucide icons (`Percent`, `CheckCircle2`, `ShieldCheck`, `Headphones`).

---

## [2.5.4] - 2026-10-01

### Hero Search Unified Segmented Box & Floating Button, Infinite Special Offers Marquee, Deep Tour Wave Curve, Footer Justification, and Global Scrollbar Hide

#### Hero Search Booking Widget Redesign (`client/src/components/search/FlightSearchWidget.jsx`, `client/src/App.css`)
- **Segmented Connected Input Container**: Implemented unified connected segmented container (`.unified-segmented-box`) matching reference layout with `From`, `Swap` icon button, `To`, `Departure ∨`, `Return ∨`, `Travellers ∨`, and `Cabin Class ∨` cells.
- **Trip Type Radios & Feature Badges**: Added custom radio buttons for `One Way`, `Round Trip`, and `Multi City` with dynamic blue dots, plus `Flight + Cab connection` banner with `NEW` badge.
- **Select a Special Fare Cards**: Integrated subtitle fare cards (`Regular`, `Student`, `Armed Forces`, `Have a GST number ?`, `Senior Citizen`, `Doctor and Nurses`) with active highlight states and discount micro-copy.
- **Price Drop Protection & Flight Status Strip**: Added bottom protection strip with shield rupee badge and quick-action `Flight Status` ticket pill.
- **Centered Floating SEARCH Button**: Positioned high-contrast royal blue `SEARCH` button (`.modern-floating-btn`) centered half-inside and half-outside the bottom card edge.

#### Special Offers Section Redesign (`client/src/components/home/SpecialOffersSection.jsx`, `client/src/App.css`)
- **Centered Header & Filter Tabs**: Centered section title, subtitle, and category pills for harmonious symmetry.
- **Single-Row Infinite Auto-Scrolling Marquee**: Replaced legacy carousel arrows with continuous smooth marquee track (`.bank-offers-marquee-track`) with hover pause and seamless linear gradient edge masks.

#### Tour Categories Parabolic Wave Offsets (`client/src/App.css`)
- **Amplified U-Shape Wave Curve**: Elevated outer cards 1 & 5 (`margin-top: -18px`), set middle cards 2 & 4 to `margin-top: 44px`, and lowered center card 3 (`margin-top: 104px`) for dramatic parabolic curvature.

#### Reviews Luxury Cards & Footer Justified Grid (`client/src/App.css`)
- **Luxury Review Cards**: Upgraded review cards with refined border accents, smooth hover elevation, verified buyer badges, and dual-row infinite marquee.
- **Justified SEO Footer Directory**: Restructured link groups into an evenly distributed, clean multi-column justified grid (`.seo-links-inline-grid`).

#### Global Scrollbar Removal & Preloader Animation (`client/src/index.css`, `client/src/App.css`)
- **Hidden Scrollbars**: Applied global scrollbar hiding across all browsers (`scrollbar-width: none !important; ::-webkit-scrollbar { display: none !important; }`) while preserving smooth Lenis wheel scroll.
- **Preloader Smooth Transition**: Refined initial site preloader with smooth radial fade, scale easing, and soft ambient glow.

#### HelpDesk Hub Tabs Cleanup (`client/src/pages/HelpDeskPage.jsx`)
- **Cleaned Tab Options**: Removed unused Direct WhatsApp and 5-Min Callback tabs, retaining Report Problem/Ticket, Direct Mail Us, and Track My Tickets.

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
