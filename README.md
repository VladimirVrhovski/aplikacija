# Student Grade Tracker

A simple, self-contained Node.js web application designed to demonstrate Docker containerization and CI/CD automation using GitHub Actions.

This application provides a university course grade tracking dashboard where authenticated students can log completed exams, calculate GPA, and track accumulated ECTS credits.

---

## Technical Stack
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Templating**: EJS (Server-Side Rendered HTML)
- **Authentication**: Session-based auth (`express-session` + `bcryptjs` password hashing)
- **Database**: MySQL (fully parameterized async/await connection queries via `mysql2`)
- **Testing**: Jest unit tests + Supertest integration tests
- **Styling**: Minimalist, responsive plain CSS

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)
- A running MySQL instance (if running manually)

### 2. Local Installation
Clone this repository to your machine, then run:
```bash
npm install
```

### 3. Setup MySQL Database Schema
To initialize the MySQL database schema locally, run the `schema.sql` script against your database instance:
```bash
mysql -u root -p gradetracker < schema.sql
```

### 4. Run Locally
To boot the Express server:
```bash
npm start
```
The application will start on port `3000` (or defined in `PORT`). Open your browser and navigate to `http://localhost:3000`.

### 5. Running Tests
To execute the complete Jest test suite covering unit calculations and health endpoint integrations:
```bash
npm test
```

---

## Docker Containerization and Compose

The application includes a light, optimized Node.js Docker image and a full environment Docker Compose config for seamless local testing.

### Local Development using Docker Compose
The easiest way to run the application with a fully integrated MySQL container is through Docker Compose:
```bash
docker compose up --build
```
This command builds the application, boots the MySQL service container, automatically imports the database schema from `schema.sql`, and exposes the running application on port `3000`.

---

## Required Environment Variables

To configure connection credentials or session settings, define the following variables:
* **`PORT`**: The server port (defaults to `3000`).
* **`SESSION_SECRET`**: The secret used by `express-session` to sign the session identifier cookie.
* **`DB_HOST`**: Host address of the database server (defaults to `localhost`).
* **`DB_PORT`**: Port of the database server (defaults to `3306`).
* **`DB_USER`**: Database username (defaults to `root`).
* **`DB_PASSWORD`**: Database password (defaults to empty `""`).
* **`DB_NAME`**: Database name (defaults to `gradetracker`).

---

## CI/CD Pipeline & GitHub Secrets

An automated GitHub Actions workflow is specified in `.github/workflows/ci.yml`. It:
1. Provisions temporary MySQL service containers, applies schema definitions, and runs tests automatically on all pull requests and direct pushes to `main`.
2. Automatically builds and pushes a tagged Docker image to Docker Hub whenever changes are merged into `main`.

No new GitHub secrets are required for database connectivity in CI (it uses hardcoded test credentials only).

### Required Docker Hub GitHub Secrets (unchanged)
To utilize the build-and-push job, configure the following secrets inside your GitHub Repository under **Settings > Secrets and variables > Actions**:

1. **`DOCKER_USERNAME`**: Your Docker Hub Username.
2. **`DOCKER_TOKEN`**: Your Docker Hub Access Token (generate this in Docker Hub under Account Settings > Security).
