#!/usr/bin/env python3
"""
ClaudeOSaar FastAPI Server
Main entry point for the API backend
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import uvicorn
import os
import logging
from datetime import datetime

# Import routers
from .routes import auth, users, workspaces, billing, admin, health, websocket
from .middleware.auth import AuthMiddleware
from .middleware.rate_limit import RateLimitMiddleware
from .middleware.security import SecurityHeadersMiddleware, CSRFMiddleware
from .core.config import Settings
from .core.database import init_db, close_db
from .core.redis import init_redis, close_redis

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load settings
settings = Settings()

# Create FastAPI app with lifespan events
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle startup and shutdown events"""
    # Startup
    logger.info("Starting ClaudeOSaar API server...")
    await init_db()
    await init_redis()
    yield
    # Shutdown
    logger.info("Shutting down ClaudeOSaar API server...")
    await close_db()
    await close_redis()

# Create FastAPI instance
app = FastAPI(
    title="ClaudeOSaar API",
    description="AI Development Workspace Platform",
    version="2.2.1-dev",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan
)

# Configure CORS with more restrictive settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],  # Explicit methods instead of "*"
    allow_headers=["Authorization", "Content-Type", "X-CSRF-Token"],  # Explicit headers instead of "*"
    expose_headers=["X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"],
    max_age=86400,  # Cache preflight requests for 24 hours
)

# Add trusted host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS
)

# Add security headers middleware
app.add_middleware(SecurityHeadersMiddleware)

# Add CSRF protection
app.add_middleware(CSRFMiddleware)

# Add authentication middleware
app.add_middleware(AuthMiddleware)

# Add rate limiting middleware
app.add_middleware(RateLimitMiddleware)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(workspaces.router, prefix="/api/workspaces", tags=["Workspaces"])
app.include_router(billing.router, prefix="/api/billing", tags=["Billing"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(health.router, prefix="/api/health", tags=["Health"])
app.include_router(websocket.router, tags=["WebSockets"])

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to ClaudeOSaar API",
        "version": "2.2.0",
        "docs": "/api/docs",
        "health": "/api/health"
    }

# Global exception handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code,
            "timestamp": datetime.utcnow().isoformat()
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "status_code": 500,
            "timestamp": datetime.utcnow().isoformat()
        }
    )

# Stripe webhook endpoint (separate from main API auth)
@app.post("/api/webhooks/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    from .services.stripe_service import stripe_service
    
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    
    try:
        await stripe_service.handle_webhook(
            payload.decode('utf-8'),
            sig_header
        )
        return {"status": "success"}
    except ValueError as e:
        logger.error(f"Invalid webhook payload: {e}")
        raise HTTPException(status_code=400, detail="Invalid payload")
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

# WebSocket endpoints are now in routes/websocket.py

# Metrics endpoint
@app.get("/api/metrics")
async def metrics():
    """Prometheus metrics endpoint"""
    from .services.metrics_service import metrics_service
    return await metrics_service.get_metrics()

# Main entry point
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info",
        access_log=True,
        ssl_keyfile=settings.SSL_KEYFILE if settings.USE_SSL else None,
        ssl_certfile=settings.SSL_CERTFILE if settings.USE_SSL else None,
    )