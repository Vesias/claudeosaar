import { Response } from 'express';
import { WorkspaceService } from './workspace.service';
import { ContainerManager } from '../../containers/container-manager';
import { AuthRequest } from '../auth/types';

export class WorkspaceController {
  constructor(
    private workspaceService: WorkspaceService,
    private containerManager: ContainerManager
  ) {}

  async createWorkspace(req: AuthRequest, res: Response) {
    try {
      const { name, template } = req.body;
      const userId = req.user.id;
      const tier = req.user.subscription.tier;

      // Create workspace in database
      const workspace = await this.workspaceService.create({
        name,
        userId,
        template,
      });

      // Start container for workspace
      const container = await this.containerManager.createContainer({
        workspaceId: workspace.id,
        userId,
        tier,
        apiKey: req.user.apiKey || 'test-api-key',
      });

      res.status(201).json({
        workspace,
        container: {
          id: container.id,
          sshPort: container.ports.ssh,
          terminalPort: container.ports.terminal,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async getWorkspace(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const workspace = await this.workspaceService.getById(id, userId);
      
      if (!workspace) {
        return res.status(404).json({ error: 'Workspace not found' });
      }

      const containerInfo = await this.containerManager.getContainerInfo(
        workspace.id
      );

      return res.json({
        workspace,
        container: containerInfo,
      });
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async listWorkspaces(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const workspaces = await this.workspaceService.listByUser(userId);
      
      // Get container info for each workspace
      const workspacesWithContainers = await Promise.all(
        workspaces.map(async (workspace) => {
          const containerInfo = await this.containerManager.getContainerInfo(
            workspace.id
          );
          return {
            ...workspace,
            container: containerInfo,
          };
        })
      );

      res.json(workspacesWithContainers);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async deleteWorkspace(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const workspace = await this.workspaceService.getById(id, userId);
      
      if (!workspace) {
        return res.status(404).json({ error: 'Workspace not found' });
      }

      // Stop and remove container
      await this.containerManager.removeContainer(workspace.id);

      // Delete workspace from database
      await this.workspaceService.delete(id, userId);

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async startWorkspace(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const workspace = await this.workspaceService.getById(id, userId);
      
      if (!workspace) {
        return res.status(404).json({ error: 'Workspace not found' });
      }

      const container = await this.containerManager.startContainer(
        workspace.id
      );

      return res.json({
        status: 'started',
        container,
      });
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async stopWorkspace(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const workspace = await this.workspaceService.getById(id, userId);
      
      if (!workspace) {
        return res.status(404).json({ error: 'Workspace not found' });
      }

      await this.containerManager.stopContainer(workspace.id);

      return res.json({
        status: 'stopped',
      });
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}
