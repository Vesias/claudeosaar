import os
import uuid
from datetime import datetime, timedelta
from typing import Optional

import docker
import jwt
import stripe
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from prometheus_client import Counter, Histogram, Gauge, generate_latest
from starlette.responses import Response

from .logging import logger, log_requests
from .middleware.rate_limit import RateLimitMiddleware

app = FastAPI(title="ClaudeOSaar API")

# Prometheus metrics
http_requests_total = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)
http_request_duration = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration',
    ['method', 'endpoint']
)
active_workspaces = Gauge(
    'claudeosaar_active_workspaces',
    'Number of active workspaces',
    ['tier']
)

# Middleware
app.add_middleware(RateLimitMiddleware, calls_per_minute=60)
app.middleware("http")(log_requests)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:6601"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
docker_client = docker.from_env()
security = HTTPBearer()

# JWT configuration
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_DELTA = timedelta(hours=24)

class User(BaseModel):
    id: str
    email: str
    subscription_tier: str
    api_key: Optional[str]

class WorkspaceCreate(BaseModel):
    name: str
    claude_api_key: str

class WorkspaceResponse(BaseModel):
    id: str
    name: str
    status: str
    container_id: Optional[str]
    terminal_url: Optional[str]

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.post("/api/workspaces", response_model=WorkspaceResponse)
async def create_workspace(
    workspace: WorkspaceCreate,
    current_user = Depends(verify_token)
):
    """Create a new Claude workspace container"""
    workspace_id = str(uuid.uuid4())
    
    # Determine resource limits based on subscription tier
    tier_limits = {
        "free": {"mem_limit": "512m", "cpu_quota": 50000},
        "pro": {"mem_limit": "2g", "cpu_quota": 200000},
        "enterprise": {"mem_limit": "8g", "cpu_quota": 400000}
    }
    
    limits = tier_limits.get(current_user.get("subscription_tier", "free"))
    
    # Create container
    container = docker_client.containers.run(
        "claudeosaar/workspace:latest",
        name=f"claude-workspace-{workspace_id}",
        environment={
            "CLAUDE_API_KEY": workspace.claude_api_key,
            "WORKSPACE_ID": workspace_id,
            "USER_ID": current_user["user_id"]
        },
        volumes={
            f"/user_mounts/{current_user['user_id']}/{workspace_id}": {
                "bind": "/workspace",
                "mode": "rw"
            }
        },
        mem_limit=limits["mem_limit"],
        cpu_quota=limits["cpu_quota"],
        detach=True,
        network="claude-net"
    )
    
    return WorkspaceResponse(
        id=workspace_id,
        name=workspace.name,
        status="running",
        container_id=container.id,
        terminal_url=f"/terminal/{workspace_id}"
    )

@app.get("/api/workspaces/{workspace_id}")
async def get_workspace(
    workspace_id: str,
    current_user = Depends(verify_token)
):
    """Get workspace details"""
    try:
        container = docker_client.containers.get(f"claude-workspace-{workspace_id}")
        return WorkspaceResponse(
            id=workspace_id,
            name=container.name,
            status=container.status,
            container_id=container.id,
            terminal_url=f"/terminal/{workspace_id}"
        )
    except docker.errors.NotFound:
        raise HTTPException(status_code=404, detail="Workspace not found")

@app.delete("/api/workspaces/{workspace_id}")
async def delete_workspace(
    workspace_id: str,
    current_user = Depends(verify_token)
):
    """Delete a workspace"""
    try:
        container = docker_client.containers.get(f"claude-workspace-{workspace_id}")
        container.stop()
        container.remove()
        return {"message": "Workspace deleted successfully"}
    except docker.errors.NotFound:
        raise HTTPException(status_code=404, detail="Workspace not found")

@app.post("/api/billing/create-subscription")
async def create_subscription(
    tier: str,
    current_user = Depends(verify_token)
):
    """Create Stripe subscription"""
    price_ids = {
        "pro": "price_1234567890",  # Replace with actual Stripe price IDs
        "enterprise": "price_0987654321"
    }
    
    if tier not in price_ids:
        raise HTTPException(status_code=400, detail="Invalid tier")
    
    # Create Stripe customer if not exists
    customer = stripe.Customer.create(
        email=current_user["email"],
        metadata={"user_id": current_user["user_id"]}
    )
    
    # Create subscription
    subscription = stripe.Subscription.create(
        customer=customer.id,
        items=[{"price": price_ids[tier]}],
        payment_behavior="default_incomplete",
        expand=["latest_invoice.payment_intent"]
    )
    
    return {
        "subscription_id": subscription.id,
        "client_secret": subscription.latest_invoice.payment_intent.client_secret
    }

@app.get("/api/memory-bank/search")
async def search_memory_bank(
    query: str,
    workspace_id: str,
    current_user = Depends(verify_token)
):
    """Search the memory bank"""
    # Simplified implementation - in production, use vector search
    results = [
        {"content": "Sample memory bank entry", "relevance": 0.9}
    ]
    return {"results": results}

@app.post("/api/memory-bank/store")
async def store_memory(
    content: str,
    workspace_id: str,
    current_user = Depends(verify_token)
):
    """Store content in memory bank"""
    # Simplified implementation
    return {"message": "Content stored successfully"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow()}

@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint"""
    return Response(generate_latest(), media_type="text/plain")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=6600)