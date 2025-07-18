# 🐳 Docker Hub Deployment Guide

This guide walks you through deploying your Register Button API to Docker Hub for public hosting.

## 📋 Prerequisites

1. **Docker Hub Account**: Create one at [hub.docker.com](https://hub.docker.com)
2. **Docker installed** on your local machine
3. **Command line access**

## 🚀 Step-by-Step Deployment

### Step 1: Login to Docker Hub

```bash
docker login
```
Enter your Docker Hub username and password when prompted.

### Step 2: Configure Your Repository

1. **Edit the deployment script**:
   Open `deploy-docker-hub.sh` and update:
   ```bash
   DOCKER_USERNAME="your-actual-dockerhub-username"  # Replace this!
   ```

2. **Update the Dockerfile labels** (optional):
   Edit `Dockerfile` and update the metadata labels:
   ```dockerfile
   LABEL maintainer="your-email@example.com"
   LABEL org.opencontainers.image.source="https://github.com/your-username/register-button-api"
   ```

### Step 3: Deploy to Docker Hub

Run the deployment script:
```bash
./deploy-docker-hub.sh
```

This will:
- Build your Docker image
- Tag it with version and latest
- Push both tags to Docker Hub

### Step 4: Verify Deployment

1. **Check Docker Hub**: Visit `https://hub.docker.com/r/YOUR_USERNAME/register-button-api`
2. **Test the hosted image**:
   ```bash
   docker run -p 3000:3000 your-username/register-button-api:latest
   ```

## 🌐 Using Your Hosted Image

### For End Users

Anyone can now run your API with:
```bash
docker run -p 3000:3000 your-username/register-button-api:latest
```

### For Production Deployment

Use the production docker-compose:
```bash
# Edit docker-compose.prod.yml and uncomment the image line
# Comment out the build line
docker-compose -f docker-compose.prod.yml up -d
```

## 📦 Image Information

Your Docker Hub repository will contain:

- **`latest`** - Always points to the most recent version
- **`1.0.0`** - Specific version tag
- **Automatic builds** - Can be configured for CI/CD

## 🔄 Updating Your Image

To push updates:

1. **Update version** in `deploy-docker-hub.sh`:
   ```bash
   VERSION="1.0.1"  # Increment version
   ```

2. **Run deployment again**:
   ```bash
   ./deploy-docker-hub.sh
   ```

## 🛡️ Security Best Practices

✅ **What's already configured:**
- Non-root user execution
- Minimal Alpine Linux base
- Read-only filesystem
- Resource limits
- Health checks

🔍 **Additional recommendations:**
- Use specific version tags in production
- Enable Docker Hub vulnerability scanning
- Set up automated builds from Git
- Use multi-stage builds for smaller images

## 🎯 Cloud Platform Deployment

Your Docker Hub image can be easily deployed to:

### **Heroku**
```dockerfile
# Add this to heroku.yml
build:
  docker:
    web: Dockerfile
```

### **Railway**
```bash
railway deploy --image your-username/register-button-api:latest
```

### **DigitalOcean App Platform**
```yaml
services:
- name: api
  image:
    registry: your-username/register-button-api
    tag: latest
  http_port: 3000
```

### **Google Cloud Run**
```bash
gcloud run deploy register-button-api \
  --image=docker.io/your-username/register-button-api:latest \
  --platform=managed \
  --port=3000
```

### **AWS ECS/Fargate**
Use the image: `your-username/register-button-api:latest`

## 📊 Monitoring Your Hosted Service

### Health Check Endpoint
```bash
curl https://your-hosted-service.com/api/health
```

### Docker Hub Stats
- View pull statistics
- Monitor automated builds
- Check vulnerability scans

## 🆘 Troubleshooting

### Common Issues:

1. **Authentication Error**
   ```bash
   docker login
   # Re-enter credentials
   ```

2. **Permission Denied**
   ```bash
   chmod +x deploy-docker-hub.sh
   ```

3. **Playwright Browser Missing Error**
   ```
   ❌ Error: browserType.launch: Executable doesn't exist at /home/nodejs/.cache/ms-playwright/chromium_headless_shell-1181/chrome-linux/headless_shell
   ```
   **Solution**: This was fixed by configuring the Dockerfile to use Alpine's system Chromium instead of downloading Playwright's browsers. The current version uses:
   ```dockerfile
   ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
   ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser
   ```

4. **Image Too Large**
   - Review .dockerignore
   - Use multi-stage builds
   - Remove unnecessary dependencies

5. **Build Failures**
   - Check Docker Hub build logs
   - Test locally first: `docker build .`

6. **API Returns False Even When Button Exists**
   - Check if the target website has changed
   - Verify network connectivity from container
   - Check container logs: `docker logs <container-name>`

## 📈 Next Steps

- Set up automated builds from GitHub
- Configure webhook notifications
- Add CI/CD pipeline integration
- Monitor usage analytics
- Set up Docker Hub Teams for collaboration

---

🎉 **Congratulations!** Your API is now publicly available on Docker Hub and ready for global deployment!
