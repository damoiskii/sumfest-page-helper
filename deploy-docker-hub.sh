#!/bin/bash

# Docker Hub Deployment Script for Register Button API
# Make sure you're logged in to Docker Hub: docker login

set -e  # Exit on any error

# Configuration - UPDATE THESE VALUES
DOCKER_USERNAME="devdam16"  # Replace with your Docker Hub username
IMAGE_NAME="register-button-api"
VERSION="1.0.2"
LATEST_TAG="latest"

# Full image names
VERSIONED_IMAGE="$DOCKER_USERNAME/$IMAGE_NAME:$VERSION"
LATEST_IMAGE="$DOCKER_USERNAME/$IMAGE_NAME:$LATEST_TAG"

echo "🚀 Starting Docker Hub deployment process..."
echo "📦 Building image: $VERSIONED_IMAGE"

# Build the Docker image with version tag
docker build -t $VERSIONED_IMAGE .

# Tag the same image as latest
docker tag $VERSIONED_IMAGE $LATEST_IMAGE

echo "✅ Images built successfully:"
echo "   - $VERSIONED_IMAGE"
echo "   - $LATEST_IMAGE"

# Push both tags to Docker Hub
echo "📤 Pushing to Docker Hub..."
docker push $VERSIONED_IMAGE
docker push $LATEST_IMAGE

echo "🎉 Successfully deployed to Docker Hub!"
echo ""
echo "📋 Your images are now available at:"
echo "   - docker pull $VERSIONED_IMAGE"
echo "   - docker pull $LATEST_IMAGE"
echo ""
echo "🔗 Docker Hub Repository:"
echo "   https://hub.docker.com/r/$DOCKER_USERNAME/$IMAGE_NAME"
echo ""
echo "💡 To run your hosted image:"
echo "   docker run -p 3000:3000 $LATEST_IMAGE"
