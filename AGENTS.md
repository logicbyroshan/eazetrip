# AGENTS.md — Agent Operating Manual for EazeTrip

This document is the **primary instruction manual and operational constitution** for all AI agents working on the **EazeTrip** repository.

---

## 1. Project Overview

* **Project Name**: EazeTrip (Full-Stack Multi-Modal Travel Booking & E-Commerce Platform)
* **Repository**: `logicbyroshan/eazetrip`
* **Core Domains**: Flights, Hotels, Intercity Buses, Indian Railways (IRCTC integration), and Holiday Tour Packages.
* **Architecture**: Decoupled Monorepo (Node.js Express REST Backend + React 19 / Vite Frontend SPA).
* **Payment Stack**: Native Razorpay SDK + Smart Simulation Mode fallback + UPI QR / Card / NetBanking support.
* **Test Suite**: Native Node.js test runner (`node:test` + `node:assert`), 35 comprehensive automated tests passing.

---

## 2. Architecture & File Structure

```text
eazetrip/
├── .agent-memory/                 # Persistent Agent Operating System & Project Memory
├── AGENTS.md                      # Primary instruction manual for AI agents
├── CHANGELOG.md                   # Human-readable chronological history of changes
├── ABOUT.md / API.md / SECURITY.md# Public documentation
├── package.json                   # Root orchestrator scripts (concurrently dev runner)
├── server/                        # Express 4 Backend REST API
│   ├── data/
│   │   └── mockStore.js           # In-memory data store for travel listings & demo bookings
│   ├── middleware/
│   │   ├── errorHandler.js        # Centralized error logging & 404 handler
│   │   ├── security.js            # Rate limiter, security headers, prototype pollution sanitizer
│   │   └── validation.js          # Input validation schemas for auth, booking, payment, contact
│   └── index.js                   # Main Express application entry & route definitions
├── client/                        # React 19 + Vite 8 Single Page Application
│   ├── index.html                 # HTML shell with Google Fonts preloads
│   ├── vite.config.js             # Vite bundler configuration (Lucide + React plugins)
│   ├── package.json               # Client dependencies (React 19, Lucide, Lenis)
│   └── src/
│       ├── App.jsx                # React Router v7 routes & global overlays
│       ├── App.css                # Curated luxury design system & component styles
│       ├── index.css              # Global reset, typography tokens, Lenis scroll config
│       ├── main.jsx               # React DOM root entry
│       ├── components/            # Modular UI components (auth, search, booking, checkout)
│       ├── context/               # Global state (AuthContext, BookingContext)
│       ├── data/                  # Static mock catalogs (flights, hotels, buses, trains, holidays)
│       ├── pages/                 # Full-page routes (20 distinct interactive pages)
│       └── services/              # API abstraction (`api.js`) and payment gateway (`razorpay.js`)
└── tests/
    └── server.test.js             # 35 automated security, API, and booking lifecycle tests
```

---

## 3. Development, Build & Test Commands

All commands can be run from the root directory:

* **Start Full-Stack Development Server**:
  ```powershell
  npm run dev
  ```
  *(Starts backend at `http://localhost:5001` and Vite frontend at `http://localhost:4174` concurrently)*

* **Run Backend Unit & Security Tests**:
  ```powershell
  npm test
  ```
  *(Executes all 35 tests in `tests/server.test.js` using `node:test`)*

* **Build Production Frontend Bundle**:
  ```powershell
  npm run build
  ```
  *(Runs `vite build` in `client/` outputting to `client/dist/`)*

* **Start Standalone Backend Server**:
  ```powershell
  npm run server
  ```

* **Start Standalone Frontend Server**:
  ```powershell
  npm run client
  ```

---

## 4. Code & Styling Conventions

### JavaScript / JSX
1. **ES Modules in Client**: Use `import/export` syntax in `client/`.
2. **CommonJS in Server**: Use `require/module.exports` syntax in `server/` and `tests/`.
3. **No Unused Imports**: Always keep imports clean; use Lucide-React icons.
4. **State Persistence**: 
   - Bookings are stored in `localStorage` (`eazetrip_bookings`) with backend API synchronization.
   - Active draft checkout is stored in `sessionStorage` (`eazetrip_active_booking`, `eazetrip_booking_draft`).
   - Auth tokens and user profile stored in `localStorage` (`eazetrip_user`, `eazetrip_token`).

