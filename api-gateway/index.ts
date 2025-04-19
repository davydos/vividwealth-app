import express from 'express';
import axios from 'axios';
import * as Consul from 'consul';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';

const app = express();
app.use(express.json());
app.use(cookieParser());

// Initialize Consul client
const consul = new Consul({
  host: 'localhost',
  port: 8500
});

// Service registry cache
const serviceRegistry: Record<string, {address: string, port: number}> = {};

// Function to discover service
async function discoverService(serviceName: string): Promise<string> {
  // Check if we have the service in our registry
  if (serviceRegistry[serviceName]) {
    const service = serviceRegistry[serviceName];
    return `http://${service.address}:${service.port}`;
  }

  // If not, query Consul
  try {
    const result = await consul.catalog.service.nodes(serviceName);
    if (result && result.length > 0) {
      const service = result[0];
      serviceRegistry[serviceName] = {
        address: service.ServiceAddress || 'localhost',
        port: service.ServicePort
      };
      return `http://${serviceRegistry[serviceName].address}:${serviceRegistry[serviceName].port}`;
    }
    throw new Error(`Service ${serviceName} not found`);
  } catch (error) {
    console.error(`Error discovering service ${serviceName}:`, error);
    throw error;
  }
}

// Health check endpoint
app.get('/health', (_req, res) => res.json({ status: 'OK' }));

// Authentication routes
app.use('/auth', authRoutes);

// Proxy endpoint for AI Orchestrator
app.all('/ai/*', async (req, res) => {
  try {
    const baseUrl = await discoverService('ai-orchestrator');
    const path = req.path.replace('/ai', '');
    const response = await axios({
      method: req.method,
      url: `${baseUrl}${path}`,
      data: req.body,
      headers: { 'Content-Type': 'application/json' }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error proxying to AI Orchestrator:', error);
    res.status(500).json({ error: 'Failed to reach AI Orchestrator service' });
  }
});

// Proxy endpoint for Video Generator
app.all('/video/*', async (req, res) => {
  try {
    const baseUrl = await discoverService('video-generator');
    const path = req.path.replace('/video', '');
    const response = await axios({
      method: req.method,
      url: `${baseUrl}${path}`,
      data: req.body,
      headers: { 'Content-Type': 'application/json' }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error proxying to Video Generator:', error);
    res.status(500).json({ error: 'Failed to reach Video Generator service' });
  }
});

// Register with Consul
function registerWithConsul() {
  const serviceId = 'api-gateway';
  const port = 3001;
  
  consul.agent.service.register({
    name: serviceId,
    id: serviceId,
    address: 'localhost',
    port: port,
    check: {
      http: `http://localhost:${port}/health`,
      interval: '10s'
    }
  }, (err) => {
    if (err) {
      console.error('Failed to register service:', err);
    } else {
      console.log(`Registered ${serviceId} with Consul`);
    }
  });
}

// Start the server and register with Consul
app.listen(3001, () => {
  console.log('API Gateway listening on 3001');
  registerWithConsul();
}); 