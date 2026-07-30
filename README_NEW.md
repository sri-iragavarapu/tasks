Employee Leave Management System

Overview

This repository contains a full-stack Employee Leave Management System prototype:

- backend: Node.js + Express API using SQLite (zero-config) and JWT-based authentication
- frontend: React app scaffolded with Vite (minimal) that interacts with the backend

Features (scaffolded)

- User registration and login (JWT)
- Role-based access: employee and admin (HR)
- Employee leave application (create, view)
- Admin: list and approve/reject leave requests, manage users

Quick start (development)

1. Backend
   cd backend
   npm install
   node init-db.js    # create SQLite DB and seed an admin user (admin@example.com / Password123!)
   npm start

2. Frontend
   cd frontend
   npm install
   npm run dev

Defaults

- Backend runs on http://localhost:4000
- Frontend runs on http://localhost:5173

Notes

- This is a scaffold for the requested system. It includes core models, routes and a minimal UI.
- After installing, adjust environment variables in backend/.env if needed.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>