# Known Issues & Technical Debt: EazeTrip

This file tracks active and resolved technical debt, potential gotchas, and architectural considerations.

---

## 1. Active Considerations & Technical Debt

### KD-001: In-Memory Server State Persistence
* **Category**: Architecture / Data Persistence
* **Description**: Backend bookings and users are currently stored in memory (`server/data/mockStore.js` and in-memory arrays). Server restarts reset newly generated server-side state.
* **Mitigation**: Client persists user bookings in `localStorage` (`eazetrip_bookings`), ensuring seamless user experience even across server restarts.
* **Future Recommendation**: Connect MongoDB / PostgreSQL or SQLite for persistent production storage.

### KD-002: Vite Chunk Size Notice
* **Category**: Build Optimization
* **Description**: Vite build issues a warning that chunks exceed 500 kB after minification due to Lucide icon sets and React DOM in a single bundle.
* **Mitigation**: Production build functions correctly and quickly (<600ms). Future optimizations can use dynamic `import()` for routes if needed.

---

## 2. Resolved Issues

### RESOLVED-001: Header Icon & Title Vertical Stacking on Review Page
* **Date Resolved**: 2026-09-15
* **Resolution**: Added `.review-card-header-left` and `.payment-card-header-left` with explicit `display: flex; flex-direction: row; align-items: center; gap: 16px;`.

### RESOLVED-002: Fare Summary Sidebar Scroll Stickiness
* **Date Resolved**: 2026-09-15
* **Resolution**: Replaced `overflow-x: hidden` with `overflow-x: clip` in `index.css` and added `position: sticky; top: 90px; height: fit-content; align-self: start;` to `.review-right-col` and `.payment-right-col`.

### RESOLVED-003: Redundant Parallel White Top Bar
* **Date Resolved**: 2026-09-15
* **Resolution**: Removed `.booking-top-strip` and `.payment-top-strip` and integrated the back breadcrumb button directly inside the page container above the step tracker.

### RESOLVED-004: Contact Info Header Colliding & Coupon Bar Height
* **Date Resolved**: 2026-09-15
* **Resolution**: Added `.sub-section-title` flex alignment with margin spacing, increased coupon bar height to 52px, and harmonized Fare Summary vertical spacing.
