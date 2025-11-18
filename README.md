# BookMyShow - Fullstack (Plain HTML/CSS/JS)

This repository is a minimal full-stack implementation of a simple BookMyShow-style
movie booking app. It's packaged as a zip containing:

- `frontend/` — Plain HTML, CSS, and JavaScript (runs on any static server).
- `backend/` — Node.js + Express backend with Mongoose schema (listens on port 8080).

**Features**
- Select movie, time slot, and seat counts (A1,A2,A3,A4,D1,D2).
- Selections persist in `localStorage`.
- `POST /api/booking` stores booking in MongoDB and returns `200`.
- `GET /api/booking` returns the last booking (or `{ message: "no previous booking found" }`).
- UI styling matches the provided screenshot: selectable cards, red selection highlight, right-side "Last Booking Details".

---
## How to run locally

### Requirements
- Node.js (16+ recommended)
- npm
- MongoDB running locally on default port (27017)

### Backend
1. Open a terminal and go to `backend/`
2. Run `npm install`
3. Start MongoDB (e.g. `mongod`)
4. Run `npm start` — server listens on `http://localhost:8080`

### Frontend
The frontend is plain HTML/CSS/JS and can be opened directly in a browser.
For proxying fetch requests to backend during development, you can run a simple static server.

Example with `npx serve`:
1. Install `serve` if needed: `npm i -g serve`
2. From `frontend/` run `serve -l 3000` — then open `http://localhost:3000`

Alternatively open `frontend/index.html` directly in your browser — but some browsers block fetch from file://. Use `serve` or any static server.

---
## Files included
- backend/connection.js
- backend/Schema.js
- backend/server.js
- backend/package.json
- frontend/index.html
- frontend/css/style.css
- frontend/js/app.js
- frontend/js/data.js

---
If you want, I can:
- Add a zip with `docker-compose` to run MongoDB / backend / frontend with one command.
- Convert frontend to a React app.
