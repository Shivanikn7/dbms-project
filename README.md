# 🏨 Insight-Driven Hotel Management System

Repeated Customer Identification & Personalized Engagement

---

## Project Overview

This repository is a demo/prototype for an Insight-Driven Hotel Management System that helps hotels identify repeat/loyal guests and deliver personalized engagement. It contains:

- A static frontend (HTML/CSS/JavaScript) demonstrating guest signup/login and demo UI pages.
- A backend service located in `hotel-management-backend` which provides APIs for guest and booking data used by the analytics and personalization features.

The intent is to provide a small end-to-end demo showing how guest data can be collected, analyzed to identify repeat customers, and used to personalize offers.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quickstart — Run Locally](#quickstart---run-locally)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [How Repeat-Guest Identification Works (Overview)](#how-repeat-guest-identification-works-overview)
- [API & Data (Where to look)](#api--data-where-to-look)
- [Development Tips](#development-tips)
- [Screenshots / Demo Pages](#screenshots--demo-pages)
- [Contributing](#contributing)
- [License & Contact](#license--contact)

---

## Features

- Identify repeat guests from booking and guest records (analytics module).
- Frontend demo pages for guest signup and login flows.
- Static UI pages to showcase personalized offers / guest experience.
- Backend APIs for guest and booking CRUD and analytics.
- Easy-to-run demo with static frontend and a simple backend.

---

## Tech Stack

- Frontend: HTML, CSS, JavaScript (vanilla)
  - Files at repo root: `guest-signup.html`, `guest-login.html`, `flash.html`, `guest-signup.js`, `guest-login.js`, `venome.js`, `thor.css`
- Backend: located in `hotel-management-backend` (likely Node.js/Express based on common patterns — please check `hotel-management-backend/package.json` for exact details)
- Database: Backend may use a lightweight DB (SQLite) or a server DB (MongoDB / MySQL). Check backend configuration files to confirm.

---

## Prerequisites

- Node.js (v14+ recommended) and npm/yarn (if backend is Node-based)
- A browser to open the static frontend files
- Database (if the backend requires one) — see backend README or config

---

## Quickstart — Run Locally

Note: The repo is split into a static frontend (root) and a backend in `hotel-management-backend`. Follow these steps:

### Backend

1. Open a terminal and change into the backend folder:
   - cd hotel-management-backend

2. Install dependencies:
   - npm install
   - or
   - yarn install

3. Configure environment variables (if required):
   - Look for `.env.example`, `config.js`, or documentation inside `hotel-management-backend`.
   - Typical env vars: PORT, DATABASE_URL, JWT_SECRET, etc.

4. Start the server:
   - npm start
   - or
   - node index.js
   - or (for development)
   - npx nodemon index.js

5. Confirm the server is running by visiting:
   - http://localhost:<PORT> (check the backend console for the port)

If the backend uses a database, make sure the DB server is running or a local DB file is available as configured.

### Frontend

The frontend in this repository is static; you can open the demo pages directly in your browser:

- Open `guest-signup.html` — demo signup flow
- Open `guest-login.html` — demo login flow
- `flash.html` — demo personalized UI / offer page

For a more realistic test, run a simple static file server in the repo root:

- With Python 3:
  - python -m http.server 8000
  - Then visit http://localhost:8000/guest-signup.html

- Or use an npm static server:
  - npx serve .

If you want the frontend to call the backend APIs, ensure the backend is running and update the API base URL in `guest-signup.js` / `guest-login.js` to point at the backend host/port.

---

## How Repeat-Guest Identification Works (Overview)

This demo aims to identify repeat guests and enable personalized engagement. Typical approaches implemented in such a system:

- Basic matching:
  - Use stable identifiers such as email address, phone number, or loyalty ID.
  - Aggregate bookings by those identifiers and count visits/bookings.
- Fuzzy matching:
  - For messy data, use normalized names, emails, or phone numbers and fuzzy string matching to detect duplicates.
- Scoring:
  - Compute a loyalty score based on number of stays, total spend, recency, and booking frequency.
- Simple SQL / aggregation example:
  - SELECT guest_id, COUNT(*) AS visits FROM bookings GROUP BY guest_id HAVING visits > 1;

Check the analytics module or backend routes to see how repeat detection and scoring are actually implemented in this project.

---

## API & Data (Where to look)

The repository contains a backend folder with API code. To find routes and API endpoints:

- Inspect `hotel-management-backend/` for files like:
  - package.json (for scripts and dependencies)
  - index.js / server.js / app.js (server entrypoint)
  - routes/ or controllers/ (API endpoints)
  - models/ or db/ (data schema / database access)

Common endpoints you might find or add:
- POST /api/guests — create a guest
- GET /api/guests/:id — fetch guest
- POST /api/bookings — create a booking
- GET /api/analytics/repeat-guests — analytics for repeat guests

Always check the backend source to confirm the exact endpoints and expected request/response shapes.

---

## Development Tips

- Run the backend in watch mode (nodemon) while editing.
- Use Postman or curl to test API endpoints.
- Add CORS support in the backend if you serve the frontend from a different origin during development.
- Add unit tests for analytics logic (repeat detection, scoring) to ensure correctness with sample datasets.
- If you add a real DB, include migrations or seed scripts for reproducible demos.

---

## Screenshots / Demo Pages

Screenshots and demo images (if any) are in the `screenshots/` folder. Use them for README embeds or presentation. The static HTML files demonstrate the basic user flows — open them to preview screens quickly.

---

## Contributing

Contributions are welcome! A suggested workflow:

1. Fork the repo.
2. Create a branch for your feature or fix: git checkout -b feat/your-feature
3. Make changes and run the backend/frontend locally to verify.
4. Commit and open a PR describing your changes.

Ideas for improvement:
- Add tests for analytics code.
- Add real persistence with migrations and seed data.
- Improve the repeat-guest detection algorithm (fuzzy matching, dedup rules).
- Add a small admin UI to view guest analytics and offers.

---

## Troubleshooting

- Backend fails to start: Check node version, dependencies, and environment variables.
- Frontend cannot reach backend: Verify the API base URL and CORS configuration.
- Database errors: Confirm DB connection string and whether the DB server is running or a local file is accessible.

---

## License

This project does not include a license file by default. If you want to open-source the project, add a LICENSE (MIT, Apache-2.0, etc.) to the repository.

---

## Contact

Author: Shivanikn7

If you want, I can:
- Create a polished README.md in the repository and open a PR.
- Inspect `hotel-management-backend` and generate API docs / example requests.
- Add a CONTRIBUTING.md or a LICENSE file.

Tell me which of the above you'd like me to do next and I can prepare the files and a PR.


