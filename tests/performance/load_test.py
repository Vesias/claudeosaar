import asyncio
import aiohttp
import time
import statistics
from typing import List

# Load test configuration
BASE_URL = "http://localhost:6600"
CONCURRENT_USERS = 50
REQUESTS_PER_USER = 100
AUTH_TOKEN = "test_token"  # In real tests, get this from auth endpoint

async def make_request(session: aiohttp.ClientSession, endpoint: str) -> float:
    """Make a single request and return response time"""
    start_time = time.time()
    
    async with session.get(
        f"{BASE_URL}{endpoint}",
        headers={"Authorization": f"Bearer {AUTH_TOKEN}"}
    ) as response:
        await response.text()
        end_time = time.time()
        return end_time - start_time

async def user_simulation(user_id: int) -> List[float]:
    """Simulate a single user making multiple requests"""
    response_times = []
    
    async with aiohttp.ClientSession() as session:
        for _ in range(REQUESTS_PER_USER):
            # Simulate different endpoints
            endpoints = [
                "/api/workspaces",
                f"/api/workspaces/test-{user_id}",
                "/api/memory-bank/search?query=test",
                "/health"
            ]
            
            for endpoint in endpoints:
                try:
                    response_time = await make_request(session, endpoint)
                    response_times.append(response_time)
                except Exception as e:
                    print(f"Request failed: {e}")
            
            # Small delay between requests
            await asyncio.sleep(0.1)
    
    return response_times

async def run_load_test():
    """Run the load test with multiple concurrent users"""
    print(f"Starting load test with {CONCURRENT_USERS} users...")
    
    # Create user tasks
    tasks = [
        user_simulation(user_id) 
        for user_id in range(CONCURRENT_USERS)
    ]
    
    # Run all users concurrently
    start_time = time.time()
    all_response_times = await asyncio.gather(*tasks)
    end_time = time.time()
    
    # Flatten response times
    response_times = [
        time for user_times in all_response_times 
        for time in user_times
    ]
    
    # Calculate statistics
    total_requests = len(response_times)
    total_time = end_time - start_time
    avg_response_time = statistics.mean(response_times)
    p95_response_time = statistics.quantiles(response_times, n=100)[94]
    p99_response_time = statistics.quantiles(response_times, n=100)[98]
    requests_per_second = total_requests / total_time
    
    print("\n=== Load Test Results ===")
    print(f"Total Requests: {total_requests}")
    print(f"Total Time: {total_time:.2f} seconds")
    print(f"Requests/Second: {requests_per_second:.2f}")
    print(f"Average Response Time: {avg_response_time:.3f} seconds")
    print(f"95th Percentile: {p95_response_time:.3f} seconds")
    print(f"99th Percentile: {p99_response_time:.3f} seconds")
    print(f"Min Response Time: {min(response_times):.3f} seconds")
    print(f"Max Response Time: {max(response_times):.3f} seconds")

if __name__ == "__main__":
    asyncio.run(run_load_test())