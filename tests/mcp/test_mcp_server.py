import pytest
import requests
from unittest.mock import Mock, patch

MCP_SERVER_URL = "http://localhost:6602"

def test_mcp_health():
    """Test MCP server health endpoint"""
    response = requests.get(f"{MCP_SERVER_URL}/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_mcp_tools_list():
    """Test getting list of available tools"""
    response = requests.get(f"{MCP_SERVER_URL}/mcp/tools")
    assert response.status_code == 200
    tools = response.json()
    
    expected_tools = ["executeCommand", "readFile", "writeFile", "searchMemoryBank"]
    for tool in expected_tools:
        assert tool in tools

def test_execute_command_tool():
    """Test execute command tool"""
    response = requests.post(
        f"{MCP_SERVER_URL}/mcp/tools/executeCommand",
        json={
            "params": {
                "command": "echo test",
                "workspaceId": "test-workspace"
            }
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "output" in data

@patch('os.path.exists')
@patch('builtins.open', create=True)
def test_read_file_tool(mock_open, mock_exists):
    """Test read file tool"""
    mock_exists.return_value = True
    mock_open.return_value.__enter__.return_value.read.return_value = "file content"
    
    response = requests.post(
        f"{MCP_SERVER_URL}/mcp/tools/readFile",
        json={
            "params": {
                "path": "test.txt",
                "workspaceId": "test-workspace"
            }
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["content"] == "file content"

@patch('os.makedirs')
@patch('builtins.open', create=True)
def test_write_file_tool(mock_open, mock_makedirs):
    """Test write file tool"""
    mock_file = Mock()
    mock_open.return_value.__enter__.return_value = mock_file
    
    response = requests.post(
        f"{MCP_SERVER_URL}/mcp/tools/writeFile",
        json={
            "params": {
                "path": "test.txt",
                "content": "test content",
                "workspaceId": "test-workspace"
            }
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True

def test_search_memory_bank_tool():
    """Test memory bank search tool"""
    response = requests.post(
        f"{MCP_SERVER_URL}/mcp/tools/searchMemoryBank",
        json={
            "params": {
                "query": "test query",
                "workspaceId": "test-workspace"
            }
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "results" in data