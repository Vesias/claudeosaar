import pytest
from fastapi.testclient import TestClient
from src.api.main import app

client = TestClient(app)

@pytest.fixture
def auth_headers():
    """Get authentication headers for tests"""
    # In a real test, you'd create a test user and get a real token
    # For now, we'll mock this
    return {"Authorization": "Bearer test_token"}

def test_create_workspace(auth_headers, mocker):
    """Test creating a new workspace"""
    # Mock Docker client
    mocker.patch('docker.from_env')
    
    response = client.post(
        "/api/workspaces",
        json={
            "name": "Test Workspace",
            "claude_api_key": "test_key"
        },
        headers=auth_headers
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Workspace"
    assert "id" in data
    assert data["status"] == "running"

def test_get_workspace(auth_headers, mocker):
    """Test getting workspace details"""
    # Mock Docker client
    mock_docker = mocker.patch('docker.from_env')
    mock_container = mocker.Mock()
    mock_container.status = "running"
    mock_container.name = "test-workspace"
    mock_container.id = "container123"
    mock_docker.return_value.containers.get.return_value = mock_container
    
    response = client.get(
        "/api/workspaces/test-workspace-id",
        headers=auth_headers
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "running"

def test_delete_workspace(auth_headers, mocker):
    """Test deleting a workspace"""
    # Mock Docker client
    mock_docker = mocker.patch('docker.from_env')
    mock_container = mocker.Mock()
    mock_docker.return_value.containers.get.return_value = mock_container
    
    response = client.delete(
        "/api/workspaces/test-workspace-id",
        headers=auth_headers
    )
    
    assert response.status_code == 200
    mock_container.stop.assert_called_once()
    mock_container.remove.assert_called_once()

def test_rate_limiting(auth_headers):
    """Test rate limiting functionality"""
    # Make many requests quickly
    responses = []
    for _ in range(65):  # Exceed the default 60/minute limit
        response = client.get("/api/workspaces/test", headers=auth_headers)
        responses.append(response.status_code)
    
    # At least one should be rate limited
    assert 429 in responses