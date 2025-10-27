# Travel Management System (2e Systems Job Assignment)

This project is a full-stack Travel Management System built as a TypeScript monorepo using pnpm workspaces and managed by Turborepo.

## Implemented Features

### Required Functionality

- **CRUD Operations:** Implemented.

- **Entity Details:** Implemented.

- **Relationship Management:** Implemented.

- **Data Storage & Retrieval:** Implemented.

- **User Interface:** Implemented. The focus was on functionality rather than an elaborate UI.

### Optional Enhancements (Bonus Points)

- **Interactive Map:** Implemented.

- **Search & Filtering:** Implemented.

- **Pagination & Infinite Scroll:** Implemented.

- **Responsive Layout:** Implemented.

- **Route Distance Calculation:** Implemented.

- **Basic Authentication:** Implemented.

- **Extended Data Relationships:** Implemented.

- **Unit Tests:** Partially implemented (covering some backend services and controllers).

- **API Documentation (Swagger):** Not implemented.

- **State Management:** Implemented.

## Technology Stack

This project leverages a modern, type-safe, and scalable technology stack including TypeScript, React, Vite, TanStack Query, Zustand, React Hook Form, shadcn/ui, Tailwind CSS, Leaflet, NestJS, Prisma, Passport.js, and Zod.

## Setup & Run Instructions

### 1. Prerequisites

- Node.js (v18 or higher)
- pnpm (v9.0.0 or higher)
- Docker and Docker Compose

### 2. Initial Setup

1.  **Environment Variables:** Create `.env` files in `apps/frontend`, `apps/server`, and `packages/database` based on their respective `.env.example` files. These are crucial for configuring API endpoints, database connections, and authentication secrets.
2.  **Install Dependencies:**
    ```bash
    pnpm install
    ```
3.  **Start Database:** Run the PostgreSQL database in Docker.
    ```bash
    docker-compose up -d
    ```
4.  **Run Database Migrations:** Apply the schema to the database.
    ```bash
    pnpm -w exec prisma migrate dev --name init
    ```
5.  **Seed the Database:** Populate the database with initial data.
    ```bash
    pnpm -w exec prisma db seed
    ```

### 3. Running in Development

To run both the frontend and backend servers in development mode with hot-reloading:

```bash
pnpm dev
```

- The frontend will be available at `http://localhost:5173`.
- The backend API will be available at `http://localhost:3000`.

### 4. Building for Production

To build all applications and packages for production:

```bash
pnpm build
```

### 5. Running in Production

After building, you can start both the frontend and backend servers in production mode from the root of the monorepo:

```bash
pnpm start
```

- The frontend will be available at `http://localhost:5173`.
- The backend API will be available at `http://localhost:3000`.

### 6. Running Tests

To run all backend tests:

```bash
pnpm test
```

## Time Taken

Approximately 25 hours were invested in this assignment.
