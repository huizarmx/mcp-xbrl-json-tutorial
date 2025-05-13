FROM node:22.12-alpine AS builder

# Copy package files first for better caching
COPY package*.json /app/
COPY tsconfig.json /app/
WORKDIR /app

# Install dependencies
RUN npm install

# Copy source code
COPY ./src /app/src

# Build TypeScript code
RUN npm run build

FROM node:22-alpine AS release

COPY --from=builder /app/build /app/build
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json

ENV NODE_ENV=production

WORKDIR /app

RUN npm ci --omit=dev

ENTRYPOINT ["node", "build/server.js"]