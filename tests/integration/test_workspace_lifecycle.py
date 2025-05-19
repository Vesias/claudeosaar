import pytest
import time
from fastapi.testclient import TestClient
from src.api.main import app

client = TestClient(app)

@pytest.fixture
def auth_token():
    """Get auth token for tests"""
    response = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "testpass123"
    })
    return response.json()["token"]

def test_workspace_lifecycle(auth_token):
    """Test complete workspace lifecycle"""
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    # 1. Create workspace
    create_response = client.post("/api/workspaces", 
        json={
            "name": "Test Workspace",
            "claude_api_key": "test-key"
        },
        headers=headers
    )
    
    assert create_response.status_code == 200
    workspace = create_response.json()
    workspace_id = workspace["id"]
    
    # 2. Get workspace details
    get_response = client.get(f"/api/workspaces/{workspace_id}", headers=headers)
    assert get_response.status_code == 200
    assert get_response.json()["name"] == "Test Workspace"
    
    # 3. List all workspaces
    list_response = client.get("/api/workspaces", headers=headers)
    assert list_response.status_code == 200
    workspaces = list_response.json()
    assert any(w["id"] == workspace_id for w in workspaces)
    
    # 4. Start terminal session
    terminal_response = client.post(f"/api/workspaces/{workspace_id}/terminal", 
        headers=headers
    )
    assert terminal_response.status_code == 200
    assert "session_id" in terminal_response.json()
    
    # 5. Execute command
    exec_response = client.post(f"/api/workspaces/{workspace_id}/execute",
        json={"command": "echo 'Hello World'"},
        headers=headers
    )
    assert exec_response.status_code == 200
    assert "output" in exec_response.json()
    
    # 6. Store in memory bank
    memory_response = client.post("/api/memory-bank/store",
        json={
            "content": "Test memory content",
            "workspace_id": workspace_id
        },
        headers=headers
    )
    assert memory_response.status_code == 200
    
    # 7. Search memory bank
    search_response = client.get("/api/memory-bank/search",
        params={
            "query": "test",
            "workspace_id": workspace_id
        },
        headers=headers
    )
    assert search_response.status_code == 200
    assert len(search_response.json()["results"]) > 0
    
    # 8. Stop workspace
    stop_response = client.post(f"/api/workspaces/{workspace_id}/stop",
        headers=headers
    )
    assert stop_response.status_code == 200
    
    # 9. Restart workspace
    restart_response = client.post(f"/api/workspaces/{workspace_id}/start",
        headers=headers
    )
    assert restart_response.status_code == 200
    
    # 10. Delete workspace
    delete_response = client.delete(f"/api/workspaces/{workspace_id}",
        headers=headers
    )
    assert delete_response.status_code == 200
    
    # Verify workspace is deleted
    get_deleted = client.get(f"/api/workspaces/{workspace_id}", headers=headers)
    assert get_deleted.status_code == 404

def test_workspace_resource_limits(auth_token):
    """Test workspace resource limits by tier"""
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    # Create workspace with free tier
    response = client.post("/api/workspaces",
        json={
            "name": "Free Tier Workspace",
            "claude_api_key": "test-key"
        },
        headers=headers
    )
    
    workspace = response.json()
    workspace_id = workspace["id"]
    
    # Get container stats
    stats_response = client.get(f"/api/workspaces/{workspace_id}/stats",
        headers=headers
    )
    
    stats = stats_response.json()
    assert stats["memory_limit"] == "512m"
    assert stats["cpu_limit"] == 0.5

def test_concurrent_workspace_operations(auth_token):
    """Test concurrent operations on workspaces"""
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    # Create multiple workspaces
    workspace_ids = []
    for i in range(3):
        response = client.post("/api/workspaces",
            json={
                "name": f"Concurrent Test {i}",
                "claude_api_key": "test-key"
            },
            headers=headers
        )
        workspace_ids.append(response.json()["id"])
    
    # Execute commands concurrently
    import concurrent.futures
    
    def execute_command(workspace_id):
        return client.post(f"/api/workspaces/{workspace_id}/execute",
            json={"command": "sleep 1 && echo done"},
            headers=headers
        )
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
        futures = [executor.submit(execute_command, wid) for wid in workspace_ids]
        results = [f.result() for f in concurrent.futures.as_completed(futures)]
    
    # All should succeed
    for result in results:
        assert result.status_code == 200
        assert "done" in result.json()["output"]