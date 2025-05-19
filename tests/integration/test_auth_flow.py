import pytest
import jwt
from datetime import datetime, timedelta
from fastapi.testclient import TestClient
from src.api.main import app

client = TestClient(app)

def test_signup_flow():
    """Test complete signup flow"""
    # Register new user
    response = client.post("/api/auth/signup", json={
        "name": "Test User",
        "email": "test@example.com",
        "password": "securepassword123"
    })
    
    assert response.status_code == 201
    data = response.json()
    assert "token" in data
    assert "user" in data
    assert data["user"]["email"] == "test@example.com"
    
    # Verify token is valid
    token = data["token"]
    decoded = jwt.decode(token, options={"verify_signature": False})
    assert decoded["email"] == "test@example.com"

def test_login_flow():
    """Test login flow"""
    # First create a user
    client.post("/api/auth/signup", json={
        "name": "Login Test",
        "email": "login@example.com",
        "password": "testpass123"
    })
    
    # Login with credentials
    response = client.post("/api/auth/login", json={
        "email": "login@example.com",
        "password": "testpass123"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert "user" in data

def test_invalid_login():
    """Test login with invalid credentials"""
    response = client.post("/api/auth/login", json={
        "email": "nonexistent@example.com",
        "password": "wrongpassword"
    })
    
    assert response.status_code == 401
    assert "Invalid email or password" in response.json()["detail"]

def test_token_expiration():
    """Test token expiration handling"""
    # Create an expired token
    expired_token = jwt.encode({
        "sub": "test_user",
        "email": "test@example.com",
        "exp": datetime.utcnow() - timedelta(hours=1)
    }, "test_secret", algorithm="HS256")
    
    response = client.get("/api/workspaces", headers={
        "Authorization": f"Bearer {expired_token}"
    })
    
    assert response.status_code == 401
    assert "Token has expired" in response.json()["detail"]

def test_password_reset_flow():
    """Test password reset flow"""
    # Request password reset
    response = client.post("/api/auth/reset-password", json={
        "email": "test@example.com"
    })
    
    assert response.status_code == 200
    assert "Reset email sent" in response.json()["message"]

def test_refresh_token():
    """Test token refresh functionality"""
    # Login first
    login_response = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "testpass123"
    })
    
    old_token = login_response.json()["token"]
    
    # Refresh token
    response = client.post("/api/auth/refresh", headers={
        "Authorization": f"Bearer {old_token}"
    })
    
    assert response.status_code == 200
    new_token = response.json()["token"]
    assert new_token != old_token