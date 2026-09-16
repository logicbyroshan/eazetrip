# Architecture Decision Records (ADR): EazeTrip

This file documents critical architectural and engineering decisions made in this repository.

---

## ADR-001: Dedicated Multi-Step Booking & Payment Pages over Modal Checkouts
* **Date**: 2026-09-15
* **Decision**: Transition the booking workflow from inline/popup modals to dedicated multi-step URL pages (`/review-booking` and `/booking-payment`).
* **Context**: Complex multi-passenger details, GST invoicing, coupon application, and multi-gateway payments felt cramped in small popup modals.
* **Consequences**: Greatly improved user clarity and checkout conversion; allows shareable/navigable URLs and browser back/forward history support.

---

## ADR-002: Smart Simulation Mode for Razorpay Gateway
* **Date**: 2026-09-14
* **Decision**: Implement a fallback Smart Simulation Mode inside both the backend (`server/index.js`) and frontend (`client/src/services/razorpay.js`).
* **Context**: Development environments and sandbox testing may lack live merchant Razorpay API keys.
* **Consequences**: Developers and reviewers can complete the entire end-to-end checkout flow and receive instant E-Tickets without crashing or requiring external API credentials.

---

## ADR-003: Native Node Test Runner (`node:test`)
* **Date**: 2026-09-15
* **Decision**: Use Node.js built-in `node:test` and `node:assert` instead of Jest or Mocha.
* **Context**: Zero external testing dependencies required; lightning-fast execution (<500ms) with native async/await support.
* **Consequences**: Zero dependency overhead, high portability, and direct compatibility with standard Node 18+ and 20+ environments.

---

## ADR-004: Anti-Scroll Trapping with `overflow-x: clip`
* **Date**: 2026-09-15
* **Decision**: Replace `overflow-x: hidden` with `overflow-x: clip` on `html` and `body`.
* **Context**: In Chromium and Gecko browsers, `overflow-x: hidden` creates a separate scroll container context that disables CSS `position: sticky` on vertical child elements.
* **Consequences**: Prevents horizontal overflow while preserving smooth native and Lenis sticky tracking for sidebars.
