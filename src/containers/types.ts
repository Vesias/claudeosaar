export interface ContainerCreateOptions {
  workspaceId: string;
  userId: string;
  tier: 'free' | 'pro' | 'enterprise';
  apiKey: string;
}

export interface ContainerInfo {
  id: string;
  name: string;
  status: string;
  ports: {
    ssh: number;
    terminal: number;
  };
  resources: ResourceLimits;
}

export interface ResourceLimits {
  memory: number; // bytes
  cpus: number;
  storage: number; // bytes
}
