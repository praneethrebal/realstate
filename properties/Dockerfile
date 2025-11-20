# ----------------------------
# 1️⃣ Build stage
# ----------------------------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ----------------------------
# 2️⃣ Serve build using Node
# ----------------------------
FROM node:20-alpine

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy the build files to final image
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Run on port 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
