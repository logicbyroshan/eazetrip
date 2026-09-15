# Contributing to ExploreEase (EazeTrip)

We welcome contributions from the developer community! To maintain a production-grade standard of reliability, security, and aesthetics, please adhere to these guidelines.

---

## 1. Development Workflow

1. **Fork and Clone** the repository:
   ```bash
   git clone https://github.com/logicbyroshan/eazetrip.git
   ```
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Install Dependencies**:
   ```bash
   npm install && cd client && npm install && cd ..
   ```
4. **Make Your Changes**:
   - Write clean, well-commented code.
   - Maintain the Vanilla CSS design system in `client/src/App.css` (avoid adding heavy UI utility frameworks).
   - Ensure all modal components implement `Escape` key listeners and aria labels.
   - Maintain defensive security practices (input validation, rate limiting).
5. **Run the Test Suite**:
   ```bash
   npm test
   ```
6. **Verify Frontend Build**:
   ```bash
   cd client && npm run build && cd ..
   ```
7. **Submit a Pull Request** with a detailed summary of changes and testing steps.

---

## 2. Coding Standards

- **JavaScript/React:** Modern ES modules (`import`/`export`), React functional components with hooks.
- **Backend:** Express middleware architecture, clear error boundaries, standard HTTP status codes (`200`, `201`, `400`, `404`, `429`, `500`).
- **Security:** Always sanitize user input, avoid storing unencrypted sensitive credentials, enforce rate limits on sensitive endpoints.
