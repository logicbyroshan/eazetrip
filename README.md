# ExploreEase (EazeTrip) ✈️ 🏨 🚌 🚆

> **A full-stack modern travel and utility aggregation platform** inspired by ExploreEaz, built with the MERN stack (MongoDB/In-Memory Store, Express.js, React 19, Node.js) and Vanilla CSS design system.

---

## 🌟 Overview

**ExploreEase** is an end-to-end travel booking platform designed specifically for the Indian travel ecosystem. It allows users to search, compare, customize, and book **Flights, Hotels, Buses, and Railway (IRCTC) tickets** with instant confirmation, live filters, seat layouts, promo code discounts, and downloadable E-Ticket vouchers.

---

## 🚀 Key Features

### 1. ✈️ Flight Booking Engine
- **Trip Types:** One-Way, Round-Trip, and Multi-City search.
- **Airport Autocomplete:** Real-time IATA airport auto-suggest for Indian and international hubs (`DEL`, `BOM`, `BLR`, `CCU`, `MAA`, `HYD`, `GOI`, `JAI`, etc.).
- **Live Search Filters:**
  - Price range slider
  - Non-stop & 1-stop filters
  - Departure time slots (Early Morning, Morning, Afternoon, Evening)
  - Airline toggles (IndiGo, Air India, Akasa Air, SpiceJet)
- **Flight Details Modal:** Interactive tabs for **Flight Timetable/Schedule**, **Baggage Allowance** (15 kg check-in, 7 kg cabin), **Cancellation/Rescheduling Penalties**, and **Transparent Fare Breakup**.
- **Round-Trip Selection:** Select onward and return flights with a dynamic sticky bottom bar calculating the combined fare in real-time.

### 2. 🏨 Hotel Reservations
- **Destination Search:** Instant autocomplete across popular destinations (*Goa, Mumbai, Delhi, Jaipur, Manali, Bengaluru, Udaipur, etc.*).
- **Date & Guest Selectors:** Native datepickers for Check-in / Check-out, room counters, and adult/child guest selectors.
- **Hotel Listings:** Star ratings, user reviews, photo galleries, amenities chips (*Free WiFi, Swimming Pool, Free Breakfast, AC*), room types, and pricing.
- **Filter Sidebar:** Star rating filters (5-Star, 4-Star, 3-Star), Free Cancellation filter, and price slider.

### 3. 🚌 Intercity Bus Tickets
- **Route Search:** Search across major Indian bus corridors (*Pune ⇄ Mumbai, Nagpur ⇄ Hyderabad, Bengaluru ⇄ Chennai, etc.*).
- **Operator Details:** Orange Travels, Zingbus Plus, IntrCity SmartBus with bus types (*AC Sleeper 2+1, Bharat Benz, Multi-Axle Volvo*).
- **Interactive Seat Picker Modal:**
  - Dual-deck visualization (Lower Deck & Upper Deck)
  - Color-coded seat status: Available, Selected, Booked, and Ladies-Only berths
  - Boarding and dropping point selection

### 4. 🚆 Railway Bookings (IRCTC Partner)
- **Station Search:** Search by station name or code (`NDLS`, `BCT`, `CSMT`, `HWH`, `MAS`, `SBC`, etc.).
- **Train Cards:** Running days indicators (*M, T, W, T, F, S, S*), schedule timeline, pantry options, and class availability chips (*1A, 2A, 3A, 3E, SL*) with live confirmation probability and fare.
- **Quota Options:** General, Tatkal, Ladies, and Senior Citizen quotas.

### 5. 💳 Checkout & Payment Gateway Simulator
- **Passenger Details Form:** Title, First/Last Name, Gender, Date of Birth, and Contact Info.
- **GST Invoicing:** Optional corporate GSTIN and company name input.
- **Coupon Discount Engine:** Apply promo code `EXPLOREEAZ` for an instant ₹500 discount (also supports `STAYEAZY`, `BUSEAZ`, `TRAINEAZ`).
- **Payment Methods:**
  - **UPI / QR Code:** Scan & Pay via GPay, PhonePe, Paytm, or enter VPA ID.
  - **Credit & Debit Cards:** Card number, expiry date, and CVV verification.
  - **Net Banking:** 50+ supported Indian banks (HDFC, SBI, ICICI, Axis, etc.).
  - **Wallets:** Paytm, Amazon Pay, PhonePe.
- **Instant Processing:** Animated transaction processing with instant voucher issuance.

### 6. 📄 Official E-Ticket Voucher
- Printable & downloadable confirmation voucher with QR code, unique Booking ID (e.g. `EZ-FL-11005`), PNR code, passenger details, itinerary, payment breakdown, and travel terms.

