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
  - Backend: [http://localhost:3000](http://localhost:3000)

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