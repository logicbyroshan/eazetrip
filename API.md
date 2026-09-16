# ExploreEase (EazeTrip) API Documentation

ExploreEase exposes a RESTful JSON API powered by Express.js with built-in validation, security headers, rate limiting, and structured error responses.

Base URL: `http://localhost:5001/api`

---

## 1. System & Health

### `GET /api/health`
Checks server health, uptime, and current runtime environment.

- **Auth Required:** No
- **Rate Limit:** 120 req/min
- **Response `200 OK`:**
  ```json
  {
    "status": "healthy",
    "uptime": 128.45,
    "timestamp": "2026-09-15T10:55:00.000Z",
    "environment": "development"
  }
  ```

---

## 2. Authentication & User Management

### `POST /api/auth/register`
Creates a new user profile.

- **Auth Required:** No
- **Rate Limit:** 20 req/min
- **Request Body:**
  ```json
  {
    "name": "Priyansh Sharma",
    "email": "priyansh@example.com",
    "phone": "9876543210",
    "password": "strongPassword123"
  }
  ```
- **Validation Rules:**
  - `email`: Valid RFC email format.
  - `password`: Minimum 6 characters.
  - `name`: String, trimmed.
- **Response `201 Created`:**
  ```json
  {
    "success": true,
    "message": "Account created successfully.",
    "data": {
      "id": "USR-1789469998863",
      "name": "Priyansh Sharma",
      "email": "priyansh@example.com",
      "phone": "9876543210",
      "createdAt": "2026-09-15T10:55:00.000Z"
    }
  }
  ```

### `POST /api/auth/login`
Authenticates a user via email or phone.

- **Auth Required:** No
- **Rate Limit:** 20 req/min
- **Request Body:**
  ```json
  {
    "identifier": "priyansh@example.com",
    "method": "email",
    "password": "strongPassword123"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "token": "ez_jwt_a1b2c3d4e5...",
    "data": {
      "id": "USR-1",
      "name": "Explore User",
      "email": "priyansh@example.com",
      "phone": "9876543210"
    }
  }
  ```

### `GET /api/auth/google-client-id`
Returns public Google OAuth 2.0 Client ID and configuration state for frontend GIS SDK.

- **Auth Required:** No
- **Rate Limit:** 120 req/min
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "configured": true,
    "clientId": "your_client_id.apps.googleusercontent.com",
    "mode": "live"
  }
  ```

### `POST /api/auth/google`
Authenticates a traveler using Google Identity Services (GIS) ID token or OAuth authorization code.

- **Auth Required:** No
- **Rate Limit:** 20 req/min
- **Request Body:**
  ```json
  {
    "credential": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...",
    "code": "optional_oauth_authorization_code"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "Google authentication successful",
    "mode": "live",
    "data": {
      "id": "USR-109283",
      "name": "Priyansh Sharma",
      "email": "priyansh.sharma@gmail.com",
      "avatar": "https://lh3.googleusercontent.com/a/...",
      "tier": "Gold Explorer",
      "authProvider": "Google",
      "token": "7a8b9c0d1e2f..."
    }
  }
  ```

### `PUT /api/auth/profile`
Updates traveler account information and saved details.

- **Auth Required:** Optional (matches by user ID or email)
- **Rate Limit:** 20 req/min
- **Request Body:**
  ```json
  {
    "id": "USR-1",
    "name": "Priyansh Sharma",
    "phone": "+91 9876543210",
    "city": "Bengaluru",
    "state": "Karnataka"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "Profile updated successfully",
    "data": {
      "id": "USR-1",
      "name": "Priyansh Sharma",
      "email": "priyansh@example.com",
      "phone": "+91 9876543210",
      "city": "Bengaluru",
      "state": "Karnataka",
      "tier": "Gold Explorer"
    }
  }
  ```

---

## 3. Flight Booking Services

### `GET /api/flights`
Fetches flights with optional query filters.

- **Query Parameters:**
  - `from` (string): Origin airport IATA code (e.g. `BOM`, `DEL`, `BLR`)
  - `to` (string): Destination airport IATA code (e.g. `DEL`, `GOI`)
  - `airline` (string): Filter by airline name (e.g. `IndiGo`, `Air India`, `Akasa Air`)
  - `maxPrice` (number): Maximum fare filter in INR
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "count": 4,
    "data": [
      {
        "id": "FL-601",
        "airline": "IndiGo",
        "flightNumber": "6E-512",
        "from": "BOM",
        "fromCity": "Mumbai",
        "to": "DEL",
        "toCity": "Delhi",
        "departureTime": "06:00 AM",
        "arrivalTime": "08:15 AM",
        "duration": "2h 15m",
        "stops": "Non-stop",
        "price": 4899,
        "seatsAvailable": 18
      }
    ]
  }
  ```

