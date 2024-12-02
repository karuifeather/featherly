# Client `apps/client`

## Overview

This is the frontend client for the Featherly project, built with Angular and designed for deployment on AWS S3, distributed via CloudFront, and routed through Route 53. The client communicates with the backend server (hosted as an AWS Lambda function) using a REST API.

The Nx workspace is used to manage the project structure and build commands, allowing easy integration and efficient deployment pipelines.

---

## Key Features

- **Responsive Design**: Fully responsive design optimized for both desktop and mobile views.
- **Authentication**: Built-in authentication for user login and registration.
- **Tour Booking**: Integration with Stripe for booking and purchasing tours.
- **Review System**: Allows users to leave reviews for tours they have booked.
- **S3 Deployment**: The client is deployed to AWS S3 and served through CloudFront for global distribution.
- **Nx Workspace Integration**: Efficient build and serve commands managed via Nx.
- **Optimized for Production**: Configured for optimal performance in production, with build optimization and output hashing.

---

## Environment Variables

The client app does not require server-side environment variables but requires the following configuration for API communication:

```env
API_BASE_URL=https://api.featherly.karuifeather.com
STRIPE_PUBLIC_KEY=pk_test_12345
```

---

## Build and Run

### Local Development

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start the Angular server in development mode**:

   ```bash
   nx serve client
   ```

   This will run the application locally on `http://localhost:4200`.

---

### Production Build

1. **Build the client for production**:

   ```bash
   nx build client --configuration=production
   ```

   This will build the production version of the application in the `dist/apps/client` directory.

---

## Nx Commands

### Serve

Starts the client in development mode:

```bash
nx serve client
```

### Build

Builds the production version of the client:

```bash
nx build client --configuration=production
```

---

## API Endpoints

- **Base URL**:

  - Production: `https://featherly.karuifeather.com`
  - Development: `http://localhost:4200`

- **Sample API Endpoints**:
  - `GET /api/tours`
  - `POST /api/tours`
  - `POST /auth/login`
  - `POST /auth/register`

---
