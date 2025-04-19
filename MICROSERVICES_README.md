# Microservices Architecture with Consul

This project implements a microservices architecture with three main services:
- API Gateway (Node.js/Express)
- AI Orchestrator (Python/FastAPI)
- Video Generator (Python/FastAPI)

## Prerequisites

- Node.js 16+ and npm
- Python 3.8+
- Consul

## Starting the Services

### 1. Install and Start Consul

```bash
# Install Consul (if not already installed)
brew install consul        # macOS
# or
sudo apt-get install consul  # Ubuntu/Debian

# Start Consul agent in dev mode
consul agent -dev -client=0.0.0.0
```

### 2. Start the AI Orchestrator Service

```bash
cd ai-orchestrator
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

### 3. Start the Video Generator Service

```bash
cd video-generator
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8002
```

### 4. Start the API Gateway

```bash
cd api-gateway
npm install
npm start
```

## Verify Services

Check that all services are registered with Consul:

```bash
consul members
consul catalog services
```

You should see all three services registered:
- api-gateway
- ai-orchestrator
- video-generator

## Testing the Services

### Health Check Endpoints
- API Gateway: http://localhost:3001/health
- AI Orchestrator: http://localhost:8001/health
- Video Generator: http://localhost:8002/health

### Using the API Gateway
The API Gateway will proxy requests to the appropriate service:
- For AI Orchestrator: http://localhost:3001/ai/...
- For Video Generator: http://localhost:3001/video/...

## Architecture Overview

- **Consul**: Service discovery and registration
- **API Gateway**: Single entry point for clients, routes requests to appropriate services
- **AI Orchestrator**: Handles AI-related processing
- **Video Generator**: Generates video content

Each service has a health check endpoint that Consul uses to verify service health. 