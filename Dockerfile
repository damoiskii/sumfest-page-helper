# Use Node.js with Alpine Linux
FROM node:18-alpine

# Add metadata labels for Docker Hub
LABEL maintainer="your-email@example.com"
LABEL description="Register Button Checker API - Playwright-powered web scraping service"
LABEL version="1.0.3"
LABEL org.opencontainers.image.source="https://github.com/devdam16/register-button-api"
LABEL org.opencontainers.image.description="API service to detect registration buttons on web pages using Playwright"
LABEL org.opencontainers.image.licenses="MIT"

# Set working directory
WORKDIR /app

# Install system dependencies including Chromium for Alpine Linux and glibc compatibility
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    wget \
    udev \
    xvfb \
    dbus \
    libc6-compat \
    gcompat \
    && rm -rf /var/cache/apk/*

# Copy package files first
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci --only=production

# Install Playwright and its browsers
RUN npx playwright install chromium

# Set Playwright environment variables
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=0
ENV PLAYWRIGHT_BROWSERS_PATH=/root/.cache/ms-playwright

# Copy application code
COPY api-server.js ./

# Note: Running as root in container for Playwright compatibility
# This is acceptable in containerized environments

# Expose the port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the application
CMD ["node", "api-server.js"]
