# Project Overview: EazeTrip

## 1. Mission & Purpose
**EazeTrip** (formerly ExploreEase) is a production-grade, full-stack travel reservation and e-commerce platform tailored for Indian and global travelers. It provides seamless booking discovery, fare comparisons, and instantaneous ticket issuance across 5 distinct travel mediums:
1. **Flights**: Domestic & international route searches with cabin/check-in baggage specs and multi-tier fares.
2. **Hotels**: Verified 3-star to 5-star properties, ratings, amenities, and room selection.
3. **Buses**: AC sleeper, semi-sleeper, and Volvo luxury bus routes with live boarding point maps.
4. **Railways**: Indian Railways (IRCTC partner integration) covering Vande Bharat, Rajdhani, and Express train schedules, class selection (1A, 2A, 3A, SL, EC, CC), and live quota status.
5. **Holiday Packages**: Curated domestic and international tour itineraries, day-wise schedules, hotel stays, sightseeing, and meal inclusions.

---

## 2. Technology Stack

* **Frontend**:
  * React 19 (`react`, `react-dom`)
  * Vite 8 build tool & dev server
  * React Router v7 (`react-router-dom`)
  * Lucide React icons (`lucide-react`)
  * Lenis smooth scrolling (`lenis`)
  * Vanilla CSS with CSS Custom Properties (`App.css`, `index.css`)
* **Backend**:
  * Node.js & Express 4 (`express`)
  * Razorpay Node SDK (`razorpay`)
  * Dotenv environment management (`dotenv`)
  * Native Node.js test runner (`node:test`, `node:assert`)
  * Concurrently dev runner (`concurrently`)
* **Storage & Persistence**:
  * Server-side in-memory store (`server/data/mockStore.js`)
  * Client-side persistent storage (`localStorage` for bookings/auth and `sessionStorage` for active checkout draft)

---

## 3. Key User Workflows

1. **Travel Search & Filtering**: Multi-tab search widget on homepage (`/`) and specialized listing pages (`/flights`, `/hotels`, `/buses`, `/railways`, `/holidays`).
2. **Multi-Step Checkout Flow**:
   - Step 1: Itinerary Review & Baggage Rules
   - Step 2: Traveler details, primary contact info, and optional corporate GST number
   - Step 3: Trip protection (medical insurance & zero cancellation shield) and instant promo code application
   - Step 4: Payment gateway (`/booking-payment`) with UPI QR, cards, net banking, or Razorpay modal
3. **Post-Booking Management**: Instant E-Ticket generation with PNR, booking download, print preview, and one-click cancellation with automated refund calculation (`/manage-bookings`).
4. **Authentication & Profile**: Dual login (Email / OTP phone number), profile management (`/profile`), and B2B partner registration (`/partner`).