### `GET /api/flights/:id`
Retrieves full details for a specific flight.

- **Path Parameter:** `id` (e.g., `FL-601`)
- **Response `200 OK`:** Full flight object
- **Response `404 Not Found`:** If flight ID does not exist

---

## 4. Hotel Booking Services

### `GET /api/hotels`
Search and list available hotels.

- **Query Parameters:**
  - `city` (string): City name (e.g., `Goa`, `Mumbai`, `Delhi`, `Jaipur`)
  - `minRating` (number): Minimum guest review rating (e.g., `4.5`)
  - `maxPrice` (number): Maximum price per night
- **Response `200 OK`:** List of verified hotel properties.

### `GET /api/hotels/:id`
Retrieves detailed information for a single hotel.

---

## 5. Bus Booking Services

### `GET /api/buses`
Lists intercity luxury and sleeper buses.

- **Query Parameters:** `from`, `to`, `operator`
- **Response `200 OK`:** List of bus services.

---

## 6. Railway (IRCTC) Schedules

### `GET /api/railways`
Lists high-speed and express train schedules.

- **Query Parameters:** `from`, `to`
- **Response `200 OK`:** List of train schedules and class seat availability.

---

## 7. Bookings Management

### `GET /api/bookings`
Retrieves booking history with optional query filters.

- **Query Parameters:**
  - `userId` (string): Filter by user account ID
  - `email` (string): Filter by passenger or account email
  - `status` (string): `Confirmed` or `Cancelled`
  - `type` (string): `flight`, `hotel`, `bus`, or `train`
- **Response `200 OK`:** Array of booking records.

### `GET /api/bookings/:id`
Retrieves a specific booking by its ID or PNR.

- **Path Parameter:** `id` (e.g., `EZ-FL-74892`)
- **Response `200 OK`:** Full booking record
- **Response `404 Not Found`:** If booking does not exist

### `POST /api/bookings`
Creates a new booking record with unique PNR / Booking ID.

- **Request Body:**
  ```json
  {
    "type": "flight",
    "title": "Mumbai → Delhi Flight",
    "date": "2026-09-22",
    "totalAmount": 4999,
    "passengers": [
      { "name": "Priyansh Sharma", "seat": "14B" }
    ],
    "userId": "USR-1"
  }
  ```
- **Response `201 Created`:** Booking details with generated `id` (e.g., `EZ-FL-1789469998863`) and status `Confirmed`.

### `POST /api/bookings/:id/cancel`
Cancels an existing booking and initiates refund processing.

- **Request Body:**
  ```json
  {
    "reason": "Travel plan altered"
  }
  ```
- **Response `200 OK`:** Updated booking status `Cancelled` with refund processing metadata.

---

## 8. Payment Processing

### `POST /api/payment`
Simulates secure multi-channel payment gateway transactions (Cards, UPI, NetBanking, Wallets).

- **Rate Limit:** 20 req/min
- **Request Body:**
  ```json
  {
    "firstName": "Priyansh",
    "lastName": "Sharma",
    "email": "priyansh@example.com",
    "phone": "9876543210",
    "amount": 4999,
    "currency": "INR",
    "paymentMethod": "Credit Card",
    "bookingId": "EZ-FL-1789469998863"
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "success": true,
    "message": "Payment processed successfully.",
    "data": {
      "transactionId": "TXN-98421074",
      "status": "Success",
      "amount": 4999,
      "currency": "INR",
      "timestamp": "2026-09-15T10:55:00.000Z"
    }
  }
  ```

---

## 9. Offers & Support

- `GET /api/offers`: Lists live promotional discount coupon codes.
- `GET /api/faqs`: Retrieves categorized frequently asked questions.
- `POST /api/contact`: Submits a customer inquiry ticket.
