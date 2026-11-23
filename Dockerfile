FROM node:22-alpine AS libraries
WORKDIR /workspace/frontend-libs-21
COPY frontend-libs-21/package*.json ./
RUN npm ci
COPY frontend-libs-21/ ./
RUN npx ng build catalog

FROM node:22-alpine AS build
WORKDIR /workspace/catalog-frontend-21
COPY catalog-frontend-21/package*.json ./
COPY --from=libraries /workspace/frontend-libs-21/dist/catalog ../frontend-libs-21/dist/catalog
RUN npm ci
COPY catalog-frontend-21/ ./
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000
COPY --from=build /workspace/catalog-frontend-21/dist/catalog-frontend ./
EXPOSE 4000
CMD ["node", "server/server.mjs"]
