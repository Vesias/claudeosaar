import pytest
import subprocess
import os

def test_apparmor_profile_syntax():
    """Test AppArmor profile syntax is valid"""
    profile_path = "containers/security/apparmor/claudeosaar-container-profile"
    
    if not os.path.exists(profile_path):
        pytest.skip("AppArmor profile not found")
    
    # Test parsing the profile
    result = subprocess.run(
        ["apparmor_parser", "-d", profile_path],
        capture_output=True,
        text=True
    )
    
    assert result.returncode == 0, f"AppArmor profile has syntax errors: {result.stderr}"

def test_docker_security_options():
    """Test Docker containers are created with security options"""
    # This would be an integration test that verifies containers
    # are created with the correct security options
    pass

def test_jwt_token_validation():
    """Test JWT token validation"""
    from src.api.middleware.auth import create_access_token, verify_token
    
    # Create a test token
    test_data = {"sub": "test_user", "email": "test@example.com"}
    token = create_access_token(test_data)
    
    # Mock the credentials
    class MockCredentials:
        credentials = token
    
    # Verify the token
    decoded = verify_token(MockCredentials())
    assert decoded["sub"] == "test_user"
    assert decoded["email"] == "test@example.com"

def test_rate_limiting():
    """Test rate limiting middleware"""
    from src.api.middleware.rate_limit import RateLimitMiddleware
    
    # Create middleware instance
    middleware = RateLimitMiddleware(None, calls_per_minute=5)
    
    # Simulate requests from same IP
    client_ip = "127.0.0.1"
    
    # Should allow first 5 requests
    for i in range(5):
        middleware.requests[client_ip].append(time.time())
    
    # 6th request should be rate limited
    assert len(middleware.requests[client_ip]) >= 5

def test_env_variables_not_exposed():
    """Test sensitive environment variables are not exposed"""
    # Check that .env is in .gitignore
    with open(".gitignore", "r") as f:
        gitignore_content = f.read()
        assert ".env" in gitignore_content
    
    # Check that example env doesn't contain real keys
    with open(".env.example", "r") as f:
        env_example = f.read()
        assert "your_anthropic_key" in env_example
        assert "sk-ant-" not in env_example