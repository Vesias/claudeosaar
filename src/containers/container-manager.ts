import Docker from 'dockerode';
import { ContainerCreateOptions, ContainerInfo, ResourceLimits } from './types';

export class ContainerManager {
  private docker: Docker;
  private readonly imageBase = 'claudeosaar/claude-code';
  private readonly network = 'claude-net';

  constructor() {
    this.docker = new Docker();
  }

  async createContainer(options: ContainerCreateOptions): Promise<ContainerInfo> {
    const { workspaceId, userId, tier, apiKey } = options;
    
    // Get resource limits based on tier
    const limits = this.getResourceLimits(tier);
    
    // Container name
    const containerName = `claudeos_${workspaceId}`;
    
    // Environment variables
    const env = [
      `ANTHROPIC_API_KEY=${apiKey}`,
      `WORKSPACE_ID=${workspaceId}`,
      `USER_ID=${userId}`,
      `TIER=${tier}`,
    ];

    // Volume mounts
    const binds = [
      `/user_mounts/${userId}/${workspaceId}:/workspace`,
    ];

    // Create container
    const container = await this.docker.createContainer({
      name: containerName,
      Image: `${this.imageBase}:latest`,
      Env: env,
      ExposedPorts: {
        '22/tcp': {},
        '8080/tcp': {}, // Terminal port
      },
      HostConfig: {
        Binds: binds,
        Memory: limits.memory,
        NanoCpus: limits.cpus * 1e9,
        DiskQuota: limits.storage,
        NetworkMode: this.network,
        RestartPolicy: {
          Name: 'unless-stopped',
        },
        SecurityOpt: ['apparmor=claudeosaar-container-profile'],
        PortBindings: {
          '22/tcp': [{ HostPort: '0' }],
          '8080/tcp': [{ HostPort: '0' }],
        },
      },
      Labels: {
        'claudeosaar.workspace': workspaceId,
        'claudeosaar.user': userId,
        'claudeosaar.tier': tier,
        'claudeosaar.memory': limits.memory.toString(),
        'claudeosaar.cpus': limits.cpus.toString(),
        'claudeosaar.storage': limits.storage.toString(),
      },
    });

    // Start container
    await container.start();

    // Get assigned ports
    const containerInfo = await container.inspect();
    const sshPort = containerInfo.NetworkSettings.Ports['22/tcp'][0].HostPort;
    const terminalPort = containerInfo.NetworkSettings.Ports['8080/tcp'][0].HostPort;

    return {
      id: container.id,
      name: containerName,
      status: 'running',
      ports: {
        ssh: parseInt(sshPort),
        terminal: parseInt(terminalPort),
      },
      resources: limits,
    };
  }

  async getContainerInfo(workspaceId: string): Promise<ContainerInfo | null> {
    try {
      const containerName = `claudeos_${workspaceId}`;
      const containers = await this.docker.listContainers({
        all: true,
        filters: {
          name: [containerName],
        },
      });

      if (containers.length === 0) {
        return null;
      }

      const container = containers[0];
      const isRunning = container.State === 'running';
      
      return {
        id: container.Id,
        name: containerName,
        status: container.State,
        ports: isRunning ? {
          ssh: container.Ports.find(p => p.PrivatePort === 22)?.PublicPort || 0,
          terminal: container.Ports.find(p => p.PrivatePort === 8080)?.PublicPort || 0,
        } : {
          ssh: 0,
          terminal: 0,
        },
        resources: this.parseResourcesFromLabels(container.Labels),
      };
    } catch (error) {
      console.error('Error getting container info:', error);
      return null;
    }
  }

  async startContainer(workspaceId: string): Promise<ContainerInfo | null> {
    const containerName = `claudeos_${workspaceId}`;
    const container = this.docker.getContainer(containerName);
    
    await container.start();
    
    // Wait for container to be fully started
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return this.getContainerInfo(workspaceId);
  }

  async stopContainer(workspaceId: string): Promise<void> {
    const containerName = `claudeos_${workspaceId}`;
    const container = this.docker.getContainer(containerName);
    
    await container.stop();
  }

  async removeContainer(workspaceId: string): Promise<void> {
    const containerName = `claudeos_${workspaceId}`;
    const container = this.docker.getContainer(containerName);
    
    try {
      await container.stop();
    } catch (error) {
      // Container might already be stopped
    }
    
    await container.remove();
  }

  async execCommand(workspaceId: string, command: string[]): Promise<string> {
    const containerName = `claudeos_${workspaceId}`;
    const container = this.docker.getContainer(containerName);
    
    const exec = await container.exec({
      Cmd: command,
      AttachStdout: true,
      AttachStderr: true,
    });

    const stream = await exec.start({ Detach: false });
    
    return new Promise((resolve, reject) => {
      let output = '';
      
      stream.on('data', (chunk) => {
        output += chunk.toString();
      });
      
      stream.on('end', () => {
        resolve(output);
      });
      
      stream.on('error', reject);
    });
  }

  private getResourceLimits(tier: string): ResourceLimits {
    switch (tier) {
      case 'free':
        return {
          memory: 512 * 1024 * 1024, // 512MB
          cpus: 0.5,
          storage: 5 * 1024 * 1024 * 1024, // 5GB
        };
      case 'pro':
        return {
          memory: 2 * 1024 * 1024 * 1024, // 2GB
          cpus: 2,
          storage: 50 * 1024 * 1024 * 1024, // 50GB
        };
      case 'enterprise':
        return {
          memory: 8 * 1024 * 1024 * 1024, // 8GB
          cpus: 4,
          storage: 100 * 1024 * 1024 * 1024, // 100GB
        };
      default:
        return this.getResourceLimits('free');
    }
  }

  private parseResourcesFromLabels(labels: { [key: string]: string }): ResourceLimits {
    return {
      memory: parseInt(labels['claudeosaar.memory'] || '0'),
      cpus: parseFloat(labels['claudeosaar.cpus'] || '0'),
      storage: parseInt(labels['claudeosaar.storage'] || '0'),
    };
  }
}
