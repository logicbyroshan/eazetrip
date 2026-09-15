# About ExploreEase (EazeTrip)

ExploreEase is a unified, high-performance travel booking and reservation platform built with modern web technologies.

---

## 1. Mission & Vision

Our goal is to deliver an ultra-fast, visually stunning, accessible, and reliable travel reservation platform for:
- **Domestic & International Flights**
- **Luxury & Budget Hotels & Resorts**
- **Intercity Luxury & Sleeper Buses**
- **Indian Railways (IRCTC) Schedules & Bookings**

ExploreEase strips away unnecessary clutter (unneeded cruises, recharge portals, holiday bloat) to provide a streamlined, high-converting booking experience with instant e-ticket generation and seamless booking management.

---

## 2. Core Pillars

| Pillar | Implementation |
| :--- | :--- |
| **Visual Excellence** | Clean white & deep navy palette, vibrant orange/amber accents, modern typography, micro-interactions, responsive CSS design system. |
| **Resilient Architecture** | Dual-mode state management: Live REST API with built-in fallback resilience so users never experience downtime. |
| **Security & Privacy** | Defensive HTTP headers (`X-Content-Type-Options`, `X-Frame-Options`), isolated rate limiters, sanitized inputs, zero credential leakage. |
| **User Experience** | Keyboard accessibility (ESC dismissals, label bindings), instant confirmation vouchers, barcode / QR code rendering on e-tickets. |

---

## 3. Technology Stack

- **Frontend:** React 19, Vite 8, Lucide Icons, Vanilla CSS Design System.
- **Backend:** Node.js (v24), Express.js.
- **Testing:** Node.js Native Test Runner (`node:test`, `node:assert`).
- **Data & Storage:** Structured in-memory store + LocalStorage persistence.
