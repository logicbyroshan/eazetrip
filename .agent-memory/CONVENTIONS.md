# Codebase Conventions: EazeTrip

## 1. Naming Conventions

* **React Components & Pages**: PascalCase (`ReviewBookingPage.jsx`, `HolidayCard.jsx`, `TopBar.jsx`).
* **Hooks & Contexts**: CamelCase starting with `use` or PascalCase for providers (`useBooking`, `BookingProvider`).
* **Utility & Data Files**: CamelCase (`api.js`, `razorpay.js`, `flightData.js`).
* **CSS Classes**: Kebab-case with semantic structure (`review-card-section`, `sticky-fare-summary-card`, `back-breadcrumb-link`).
* **PNR Generation**: 2 uppercase letters + 4 alphanumeric digits (`EZ9482`, `6EZ9KM`).
* **Booking IDs**: Format `EZ-{TYPE}-{5_DIGITS}` (e.g. `EZ-FL-74892`, `EZ-HT-58210`, `EZ-BS-39144`, `EZ-TR-29401`, `EZ-HL-48201`).

---

## 2. Directory Structure Conventions

* `client/src/components/{domain}/`: Components grouped by domain (`flights/`, `hotels/`, `buses/`, `trains/`, `holidays/`, `checkout/`, `auth/`, `common/`).
* `client/src/pages/`: Flat structure containing route-level page components.
* `client/src/context/`: Domain-specific React Contexts.
* `server/middleware/`: Express middleware divided by responsibility (`security.js`, `validation.js`, `errorHandler.js`).

---

## 3. Styling & CSS Rules

1. **Global Tokens**: Stored in `client/src/index.css` under `:root`.
2. **Typography Hierarchy**:
   - `font-family: 'Outfit', sans-serif;` for headlines, prices, code badges, and CTAs.
   - `font-family: 'Plus Jakarta Sans', sans-serif;` for body copy, form labels, and descriptions.
3. **No Horizontal Scroll Trap**: Always use `overflow-x: clip;` on `body` and `html` to prevent breaking CSS `position: sticky`.
4. **Sidebar Stickiness**: Sticky columns must declare:
   ```css
   position: sticky;
   top: 90px;
   height: fit-content;
   align-self: start;
   ```
5. **Flex Alignment**: Always use explicit flex rows for card headers (`display: flex; flex-direction: row; align-items: center; gap: 16px;`).

---

## 4. Testing Conventions

* Use native Node.js test runner (`node --test tests/server.test.js`).
* Tests spin up an ephemeral HTTP server on random port `0`.
* Every endpoint must test both the success path and invalid/missing parameter failure paths (e.g., 400 Bad Request, 404 Not Found, 409 Conflict).

---

## 5. Git Branching & GitHub PR Workflow Conventions

1. **Branch Naming**:
   - `feature/{domain}-{short-description}` (e.g., `feature/holiday-booking`, `feature/razorpay-live`)
   - `fix/{domain}-{issue}` (e.g., `fix/sticky-sidebar`, `fix/header-alignment`)
   - `refactor/{component}` (e.g., `refactor/review-page`)
2. **Pull Request Lifecycle**:
   - Create branch from `main`: `git checkout -b <branch-name>`
   - Verify: `npm test` & `npm run build`
   - Commit & push: `git push -u origin <branch-name>`
   - Create PR: `gh pr create --base main --head <branch-name> --title "..." --body "..."`
   - Merge PR: `gh pr merge <branch-name> --merge --auto` (or `--admin` when required)
   - Sync main: `git checkout main ; git pull origin main`
