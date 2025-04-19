from fastapi import FastAPI
import consul
import os
import socket
import uvicorn

app = FastAPI(title="AI Orchestrator Service")

# Health check endpoint
@app.get('/health')
async def health(): 
    return {'status':'OK'} 

# Register service with Consul
def register_to_consul():
    consul_client = consul.Consul(host="localhost", port=8500)
    service_id = "ai-orchestrator"
    service_name = "ai-orchestrator"
    
    # Get the host IP
    hostname = socket.gethostname()
    service_port = 8001  # As per the startup instructions
    
    consul_client.agent.service.register(
        name=service_name,
        service_id=service_id,
        address=hostname,
        port=service_port,
        check=consul.Check.http(f"http://localhost:{service_port}/health", interval="10s")
    )
    print(f"Registered service '{service_name}' with Consul")

@app.on_event("startup")
async def startup_event():
    register_to_consul()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001) 