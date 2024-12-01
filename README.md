# Featherly

![Featherly](https://res.cloudinary.com/drj6tdlhy/image/upload/v1731837525/logo-green-small_llobkj.png)

Featherly is a project that’s close to my heart. Years ago, I built my first real-world project with Node and Express after taking a course on Udemy. That feeling of creating something people could use sparked my passion to become a Software Engineer.

Fast forward to today: that project is now old and outdated and in need of major updates. So, I’m introducing Featherly—a modern, scalable tour booking system built with Angular and NestJS. It’s a product of everything I’ve learned, and I’m excited to keep improving and adding new features over time!

## Server `apps/server`

### Overview

This is the backend server for the project, built with NestJS and designed to run in multiple configurations: standalone, serverless, and Dockerized. The server supports REST API endpoints and is optimized for deployment on AWS Lambda. The Nx workspace is used to manage the project structure and build commands.

---

### Key Features

- **Multi-Configuration Builds**: Supports both standalone (`main.ts`) and serverless (`serverless.ts`) configurations.
- **Serverless Compatibility**: Easily deployable on AWS Lambda using the `serverless.ts` entry point.
- **Dockerized**: Docker support is included for easy local testing and deployment.
- **Nx Workspace Integration**: Efficient build and serve commands managed via Nx.
- **Views Support**: EJS templates are included and bundled in the build.

---

### Prerequisites

- **Node.js**: Ensure Node.js is installed (minimum version compatible with the project).
- **Docker**: Install Docker for running containerized builds.

  ```bash
  npm install -g nx
  ```

- **Environment Variables**: Provide a `.env` file in the project root with necessary configuration.

---

### Environment Variables

#### `.env` File

The `.env` file should contain the following keys (with correct values):

```env
NODE_ENV=development
mongoURI=mongodb://localhost:27017/project
JWT_PRIVATE=alsdkfjaliewo
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=30
STRIPE_SECRET_KEY=sk_test_dkflsadfkewq35dfasgshj5
AWS_ACCESS_KEY_ID=DAFOIWEJOFAS21SA
AWS_SECRET_ACCESS_KEY=fa4ldfikjalffdas
EMAIL_FROM=no-reply@domain.com
```

---

### Build and Run

#### Local Development

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start the server in development mode**:
   ```bash
   nx serve server
   ```
   This uses the `main.ts` entry file and runs in standalone mode.

---

### Dockerized Deployment

1. **Build Docker image**:

   ```bash
   nx docker-build server
   ```

2. **Run Docker container**:

   ```bash
   nx docker-serve server
   ```

3. **Access the API**:
   The API will be available at `http://localhost:3000`.

---

### Nx Commands

#### Serve

Starts the server in standalone mode:

```bash
nx serve server
```

#### Build

Builds the server (no config defaults to serverless):

```bash
nx build server --configuration=<main|serverless>
```

#### Docker Build

Builds the Docker image:

```bash
nx docker-build server
```

#### Docker Serve

Runs the Docker container:

```bash
nx docker-serve server
```

---

### Deployment to AWS Lambda

1. **Build the serverless configuration**:

   ```bash
   nx build server
   ```

2. **Commit your changes to `main`**:

   GitHub actions will take it from there. See `./github/server-deploy.yml`.

---

## API Endpoints

- **Base URL**:

  - Standalone: `http://localhost:4500`
  - Serverless: `http://localhost:3000/2015-03-31/functions/function/invocations`

- **Sample Routes**:
  - `GET /api/tours`
  - `POST /api/tours`

---

## Troubleshooting

- **CORS Errors**:
  Ensure CORS is configured correctly in the application. Update the CORS configuration in `app.ts` to match the client origin.

- **Environment Variable Issues**:
  Verify that `.env` is correctly configured and loaded.

- **Docker Build Stuck**:
  Use the `--no-cache` flag to rebuild from scratch:
  ```bash
  docker build --no-cache -f apps/server/Dockerfile .
  ```

---
