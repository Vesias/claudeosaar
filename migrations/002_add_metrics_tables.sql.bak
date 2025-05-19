-- Metrics and monitoring tables

-- Container metrics
CREATE TABLE IF NOT EXISTS container_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    cpu_usage DECIMAL(5, 2),
    memory_usage_mb INTEGER,
    disk_usage_mb INTEGER,
    network_in_bytes BIGINT,
    network_out_bytes BIGINT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Request metrics
CREATE TABLE IF NOT EXISTS request_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MCP tool usage
CREATE TABLE IF NOT EXISTS mcp_tool_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    tool_name VARCHAR(100) NOT NULL,
    parameters JSONB,
    result JSONB,
    duration_ms INTEGER,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rate limit tracking
CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    ip_address INET,
    endpoint VARCHAR(255),
    requests_count INTEGER DEFAULT 0,
    window_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tier VARCHAR(50) DEFAULT 'free'
);

-- Workspace usage statistics
CREATE TABLE IF NOT EXISTS workspace_usage_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    total_runtime_minutes INTEGER DEFAULT 0,
    total_commands_executed INTEGER DEFAULT 0,
    total_memory_bank_entries INTEGER DEFAULT 0,
    last_active_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_container_metrics_workspace_id ON container_metrics(workspace_id);
CREATE INDEX idx_container_metrics_recorded_at ON container_metrics(recorded_at);
CREATE INDEX idx_request_metrics_user_id ON request_metrics(user_id);
CREATE INDEX idx_request_metrics_created_at ON request_metrics(created_at);
CREATE INDEX idx_mcp_tool_usage_workspace_id ON mcp_tool_usage(workspace_id);
CREATE INDEX idx_mcp_tool_usage_created_at ON mcp_tool_usage(created_at);
CREATE INDEX idx_rate_limits_user_id ON rate_limits(user_id);
CREATE INDEX idx_rate_limits_ip_address ON rate_limits(ip_address);

-- Partitioning for metrics tables (for better performance)
CREATE TABLE container_metrics_2024_01 PARTITION OF container_metrics
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE container_metrics_2024_02 PARTITION OF container_metrics
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Add update trigger
CREATE TRIGGER update_workspace_usage_stats_updated_at BEFORE UPDATE ON workspace_usage_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();