FROM node:18-slim

# Install needed packages
RUN apt-get update -y && apt-get install -y openssl libssl-dev ca-certificates

# Create app directory
WORKDIR /usr/src/app

# Copy only package.json first (for better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy rest of source code
COPY . .

# Generate Prisma Client AFTER schema is copied
RUN npx prisma generate

# Build NestJS
RUN npm run build

# Expose backend port
EXPOSE 3001

# Start app
CMD ["npm", "run", "start:prod"]
