# Finance Dashboard

> A role-based finance data management system built with Node.js, Express.js, PostgreSQL, and Next.js.

![Node.js](https://img.shields.io/badge/Node.js-20_LTS-green?logo=node.js)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-yellow?logo=javascript)
![Express](https://img.shields.io/badge/Express.js-5-black?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [API Reference](#api-reference)
- [Roles and Permissions](#roles-and-permissions)
- [Project Structure](#project-structure)

---

## Overview

Finance Dashboard is a full-stack application for managing financial records with role-based access control. The backend is a **pure Node.js + Express.js REST API written in plain JavaScript** (no TypeScript, no build step) backed by PostgreSQL via Prisma ORM. The frontend is a Next.js 14 dashboard with a unique dark-themed UI.

---

## Features

- **JWT Authentication** — Token-based auth with bcryptjs password hashing
- **Role-Based Access Control** — Three-tier roles: VIEWER, ANALYST, ADMIN
- **Financial Records** — Full CRUD with filters, search, and pagination
- **Dashboard Analytics** — Aggregated summaries, category breakdowns, monthly trends
- **Soft Deletes** — Records and users use `deletedAt` for non-destructive deletion
- **Swagger UI** — Interactive API docs at `/api-docs`
- **Joi Validation** — Schema validation on every request
- **Rate Limiting** — Brute-force protection on auth endpoints
- **Unique Dark UI** — Modern finance-themed interface with animations

---

## Architecture

```
Next.js Frontend (TypeScript)
         │
         ▼  HTTP REST
Express.js API  (Node.js — plain JavaScript)
         │
    ┌────┴──────────────────────┐
    │ Middleware                │
    │ authenticate → authorize  │
    │ validate → errorHandler   │
    └────┬──────────────────────┘
         │
    ┌────┴─────────────────────┐
    │ Modules                  │
    │ /auth   /users           │
    │ /records  /dashboard     │
    └────┬─────────────────────┘
         │
      Prisma ORM
         │
      PostgreSQL 16
```

---

## Tech Stack

### Backend (Plain JavaScript)
| Layer | Technology |
|---|---|
| Runtime | Node.js 20 LTS |
| Framework | Express.js 5 |
| Language | JavaScript (ES2022, CommonJS) |
| Database | PostgreSQL 16 |
| ORM | Prisma 5 |
| Auth | jsonwebtoken + bcryptjs |
| Validation | Joi |
| API Docs | swagger-jsdoc + swagger-ui-express |
| Dev Server | Nodemon |

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| UI | Tailwind CSS + shadcn/ui |
| Data Fetching | TanStack Query v5 |
| State | Zustand |
| Charts | Recharts |

---

## Getting Started

### Prerequisites

- Node.js >= 20
- PostgreSQL 16 installed and running locally
- npm >= 9

### 1. Setup the Backend

```bash
cd backend
cp .env.example .env
# Edit .env — update DATABASE_URL with your PostgreSQL credentials
npm install
npx prisma generate
npx prisma migrate dev
npm run db:seed
npm run dev
```

Backend runs at: `http://localhost:5000`
Swagger UI at: `http://localhost:5000/api-docs`

### 2. Setup the Frontend

```bash
cd ../frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

### Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@finance.com | Admin@123 |
| Analyst | analyst@finance.com | Analyst@123 |
| Viewer | viewer@finance.com | Viewer@123 |

---

## API Documentation

Interactive API documentation is available at:

```
http://localhost:5000/api-docs
```

Click the **Authorize** button in Swagger UI, enter your JWT token, and test all endpoints interactively.

---

## API Reference

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/v1/auth/register | None | Register a new user |
| POST | /api/v1/auth/login | None | Login and receive a JWT |
| GET | /api/v1/auth/me | Bearer | Get currently authenticated user |

### Users

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| GET | /api/v1/users | Bearer | ADMIN | List all users (paginated) |
| GET | /api/v1/users/:id | Bearer | ADMIN | Get user by ID |
| POST | /api/v1/users | Bearer | ADMIN | Create a new user |
| PATCH | /api/v1/users/:id | Bearer | ADMIN | Update user name, role, or status |
| DELETE | /api/v1/users/:id | Bearer | ADMIN | Soft delete user |

### Financial Records

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| GET | /api/v1/records | Bearer | ALL | List records with filters and pagination |
| GET | /api/v1/records/:id | Bearer | ALL | Get record by ID |
| POST | /api/v1/records | Bearer | ADMIN, ANALYST | Create a new record |
| PATCH | /api/v1/records/:id | Bearer | ADMIN, ANALYST | Update a record |
| DELETE | /api/v1/records/:id | Bearer | ADMIN, ANALYST | Soft delete a record |

**Query params for `GET /records`:** `type`, `category`, `startDate`, `endDate`, `search`, `page`, `limit`

### Dashboard

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| GET | /api/v1/dashboard/summary | Bearer | ALL | Income, expenses, net balance totals |
| GET | /api/v1/dashboard/category-totals | Bearer | ALL | Totals grouped by category |
| GET | /api/v1/dashboard/recent-activity | Bearer | ALL | Most recent N records |
| GET | /api/v1/dashboard/monthly-trend | Bearer | ALL | Monthly income vs expenses |
| GET | /api/v1/dashboard/weekly-trend | Bearer | ALL | Weekly income vs expenses |

---

## Roles and Permissions

| Action | VIEWER | ANALYST | ADMIN |
|---|---|---|---|
| View records | ✅ | ✅ | ✅ |
| Create records | ❌ | ✅ | ✅ |
| Update own records | ❌ | ✅ | ✅ |
| Update any record | ❌ | ❌ | ✅ |
| Delete own records | ❌ | ✅ | ✅ |
| Delete any record | ❌ | ❌ | ✅ |
| View dashboard | ✅ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

---

## Project Structure

```
finance-dashboard/
├── backend/                    # Pure Node.js + Express.js (JavaScript only)
│   ├── prisma/                 # schema.prisma, seed.js, migrations/
│   ├── src/
│   │   ├── config/             # env.js, database.js, swagger.js, permissions.js
│   │   ├── modules/            # auth/, users/, records/, dashboard/
│   │   ├── middleware/         # authenticate.js, authorize.js, validate.js, errorHandler.js
│   │   └── utils/              # AppError.js, ApiResponse.js, pagination.js
│   └── tests/                  # Jest + Supertest integration tests
├── frontend/                   # Next.js 14 (TypeScript)
│   ├── app/                    # App Router pages
│   ├── components/             # shadcn/ui + custom components
│   ├── hooks/                  # TanStack Query hooks
│   ├── store/                  # Zustand auth store
│   └── lib/                    # Axios instance, utilities
└── README.md
```

---

## License

MIT
