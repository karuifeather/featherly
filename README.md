# Featherly Architecture

This project is a modern web application with a frontend built using Angular and a backend written in NestJS. It is deployed using AWS services such as Lambda, API Gateway, S3, CloudFront, and Route 53.

## Architecture Overview

### Frontend (Angular Application - `client`):

More details on [client](https://github.com/karuifeather/featherly/tree/main/docs/client.md).

- **Framework**: Built using **Angular** with **Nx** for efficient development.
- **Hosting**:
  - Hosted as a static website on **AWS S3**.
  - Distributed globally via **AWS CloudFront** to ensure fast load times across the world.
  - **Route 53** manages DNS for the custom domain `featherly.karuifeather.com`, routing traffic to CloudFront.
- **Functionality**:
  - Displays tour listings, booking details, and user reviews.
  - Consumes backend APIs for dynamic data retrieval.
- **Build and Deployment**:
  - Automatically built using the `production` configuration for optimized performance and secure deployment.
  - Deployed via **GitHub Actions** whenever changes are pushed to the `main` branch.

### Backend (NestJS Application - `server`:

More details on [server](https://github.com/karuifeather/featherly/tree/main/docs/server.md).

- **Framework**: Built with **NestJS**, following a modular and service-oriented architecture.
- **Hosting**:
  - Deployed as a serverless application using **AWS Lambda**.
  - Backend code is packaged into a Docker image, hosted on **AWS ECR** (Elastic Container Registry), and pulled by Lambda during execution.
- **API Gateway**:
  - **Custom Domain**: `api.featherly.karuifeather.com`, routed by **AWS API Gateway** to the Lambda function.
  - Configured for secure communication with the frontend using CORS settings.
- **API Docs**: Documentation done using Swagger is accessible [here](https://api.featherly.karuifeather.com/docs).

### Deployment Process:

1. **Frontend**:
   - Built using the Nx build pipeline and deployed to **AWS S3**.
2. **Backend**:
   - Dockerized backend is pushed to **ECR** and AWS Lambda is updated to use the new image.
3. **Automated CI/CD**:
   - **GitHub Actions** triggers the build and deployment process whenever changes are pushed to the `main` branch, ensuring continuous delivery.

### Current Features

- **Frontend**:
  - Displays tours, user interface with Tailwind styling.
- **Backend**:
  - API endpoints to fetch data from MongoDB.
  - Handles user authentication and data processing.

### How It All Comes Together in Production:

- **Frontend (Client)**:
  - Users visit the site via the domain `https://featherly.karuifeather.com`, which is served from S3 and CloudFront.
  - API calls (like fetching tours or making bookings) are routed through `https://api.featherly.karuifeather.com`, managed by API Gateway and Lambda.
- **Backend (Server)**:
  - API Gateway routes requests to the backend Lambda function.
  - Backend handles business logic such as payment processing, fetching tour data, and managing user reviews.
- **Automated Deployment**:
  - GitHub Actions handles the deployment of both frontend (Angular app) and backend (NestJS app).
  - Lambda updates and S3 deployments happen automatically after each push to the `main` branch.
- **Global Distribution**:
  - CloudFront ensures that the frontend is cached and served globally with low latency.
  - API Gateway ensures scalable API access to Lambda.

## Next Steps

- **Implement Stripe for Booking**:
  - Build the Angular payment UI.
  - Add backend support for processing Stripe payments.
- **Add Review System**:
  - Implement API routes for handling user reviews.
  - Integrate review submission in the frontend.
- **Improve Responsiveness**:
  - Ensure all components of the website are optimized for mobile devices.

---

This project is built with best practices for scalability, performance, and ease of deployment using AWS and modern web technologies.

## License

This project is licensed under the CC BY-NC License - see the [LICENSE](./LICENSE) file for details.
