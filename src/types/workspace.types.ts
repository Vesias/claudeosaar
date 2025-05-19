/**
 * Workspace related type definitions
 */

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  tier: 'free' | 'pro' | 'enterprise';
  status: 'running' | 'stopped' | 'pending' | 'error';
  containerId?: string;
  resources: {
    cpu: string;
    memory: string;
    storage: string;
  };
  metadata: {
    region: string;
    apiKey?: string;
    lastActivity?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceCreate {
  name: string;
  tier: 'free' | 'pro' | 'enterprise';
  region: string;
  description?: string;
}

export interface WorkspaceUpdate {
  name?: string;
  status?: Workspace['status'];
  metadata?: Partial<Workspace['metadata']>;
}

export interface ResourceLimits {
  memory: string;
  cpuQuota: number;
  diskSpace: string;
}

export interface WorkspaceMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkIn: number;
  networkOut: number;
  timestamp: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
  path?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface WorkspaceFilters {
  status?: Workspace['status'];
  tier?: Workspace['tier'];
  search?: string;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}