### 7. 🔐 User Accounts & Booking Management
- **Login Modal:** Dual phone OTP mode (with captcha verification and demo OTP `1234`) and email mode (with password visibility toggle).
- **Manage Bookings (`/manage-bookings`):** View active and completed itineraries, open E-ticket vouchers, and cancel bookings with automated refund calculation.
- **User Profile (`/profile`):** Edit personal information and manage saved travellers for 1-click fast checkout.
- **Standalone Make Payment (`/payment`):** Dedicated invoice payment portal matching ExploreEaz.

### 8. 📜 Informational & Legal Pages
- **About Us (`/about`):** Company vision, core values, statistics, and registered office.
- **Contact Us (`/contact`):** Verified office address (*Saubhagya Bindiya Tower, MP*), phone (`+91 8269054018`), email (`priyansh@exploreeaz.com`), inquiry form with captcha and toast notifications.
- **FAQ (`/faq`):** Interactive searchable accordions covering Flights, Hotels, Buses, Trains, and Payments/Refunds.
- **Terms & Conditions (`/terms`) & User Agreement (`/user-agreement`)**
- **Privacy Policy (`/privacy`)**
- **Cancellation & Refund Policy (`/cancellation-refund`)**
- **Offers (`/offers`):** Exclusive promo code cards with 1-click clipboard copy.
- **Partner Access (`/partnerLogin`, `/partner-registration`, `/corporate-login`)**

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) |
| **Routing** | [React Router v7](https://reactrouter.com/) |
| **Icons & Visuals** | [Lucide React](https://lucide.dev/) |
| **Styling** | Custom Vanilla CSS Design System with CSS Variables, Flexbox, CSS Grid & Glassmorphism |
| **State Management** | React Context API (`AuthContext`, `BookingContext`) with `localStorage` persistence |
| **Backend Server** | [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/) + [CORS](https://www.npmjs.com/package/cors) |
| **API Architecture** | RESTful JSON API |

---

## 📁 Project Structure

```
eazetrip/
├── client/                      # React frontend client
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/            # Login modal & authentication
│   │   │   ├── buses/           # Bus cards & interactive seat picker modal
│   │   │   ├── checkout/        # Checkout wizard & printable E-ticket modal
│   │   │   ├── common/          # TopBar, Header, Footer, Toast notifications
│   │   │   ├── flights/         # Flight cards, details modal & filter sidebar
│   │   │   ├── hotels/          # Hotel cards & filter sidebar
│   │   │   ├── search/          # Tabbed search widgets (Flights, Hotels, Bus, Train)
│   │   │   └── trains/          # Train schedule cards & class selector
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  # User state, profile, and auth triggers
│   │   │   └── BookingContext.jsx # Bookings store, checkout & cancellations
│   │   ├── data/                # Airports, airlines, hotels, buses, trains & site data
│   │   ├── pages/               # All application route views
│   │   ├── App.css              # ExploreEase design system & responsive styling
│   │   ├── index.css            # Typography & design tokens
│   │   ├── App.jsx              # Routes & provider assembly
│   │   └── main.jsx             # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                      # Express.js REST API backend
│   └── index.js                 # API endpoints & static build serving
├── package.json                 # Root script runner & dependencies
├── .gitignore
└── README.md
```

---

## ⚙️ Installation & Local Setup

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

### 1. Clone the repository
```bash
git clone https://github.com/logicbyroshan/eazetrip.git
cd eazetrip
```

### 2. Install Dependencies
Install root, client, and server dependencies:
```bash
npm install
cd client && npm install
cd ..
```

### 3. Run Locally in Development Mode
You can start both the backend API server and the frontend client concurrently:
```bash
npm run dev
```

Or run them individually:
* **Start Express Backend Server (Port 5001):**
  ```bash
  npm run server
  ```
* **Start Vite Frontend Client (Port 4174):**
  ```bash
  cd client
  npm run dev -- --port 4174
  ```

Visit `http://localhost:4174/` in your browser.

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/flights` | Retrieve flights with optional `from` and `to` filters |
| `GET` | `/api/hotels` | Retrieve hotels with optional `city` filter |
| `GET` | `/api/buses` | Retrieve bus routes with optional `from` and `to` filters |
| `GET` | `/api/railways` | Retrieve train schedules with optional `from` and `to` filters |
| `GET` | `/api/offers` | Retrieve all active promo offers & discount codes |
| `GET` | `/api/bookings` | List all booked itineraries |
| `POST` | `/api/bookings` | Create and confirm a new booking |
| `POST` | `/api/bookings/:id/cancel` | Cancel an existing booking and initiate refund |
| `POST` | `/api/auth/login` | User authentication (phone/email) |
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/payment` | Process standalone invoice payment |
| `POST` | `/api/contact` | Submit customer support inquiry |

---

## 📄 License & Attribution

This project is built and maintained by **[logicbyroshan](https://github.com/logicbyroshan)**.
Inspired by ExploreEaz for high-performance travel aggregation and seamless booking workflows.
