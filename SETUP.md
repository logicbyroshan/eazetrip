# ExploreEase (EazeTrip) Setup & Deployment Guide

This guide explains how to install, configure, develop, test, and deploy ExploreEase across local and production environments.

---

## Prerequisites

- **Node.js**: `v18.0.0` or higher (recommended: `v20+` or `v24+`)
- **npm**: `v9.0.0` or higher
- **Git**: For version control

---

## 1. Quick Local Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/logicbyroshan/eazetrip.git
cd eazetrip
```

### Step 2: Install Dependencies
Install dependencies for both root, client, and server:
```bash
npm install
cd client && npm install && cd ..
```

### Step 3: Configure Environment Variables
Copy the example configuration:
```bash
cp .env.example .env
```

#### Configuring Google OAuth 2.0 / Sign-In:
1. Navigate to the [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
2. Click **Create Credentials** -> **OAuth client ID**.
3. Select Application type: **Web application**.
4. Add **Authorized JavaScript origins**:
   - `http://localhost:4174`
   - `http://localhost:5173`
   - `http://127.0.0.1:4174`
5. Paste your credentials into `.env`:
   ```env
   GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
   ```
*(Note: If left empty or placeholder, EazeTrip automatically operates in seamless sandbox simulation mode).*

#### Configuring Razorpay Gateway:
1. Retrieve API keys from [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys).
2. Paste `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` into `.env`.

### Step 4: Start the Applications

You can run both client and server simultaneously, or in separate terminal sessions:

**Option A — Running in separate terminals:**
- Terminal 1 (Backend):
  ```bash
  npm run server
  ```
- Terminal 2 (Frontend):
  ```bash
  npm run client
  ```

**Option B — Root shortcut:**
```bash
npm run dev
```

---

## 2. Running Automated Tests

Run the backend integration and security test suite using Node.js's native test runner:
```bash
npm test
```

Expected output:
```
✔ 1. Security Headers are present on API responses
✔ 2. GET /api/health returns operational status
✔ 3. GET /api/flights returns list and supports route query filters
✔ 4. GET /api/flights/:id returns single flight details or 404
✔ 5. GET /api/hotels returns list and supports city filter
✔ 6. GET /api/buses returns intercity bus operators
✔ 7. GET /api/railways returns train schedules
✔ 8. POST /api/auth/register validates email and password length
✔ 9. POST /api/auth/login validates credentials format
✔ 10. POST /api/bookings creates booking and POST /api/bookings/:id/cancel cancels it
✔ 11. POST /api/payment validates amount and returns payment record
✔ 12. POST /api/contact validates inputs and confirms submission
ℹ tests 12 | pass 12 | fail 0
```

---

## 3. Production Build & Deployment

### Step 1: Build the Frontend
```bash
cd client
npm run build
```
This produces an optimized, minified bundle in `client/dist/`.

### Step 2: Production Server Execution
Set `NODE_ENV=production` and start the server:
```bash
NODE_ENV=production PORT=5001 node server/index.js
```

---

## 4. Health Check

Verify production deployment health by pinging:
```bash
curl http://localhost:5001/api/health
```
