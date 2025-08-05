# Real-Time Chat Application - Setup Guide

This guide provides the instructions to set up and run the chat application.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [pnpm](https://pnpm.io/installation)
- [Docker](https://www.docker.com/get-started/) (if not using a local PostgreSQL instance)

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ws_chat_app
```

### 2. Configure Environment Variables

The server requires a `.env` file for the database connection and JWT secret. You can copy the example file to get started.

1.  **Copy the example environment file:**

    ```bash
    cp server/.env.example server/.env
    ```

2.  **Update the variables in `server/.env`:**
    _Note: The credentials must match your database setup (either in `docker-compose.yml` or your local instance)._
    ```env
    # server/.env
    DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/chat_app_db"
    JWT_SECRET="your-super-secret-and-long-jwt-secret"
    ```

### 3. Install Dependencies

Install all dependencies for both the frontend and backend from the project root.

```bash
pnpm install -r
```

### 4. Set Up and Run the Database

#### Using Docker (Recommended)

1.  **Start the PostgreSQL container:**

    ```bash
    docker-compose up -d
    ```

2.  **Run the database migrations to set up the schema:**
    ```bash
    cd server
    pnpm prisma migrate dev
    ```

### 5. Run the Application

You need two terminals to run both the backend and frontend servers simultaneously.

**Terminal 1: Start the Backend Server**

```bash
cd server
pnpm dev
```

> The server will be accessible at `http://localhost:3000`.

**Terminal 2: Start the Frontend App**

```bash
cd app
pnpm dev
```

> The frontend will be running at `http://localhost:5173`.
