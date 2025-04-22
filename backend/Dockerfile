FROM node:22-alpine AS BUILDER
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install
COPY prisma ./prisma
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=BUILDER /app/package.json ./
COPY --from=BUILDER /app/node_modules ./node_modules
COPY --from=BUILDER /app/dist ./dist
COPY --from=BUILDER /app/prisma ./prisma
ENV GEMINI_KEY your_gemini_key_here
EXPOSE 3000
CMD ["node", "dist/src/index.js"]
