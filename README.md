# Document Management System (DMS)

This repository contains a simple Document Management System with a Node/Express backend and an Angular frontend.

## Contents

- `backend/` — Express API (MongoDB, file uploads)
- `frontend/` — Angular client

## Prerequisites

- Node.js and npm (Node >= 16 recommended)
- MongoDB Atlas or a running MongoDB instance
- (Optional) `ng` CLI to run frontend (`npm i -g @angular/cli`)

## Backend — Setup & Run

1. Open a terminal and go to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in `backend/` with the following variables:

```env
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<a-strong-secret>
# Optional: PORT=5000
```

4. Create the `uploads/` folder (backend expects this directory to exist):

```bash
mkdir uploads
```

5. Start the backend:

For development (auto-restart with changes):

```bash
npm run dev
```

Or in production mode:

```bash
npm start
```

The backend default port is `5000`. The server serves static files from `uploads/` at the `/uploads` path.

Environment variables used by backend:

- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret used for signing JWT tokens
- `PORT` — optional port the server will listen on (defaults to `5000`)

## Frontend — Setup & Run

1. Open a terminal and go to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the Angular dev server:

```bash
npm start
```

4. Open the app in a browser:

```
http://localhost:4200
```

Notes:

- The frontend currently points to `http://localhost:5000` for backend API calls (see `frontend/src/app/services/auth.service.ts` and `document.service.ts`). If you run the backend on a different host/port, update the base URLs in those service files or set up a proxy.

## Using the app

- Register a user via the frontend or calling the backend endpoint `POST /api/auth/register`.
- Login via the frontend or `POST /api/auth/login`. The backend returns a JWT token which the frontend stores in `localStorage`.
- Upload documents from the UI — files are stored in the backend `uploads/` folder and served at `http://<backend-host>:<port>/uploads/<filename>`.

## Important files

- Backend entry: `backend/server.js`
- Backend routes: `backend/routes/`
- Frontend services: `frontend/src/app/services/`

## Troubleshooting

- MongoDB connection errors: verify `MONGO_URI` and network/whitelist settings for Atlas.
- File upload errors: ensure `uploads/` exists and backend has permission to write files.
- CORS or token failures: check backend logs and ensure the frontend sends `Authorization` header (frontend stores token in `localStorage`).

## Next steps / Recommended improvements

- Move API base URLs into Angular environment files and avoid hard-coded URLs.
- Add a README inside `backend/` and `frontend/` with service-specific details.
- Add sample `.env.example` showing the required env variables.

---

If you'd like, I can:

- Commit this `README.md` to a branch
- Add a `.env.example` and a backend `README` with expanded API docs
- Replace hardcoded API URLs in the frontend with configuration

Let me know which follow-up you'd like.
