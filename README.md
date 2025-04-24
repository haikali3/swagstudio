### MVP Features
- [ ] Write a Node.js backend to pull products from the PromoStandards API
- [ ] Store fetched products in a local SQLite database using Prisma
- [x] Render products in a React frontend built with shadcn/ui and Tailwind CSS
- [ ] Display imprint locations as red boxes on product images
- [ ] Add a button to call the ChatGPT-4o image generation API
- [ ] Render a smiley face inside the first imprint location after API call

### Tech stack
- **Frontend**: React, Vite, TanStack Query (React Query), Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, Prisma, SQLite
- **API Communication**: Axios

### Docker Setup
#### Prerequisites
- Ensure you have Docker and Docker Compose installed on your machine.

#### Running the Application
1. Build and start the containers:
  ```bash
  docker compose up --build
  ```
2. Access the application:
  - Frontend: [http://localhost:5173](http://localhost:5173)
  - Backend: [http://localhost:3001](http://localhost:3001)

3. To stop the containers:
  ```bash
  docker compose down
  ```

#### Rebuilding the Containers
If you make changes to the code and need to rebuild:
1. Stop the running containers:
  ```bash
  docker compose down
  ```
2. Rebuild and start the containers:
  ```bash
  docker compose up --build
  ```

#### GCP

### Deploying to Google Cloud Run

#### Prerequisites
- A Google Cloud Platform (GCP) account.
- The `gcloud` CLI installed and authenticated.
- A GCP project with Cloud Run, Cloud Build, and Container Registry enabled.

#### Steps to Deploy

##### Backend Deployment
1. **Build the Docker image for the backend**:
  ```bash
  docker build -t gcr.io/<your-project-id>/backend .
  ```
2. **Push the image to Google Container Registry**:
  ```bash
  docker push gcr.io/<your-project-id>/backend
  ```
3. **Deploy the backend to Cloud Run**:
  ```bash
  gcloud run deploy backend-service \
    --image gcr.io/<your-project-id>/backend \
    --platform managed \
    --region <your-region> \
    --allow-unauthenticated
  ```
4. Note the URL of the deployed backend service.

##### Frontend Deployment
1. **Build the React frontend**:
  ```bash
  npm run build
  ```
2. **Create a Dockerfile for the frontend**:
  ```dockerfile
  FROM nginx:alpine
  COPY dist /usr/share/nginx/html
  EXPOSE 80
  CMD ["nginx", "-g", "daemon off;"]
  ```
3. **Build the Docker image for the frontend**:
  ```bash
  docker build -t gcr.io/<your-project-id>/frontend .
  ```
4. **Push the image to Google Container Registry**:
  ```bash
  docker push gcr.io/<your-project-id>/frontend
  ```
5. **Deploy the frontend to Cloud Run**:
  ```bash
  gcloud run deploy frontend-service \
    --image gcr.io/<your-project-id>/frontend \
    --platform managed \
    --region <your-region> \
    --allow-unauthenticated
  ```
6. Note the URL of the deployed frontend service.

#### Connecting Frontend and Backend
- Update the frontend configuration to point to the backend service URL.
- Redeploy the frontend if necessary.

#### Additional Notes
- Use environment variables in Cloud Run to configure your services securely.
- Consider using a custom domain for your services via GCP's domain mapping feature.
- Monitor your services using Cloud Run's built-in logging and monitoring tools.
- Ensure proper database connection settings for Prisma in the backend deployment.
- Use `gcloud secrets` to manage sensitive information like database credentials.