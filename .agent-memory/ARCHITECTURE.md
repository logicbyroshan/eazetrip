# System Architecture: EazeTrip

## 1. High-Level Architecture Diagram

```
+-----------------------------------------------------------------------+
|                             CLIENT SPA                                |
|                        (React 19 + Vite 8)                           |
|                                                                       |
|  +---------------------+  +---------------------+  +---------------+  |
|  |     AuthContext     |  |   BookingContext    |  |  Lenis Scroll |  |
|  +---------------------+  +---------------------+  +---------------+  |
|                                                                       |
|  Pages (20+):                                                         |
|  - Home, Flights, Hotels, Buses, Railways, Holidays                   |
|  - ReviewBookingPage (/review-booking)                                |
|  - BookingPaymentPage (/booking-payment)                              |
|  - ManageBookingsPage, ProfilePage, PaymentPage, AuthPage, etc.       |
+------------------------------------+----------------------------------+
                                     |
                                     | HTTP REST API (/api/*)
                                     v
+------------------------------------+----------------------------------+
|                            EXPRESS SERVER                             |
|                        (Node.js + Express 4)                          |
|                                                                       |
|  Middleware Pipeline:                                                 |
|  [Security Headers] -> [CORS] -> [JSON Limit] -> [Sanitize Input]    |
|  -> [Rate Limiter (120/min general, 20/min sensitive)]                |
|  -> [Validation Schemas (validateBooking, validateLogin, etc.)]       |
|                                                                       |
|  Controllers & Endpoints:                                             |
|  - /api/health                                                        |
|  - /api/flights, /api/hotels, /api/buses, /api/railways, /api/holidays|
|  - /api/bookings (GET, POST, POST /:id/cancel)                        |
|  - /api/auth (login, register, profile)                               |
|  - /api/payment (razorpay-key, create-order, verify, webhook)         |
|                                                                       |
|  Data & Services:                                                     |
|  - mockStore.js (In-Memory Database)                                  |
|  - Razorpay SDK / Smart Simulation Engine                             |
+-----------------------------------------------------------------------+
```

---

## 2. Request / Response Lifecycle

1. **Client Request**: Initiated via `client/src/services/api.js`.
2. **Security Headers**: `securityHeaders` middleware applies strict OWASP headers.
3. **Deep Sanitization**: `sanitizeInput` recursively strips null bytes and protects against `__proto__` prototype pollution.
4. **Rate Limiting**: Enforced via in-memory sliding window limiter with auto-pruning.
5. **Schema Validation**: Validates payload shape, data types, and bounds before hitting business logic.
6. **Data Processing**: State stored in memory (`mockStore.js` and `bookings` array).
7. **Response Formatting**: Standardized JSON format `{ success: true, data: ..., message: ... }`.

---

## 3. Data Models & Schemas

### Booking Object
```json
{
  "id": "EZ-FL-74892",
  "type": "flight",
  "title": "Mumbai (BOM) -> New Delhi (DEL)",
  "pnr": "6EZ9KM",
  "date": "2026-10-15",
  "totalAmount": 5397,
  "status": "Confirmed",
  "paymentStatus": "Paid",
  "passengers": [
    {
      "name": "Mr Rahul Sharma",
      "gender": "Male",
      "dob": "1994-05-15",
      "seat": "12A",
      "isPrimary": true
    }
  ],
  "contact": {
    "email": "traveler@eazetrip.com",
    "phone": "9876543210",
    "gst": null
  },
  "pricing": {
    "basePrice": 4999,
    "taxes": 749,
    "insuranceCost": 149,
    "discount": 500,
    "coupon": "EAZETRIP",
    "grandTotal": 5397
  }
}
```

### User Object
```json
{
  "id": "USR-104928",
  "name": "Rahul Sharma",
  "email": "rahul@eazetrip.com",
  "phone": "+91 9876543210",
  "tier": "Gold Explorer",
  "token": "64_char_crypto_hex_token"
}
```