### Styling & CSS Tokens
1. **Curated Luxury Palette**: Primary `#034ea2`, Navy `#0a192f`, Emerald `#10b981`, Sky `#0077b6`, Amber `#ea580c`.
2. **Typography**: Headings use `'Outfit', sans-serif`; body text uses `'Plus Jakarta Sans', sans-serif`.
3. **Responsive Grid**: Dedicated multi-step booking uses 2-column grid (`1fr 390px` desktop, single column on tablet/mobile).
4. **Sticky Sidebar Rule**: Right-side fare summary sidebars must have `position: sticky; top: 90px; height: fit-content; align-self: start;`.
5. **No `overflow-x: hidden` on body/html**: Use `overflow-x: clip;` so native and Lenis sticky tracking functions properly across all browsers.

---

## 5. Security Rules

1. **No Raw Secrets in Git**: Never commit live API keys, Razorpay secret keys, or database credentials.
2. **Input Sanitization**: All incoming requests in Express are recursively sanitized (`sanitizeInput`) against null-byte injection and prototype pollution.
3. **Timing-Safe Cryptography**: Webhook signatures and payment HMACs must use `crypto.timingSafeEqual`.
4. **Rate Limiting**: Public API routes are limited to 120 req/min; sensitive auth/payment routes to 20 req/min.
5. **Security Headers**: All API responses must carry OWASP security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection: 1; mode=block`).

---

## 6. Token Efficiency & Agent Workflow

To maintain speed and avoid context window exhaustion:

1. **Read `AGENTS.md` first** before starting any new task.
2. **Consult `.agent-memory/`** (`PROJECT.md`, `CURRENT_STATE.md`, `KNOWN_ISSUES.md`) to get current project context without rereading the whole repo.
3. **Inspect only targeted files** required for the specific user request.
4. **Run `npm test` and `npm run build`** after modifications to ensure zero regressions.
5. **Update `.agent-memory/` and `CHANGELOG.md`** after completing any meaningful feature, fix, or refactor.

---

---

## 7. Git Branching & GitHub PR Workflow Rule (Mandatory)

Every new modification, feature, bugfix, or refactoring task **MUST** follow this structured branch-and-PR lifecycle:

1. **Create a Dedicated Branch**: Never push unreviewed direct commits to `main`. Create a descriptive branch from `main`:
   - Feature: `git checkout -b feature/short-description`
   - Bugfix: `git checkout -b fix/short-description` or `git checkout -b bug/short-description`
   - Refactor: `git checkout -b refactor/short-description`
2. **Verify Locally First**:
   - Run `npm test` (verify all 35 tests pass).
   - Run `npm run build` in `client/` (verify 0 build errors).
3. **Commit & Push to Remote**:
   ```powershell
   git add .
   git commit -m "feat(domain): descriptive commit message"
   git push -u origin <branch-name>
   ```
4. **Create & Merge Pull Request via `gh` CLI**:
   - Create PR:
     ```powershell
     gh pr create --base main --head <branch-name> --title "feat(domain): descriptive title" --body "Summary of verified changes..."
     ```
   - Merge PR into `main` safely:
     ```powershell
     gh pr merge <pr-number-or-branch> --merge --auto
     ```
     *(or `gh pr merge --admin --merge` if branch protection auto-checks require administrative bypass)*
   - Return to `main` and pull latest:
     ```powershell
     git checkout main ; git pull origin main
     ```

---

## 8. Things an Agent MUST DO

* ✅ Use a dedicated branch (`feature/...`, `fix/...`, `bug/...`) and merge via `gh` CLI PR for every change.
* ✅ Verify that both Vite build (`npm run build`) and test suite (`npm test`) pass before finishing.
* ✅ Maintain support for all 5 booking mediums (Flights, Hotels, Buses, Trains, Holidays).
* ✅ Keep both Razorpay live/test SDK integration and Smart Simulation fallback mode intact.
* ✅ Record meaningful changes in `CHANGELOG.md` and `.agent-memory/TASK_HISTORY.md`.
* ✅ Respect the **Minimal Change Principle**: change only what is necessary to fulfill the request.

---

## 9. Things an Agent MUST NOT DO

* ❌ **DO NOT** make direct unverified commits to `main` without creating a PR branch.
* ❌ **DO NOT** rewrite working systems from scratch or change library architecture without explicit instruction.
* ❌ **DO NOT** delete, rename, or break existing API endpoints or booking state schemas.
* ❌ **DO NOT** commit live credentials or mock data with real personal info.
* ❌ **DO NOT** make silent architectural decisions without recording them in `.agent-memory/DECISIONS.md`.
* ❌ **DO NOT** add heavy external dependencies when existing lightweight utilities suffice.
