# Gemini Project Context: WebApp Ispezioni Cantieri

## Project Overview

This is a full-stack web application designed for construction site inspectors. Its primary purpose is to streamline and automate the creation and updating of the "Giornale dei Lavori" (Work Log). The application allows inspectors (Admins) to manage construction sites, add daily notes, and manage worker information, including their company affiliations and roles. A key feature is the ability to generate the work log in XLS format.

## Architecture and Technologies

The application follows a classic client-server architecture.

-   **Frontend:** A single-page application built with **React** and **TypeScript**, using **Vite** as the build tool. Key libraries include:
    -   `react-router-dom` for navigation.
    -   `axios` for API communication.
    -   `mapbox-gl` and `react-map-gl` for map functionalities.
    -   `bootstrap` for UI components.

-   **Backend:** A RESTful API built with **Node.js** and the **Express** framework. It handles business logic and database interactions.

-   **Database:** A **PostgreSQL** database is used for data persistence. The schema includes tables for managing users, building sites, companies, daily notes, worker presences, and their relationships.

-   **Authentication:** The application uses JSON Web Tokens (JWT) for authentication. It employs a system of access tokens (stored in local storage) and refresh tokens (sent via HttpOnly cookies) for secure access to the API.

## Building and Running

### Prerequisites

-   Node.js and npm
-   A running PostgreSQL instance

### Setup

1.  **Install Dependencies:** Install dependencies for the root, backend, and frontend from the project root directory.
    ```bash
    npm install
    npm install --prefix backend
    npm install --prefix frontend
    ```
2.  **Database Setup:**
    -   Create a PostgreSQL database.
    -   Execute the schema definition found in `docs/database/db_schema.sql` to create the necessary tables.
    -   Configure the database connection by creating a `.env` file in the `backend` directory. You will likely need variables for `DB_USER`, `DB_HOST`, `DB_DATABASE`, `DB_PASSWORD`, and `DB_PORT`. (TODO: Confirm the exact .env variable names by checking `backend/db.js` or similar config files).

### Running the Application

1.  **Start the Backend Server:**
    -   Navigate to the `backend` directory.
    -   Run the development server:
        ```bash
        npm run dev
        ```
    -   The server will typically start on a port like 3000 or 8080.

2.  **Start the Frontend Development Server:**
    -   Navigate to the `frontend` directory.
    -   Run the development server:
        ```bash
        npm run dev
        ```
    -   The frontend will be accessible in your browser, usually at `http://localhost:5173`.

## Development Conventions

-   The frontend code is written in TypeScript (`.tsx` files).
-   The project uses ESLint for code linting, configured in `frontend/eslint.config.js`. You can run the linter with `npm run lint` in the `frontend` directory.
-   The backend is written in JavaScript (ESM).
