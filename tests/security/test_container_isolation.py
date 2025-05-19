import pytest
import docker
import subprocess
import os

client = docker.from_env()

def test_container_security_options():
    """Test that containers are created with proper security options"""
    # Create a test container
    container = client.containers.run(
        "claudeosaar/workspace:latest",
        name="security-test-container",
        detach=True,
        security_opt=["apparmor=claudeosaar-container-profile"],
        cap_drop=["ALL"],
        cap_add=["NET_BIND_SERVICE", "CHOWN", "SETUID", "SETGID"],
        read_only=False,
        mem_limit="512m",
        cpus=0.5
    )
    
    try:
        # Check security options
        inspect = client.api.inspect_container(container.id)
        
        # Verify AppArmor profile
        assert inspect["AppArmorProfile"] == "claudeosaar-container-profile"
        
        # Verify capabilities
        assert "ALL" in inspect["HostConfig"]["CapDrop"]
        assert "NET_BIND_SERVICE" in inspect["HostConfig"]["CapAdd"]
        
        # Verify resource limits
        assert inspect["HostConfig"]["Memory"] == 536870912  # 512MB in bytes
        assert inspect["HostConfig"]["NanoCpus"] == 500000000  # 0.5 CPU
        
    finally:
        container.stop()
        container.remove()

def test_container_network_isolation():
    """Test container network isolation"""
    # Create two containers
    container1 = client.containers.run(
        "claudeosaar/workspace:latest",
        name="network-test-1",
        detach=True,
        network="claude-net"
    )
    
    container2 = client.containers.run(
        "claudeosaar/workspace:latest",
        name="network-test-2",
        detach=True,
        network="claude-net"
    )
    
    try:
        # Test that containers can communicate within network
        exec_result = container1.exec_run(f"ping -c 1 {container2.name}")
        assert exec_result.exit_code == 0
        
        # Test that containers cannot access host network
        exec_result = container1.exec_run("ping -c 1 host.docker.internal")
        assert exec_result.exit_code != 0
        
    finally:
        container1.stop()
        container1.remove()
        container2.stop()
        container2.remove()

def test_file_system_isolation():
    """Test file system isolation between containers"""
    # Create container with mounted volume
    container = client.containers.run(
        "claudeosaar/workspace:latest",
        name="fs-test",
        detach=True,
        volumes={
            "/tmp/test_volume": {"bind": "/workspace", "mode": "rw"}
        }
    )
    
    try:
        # Write file in container
        container.exec_run("echo 'test data' > /workspace/test.txt")
        
        # Verify file exists in volume
        assert os.path.exists("/tmp/test_volume/test.txt")
        
        # Verify container cannot access host filesystem
        exec_result = container.exec_run("ls /etc/passwd")
        assert exec_result.exit_code == 0  # Can see its own /etc/passwd
        
        exec_result = container.exec_run("ls /host/etc/passwd")
        assert exec_result.exit_code != 0  # Cannot access host's /etc/passwd
        
    finally:
        container.stop()
        container.remove()
        # Cleanup
        if os.path.exists("/tmp/test_volume/test.txt"):
            os.remove("/tmp/test_volume/test.txt")

def test_process_isolation():
    """Test process isolation between containers"""
    container = client.containers.run(
        "claudeosaar/workspace:latest",
        name="process-test",
        detach=True,
        pid_mode="container"  # Use container PID namespace
    )
    
    try:
        # Check that container can only see its own processes
        exec_result = container.exec_run("ps aux")
        output = exec_result.output.decode()
        
        # Should only see container processes, not host processes
        assert "dockerd" not in output  # Host Docker daemon
        assert "systemd" not in output  # Host init system
        
    finally:
        container.stop()
        container.remove()

def test_user_namespace_mapping():
    """Test user namespace mapping for security"""
    container = client.containers.run(
        "claudeosaar/workspace:latest",
        name="user-test",
        detach=True,
        user="1000:1000"  # Run as non-root user
    )
    
    try:
        # Check user inside container
        exec_result = container.exec_run("id")
        output = exec_result.output.decode()
        
        assert "uid=1000" in output
        assert "gid=1000" in output
        
        # Verify cannot perform root operations
        exec_result = container.exec_run("apt-get update")
        assert exec_result.exit_code != 0  # Should fail due to lack of permissions
        
    finally:
        container.stop()
        container.remove()