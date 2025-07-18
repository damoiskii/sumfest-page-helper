# Register Button Checker API - Docker Setup

This document explains how to run the Register Button Checker API using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (usually included with Docker Desktop)

## Quick Start

### Option 1: Using Docker Compose (Recommended)

1. Build and start the service:
```bash
docker-compose up --build
```

2. The API will be available at:
   - Main endpoint: http://localhost:3000/api/register-button-exists
   - Detailed endpoint: http://localhost:3000/api/check-register-button
   - Health check: http://localhost:3000/api/health

3. To run in background:
```bash
docker-compose up -d --build
```

4. To stop the service:
```bash
docker-compose down
```

### Option 2: Using Docker directly

1. Build the image:
```bash
docker build -t register-button-api .
```

2. Run the container:
```bash
docker run -p 3000:3000 --name register-button-api register-button-api
```

3. To run in background:
```bash
docker run -d -p 3000:3000 --name register-button-api register-button-api
```

4. To stop the container:
```bash
docker stop register-button-api
docker rm register-button-api
```

## API Endpoints

- `GET /api/register-button-exists` - Returns `true` or `false`
- `GET /api/check-register-button` - Returns detailed information
- `GET /api/health` - Health check endpoint
- `GET /` - API documentation

## Container Features

- **Lightweight**: Built on Alpine Linux
- **Secure**: Runs as non-root user
- **Health Checks**: Built-in health monitoring
- **Graceful Shutdown**: Handles SIGTERM/SIGINT properly
- **Production Ready**: Optimized for production use

## Monitoring

Check container health:
```bash
docker-compose ps
```

View logs:
```bash
docker-compose logs -f api-server
```

## Troubleshooting

If you encounter issues:

1. Check container logs:
```bash
docker-compose logs api-server
```

2. Verify the container is healthy:
```bash
docker-compose ps
```

3. Test the health endpoint:
```bash
curl http://localhost:3000/api/health
```

4. Rebuild the image if needed:
```bash
docker-compose down
docker-compose up --build
```

## Environment Variables

You can customize the behavior using environment variables in the `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - PORT=3000  # Change port if needed
```

## Development

For development with live reloading, you can mount your local code:

```yaml
volumes:
  - ./api-server.js:/app/api-server.js:ro
```

Add this to the `api-server` service in `docker-compose.yml`.
