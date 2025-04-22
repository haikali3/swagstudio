FROM node:22-alpine AS BUILDER
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=BUILDER /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off"]
