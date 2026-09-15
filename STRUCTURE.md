# Project Structure & Architecture

ExploreEase (EazeTrip) is structured as a modern full-stack travel booking application with a React 19 / Vite client and an Express.js API backend.

```
EazeTrip/
├── client/                     # Frontend Application (React 19 + Vite)
│   ├── public/                 # Static public assets, favicon
│   ├── src/
│   │   ├── assets/             # Brand logos, icons, vector illustrations
│   │   ├── components/         # Reusable UI components & modals
│   │   │   ├── BusSeatPickerModal.jsx
│   │   │   ├── CheckoutModal.jsx
│   │   │   ├── FlightDetailsModal.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── HotelFilters.jsx
│   │   │   ├── LoginModal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── OfferCard.jsx
│   │   │   ├── TicketModal.jsx
│   │   │   └── ...
│   │   ├── context/            # React Context state management
│   │   │   ├── AuthContext.jsx      # Authentication & user profile state
│   │   │   └── BookingContext.jsx   # Booking cart, history & active bookings
│   │   ├── pages/              # Main view containers & routes
│   │   │   ├── AboutPage.jsx
│   │   │   ├── BusBookingPage.jsx
│   │   │   ├── CancelBookingPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── FAQPage.jsx
│   │   │   ├── FlightBookingPage.jsx
│   │   │   ├── HotelBookingPage.jsx
│   │   │   ├── ManageBookingsPage.jsx
│   │   │   ├── PaymentPage.jsx
│   │   │   ├── PrivacyPolicyPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── RailwaysPage.jsx
│   │   │   ├── RefundPolicyPage.jsx
│   │   │   ├── TermsPage.jsx
│   │   │   └── ...
│   │   ├── services/           # Backend API integration layer
│   │   │   └── api.js          # REST Client with fallback resiliency
│   │   ├── App.jsx             # Main Application router & layout
│   │   ├── App.css             # Unified CSS design system
│   │   ├── index.css           # CSS Reset & base styles
│   │   └── main.jsx            # React root entry point
│   ├── index.html              # HTML5 host document with Google Fonts
│   ├── package.json            # Client dependencies & scripts
│   └── vite.config.js          # Vite build & proxy configuration
│
├── server/                     # Backend API Service (Express.js)
│   ├── data/
│   │   └── mockStore.js        # Seed catalog & persistent mock data store
│   ├── middleware/
│   │   ├── errorHandler.js     # Global uncaught error & 404 handler
│   │   ├── security.js         # Security headers, rate limiters, sanitizers
│   │   └── validation.js       # JSON schema & parameter validation rules
│   ├── index.js                # Express app configuration & REST route handlers
│   └── package.json            # Server dependencies
│
├── tests/                      # Automated Integration & Unit Test Suite
│   └── server.test.js          # Node.js native test runner suite (12 tests)
│
├── .env.example                # Sample environment configuration
├── API.md                      # REST API Reference
├── SECURITY.md                 # Security architecture & policy
├── STRUCTURE.md                # Repository layout & component taxonomy
├── CONTRIBUTING.md             # Contribution guidelines & coding conventions
├── CODE_OF_CONDUCT.md          # Community guidelines
├── SETUP.md                    # Local setup, testing & deployment guide
├── ABOUT.md                    # Project mission & feature matrix
├── README.md                   # Primary project overview
└── package.json                # Root automation scripts & test runner
```

---

## Component Taxonomy & Interaction Flow

1. **User Interaction**:
   - The user selects Flights, Hotels, Buses, or Railways tab on the Hero Search widget.
   - City auto-suggestions, passenger counts, and travel dates are validated locally.
2. **Catalog Fetching**:
   - `services/api.js` queries `/api/flights`, `/api/hotels`, `/api/buses`, or `/api/railways`.
   - Results are rendered in structured cards with price breakdowns, amenities, and timings.
3. **Booking Lifecycle**:
   - The user clicks **"Book Now"**, opening the `CheckoutModal` or `BusSeatPickerModal`.
   - Passenger details are entered and validated.
   - Upon proceeding to payment, `PaymentPage` renders payment methods (Card, UPI, NetBanking, Wallets).
   - Once simulated or processed, a unique PNR/Booking ID is issued via `POST /api/bookings`.
   - An e-ticket is rendered instantly in `TicketModal` and stored in `BookingContext` and localStorage.
4. **Manage & Cancel Bookings**:
   - `ManageBookingsPage` and `CancelBookingPage` allow users to view their active and past bookings, print tickets, or cancel reservations with instant refund status updates.
