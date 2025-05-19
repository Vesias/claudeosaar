/**
 * Improved Workspace Controller with better validation and error handling
 */

import { Request, Response, NextFunction } from 'express';
import { ContainerManager } from '../../containers/container-manager';
import { 
  Workspace, 
  WorkspaceCreate, 
  WorkspaceUpdate,
  PaginatedResponse,
  WorkspaceFilters,
  ApiError
} from '../../types/workspace.types';
import { validateRequest, schemas, sanitizeInput } from '../../utils/security';
import { logger } from '../../utils/logger';

export class WorkspaceController {
  private containerManager: ContainerManager;
  
  constructor() {
    this.containerManager = new ContainerManager();
  }
  
  /**
   * Get all workspaces for the authenticated user with pagination
   */
  async getWorkspaces(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters: WorkspaceFilters = {
        status: req.query.status as Workspace['status'],
        tier: req.query.tier as Workspace['tier'],
        search: req.query.search as string,
        sortBy: req.query.sortBy as any || 'createdAt',
        sortOrder: req.query.sortOrder as any || 'desc'
      };
      
      logger.info(`Fetching workspaces for user ${userId}`, { page, limit, filters });
      
      // Mock implementation - replace with actual database query
      const mockWorkspaces: Workspace[] = [
        {
          id: '1',
          name: 'dev-workspace',
          ownerId: userId,
          tier: 'pro',
          status: 'running',
          containerId: 'container-123',
          resources: {
            cpu: '2',
            memory: '2GB',
            storage: '50GB'
          },
          metadata: {
            region: 'eu-central-1',
            apiKey: 'workspace-key-123',
            lastActivity: new Date().toISOString()
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      // Apply filters
      let filteredWorkspaces = mockWorkspaces;
      
      if (filters.status) {
        filteredWorkspaces = filteredWorkspaces.filter(w => w.status === filters.status);
      }
      
      if (filters.tier) {
        filteredWorkspaces = filteredWorkspaces.filter(w => w.tier === filters.tier);
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredWorkspaces = filteredWorkspaces.filter(w => 
          w.name.toLowerCase().includes(searchLower)
        );
      }
      
      // Sort workspaces
      filteredWorkspaces.sort((a, b) => {
        const field = filters.sortBy || 'createdAt';
        const order = filters.sortOrder === 'asc' ? 1 : -1;
        
        if (a[field] < b[field]) return -1 * order;
        if (a[field] > b[field]) return 1 * order;
        return 0;
      });
      
      // Paginate
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedWorkspaces = filteredWorkspaces.slice(start, end);
      
      const response: PaginatedResponse<Workspace> = {
        data: paginatedWorkspaces,
        total: filteredWorkspaces.length,
        page,
        limit,
        hasNext: end < filteredWorkspaces.length,
        hasPrev: page > 1
      };
      
      res.json(response);
    } catch (error) {
      logger.error('Error fetching workspaces', error);
      next(error);
    }
  }
  
  /**
   * Get a single workspace by ID
   */
  async getWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      
      logger.info(`Fetching workspace ${id} for user ${userId}`);
      
      // Mock implementation
      const workspace: Workspace = {
        id,
        name: `workspace-${id}`,
        ownerId: userId,
        tier: 'pro',
        status: 'running',
        containerId: `container-${id}`,
        resources: {
          cpu: '2',
          memory: '2GB',
          storage: '50GB'
        },
        metadata: {
          region: 'eu-central-1',
          apiKey: `key-${id}`,
          lastActivity: new Date().toISOString()
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Check ownership
      if (workspace.ownerId !== userId) {
        const error: ApiError = {
          error: 'FORBIDDEN',
          message: 'Access denied to this workspace',
          statusCode: 403,
          timestamp: new Date().toISOString(),
          path: req.path
        };
        res.status(403).json(error);
        return;
      }
      
      res.json({ workspace });
    } catch (error) {
      logger.error(`Error fetching workspace ${req.params.id}`, error);
      next(error);
    }
  }
  
  /**
   * Create a new workspace
   */
  async createWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      
      // Validate request body
      const validation = validateRequest(schemas.workspaceCreate, req.body);
      
      if (!validation.success) {
        const error: ApiError = {
          error: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          statusCode: 400,
          timestamp: new Date().toISOString(),
          path: req.path,
          details: validation.errors.issues
        };
        res.status(400).json(error);
        return;
      }
      
      const workspaceData = validation.data;
      
      logger.info(`Creating workspace for user ${userId}`, workspaceData);
      
      // Check workspace limits based on tier
      const userTier = (req as any).user?.subscriptionTier || 'free';
      const workspaceLimits = {
        free: 1,
        pro: 5,
        enterprise: -1 // unlimited
      };
      
      const limit = workspaceLimits[userTier];
      
      // Mock check - replace with actual database query
      const existingWorkspaceCount = 0;
      
      if (limit !== -1 && existingWorkspaceCount >= limit) {
        const error: ApiError = {
          error: 'WORKSPACE_LIMIT_EXCEEDED',
          message: `Workspace limit exceeded. Upgrade to create more workspaces.`,
          statusCode: 403,
          timestamp: new Date().toISOString(),
          path: req.path
        };
        res.status(403).json(error);
        return;
      }
      
      // Create container
      const container = await this.containerManager.createContainer({
        name: workspaceData.name,
        tier: workspaceData.tier,
        userId
      });
      
      // Create workspace record
      const workspace: Workspace = {
        id: `ws-${Date.now()}`,
        name: sanitizeInput(workspaceData.name),
        ownerId: userId,
        tier: workspaceData.tier,
        status: 'pending',
        containerId: container.id,
        resources: {
          cpu: container.resources.cpu,
          memory: container.resources.memory,
          storage: container.resources.storage
        },
        metadata: {
          region: workspaceData.region,
          apiKey: `ws-key-${Date.now()}`,
          lastActivity: new Date().toISOString()
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Start container
      await this.containerManager.startContainer(container.id);
      workspace.status = 'running';
      
      res.status(201).json({ workspace });
    } catch (error) {
      logger.error('Error creating workspace', error);
      next(error);
    }
  }
  
  /**
   * Update a workspace
   */
  async updateWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      const updates: WorkspaceUpdate = req.body;
      
      logger.info(`Updating workspace ${id} for user ${userId}`, updates);
      
      // Mock workspace fetch
      const workspace: Workspace = {
        id,
        name: `workspace-${id}`,
        ownerId: userId,
        tier: 'pro',
        status: 'running',
        containerId: `container-${id}`,
        resources: {
          cpu: '2',
          memory: '2GB',
          storage: '50GB'
        },
        metadata: {
          region: 'eu-central-1',
          apiKey: `key-${id}`,
          lastActivity: new Date().toISOString()
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Check ownership
      if (workspace.ownerId !== userId) {
        const error: ApiError = {
          error: 'FORBIDDEN',
          message: 'Access denied to this workspace',
          statusCode: 403,
          timestamp: new Date().toISOString(),
          path: req.path
        };
        res.status(403).json(error);
        return;
      }
      
      // Apply updates
      if (updates.name) {
        workspace.name = sanitizeInput(updates.name);
      }
      
      if (updates.status) {
        workspace.status = updates.status;
        
        // Handle container state changes
        if (updates.status === 'stopped' && workspace.containerId) {
          await this.containerManager.stopContainer(workspace.containerId);
        } else if (updates.status === 'running' && workspace.containerId) {
          await this.containerManager.startContainer(workspace.containerId);
        }
      }
      
      if (updates.metadata) {
        workspace.metadata = {
          ...workspace.metadata,
          ...updates.metadata
        };
      }
      
      workspace.updatedAt = new Date().toISOString();
      
      res.json({ workspace });
    } catch (error) {
      logger.error(`Error updating workspace ${req.params.id}`, error);
      next(error);
    }
  }
  
  /**
   * Delete a workspace
   */
  async deleteWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      
      logger.info(`Deleting workspace ${id} for user ${userId}`);
      
      // Mock workspace fetch
      const workspace: Workspace = {
        id,
        name: `workspace-${id}`,
        ownerId: userId,
        tier: 'pro',
        status: 'running',
        containerId: `container-${id}`,
        resources: {
          cpu: '2',
          memory: '2GB',
          storage: '50GB'
        },
        metadata: {
          region: 'eu-central-1',
          apiKey: `key-${id}`,
          lastActivity: new Date().toISOString()
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Check ownership
      if (workspace.ownerId !== userId) {
        const error: ApiError = {
          error: 'FORBIDDEN',
          message: 'Access denied to this workspace',
          statusCode: 403,
          timestamp: new Date().toISOString(),
          path: req.path
        };
        res.status(403).json(error);
        return;
      }
      
      // Stop and remove container
      if (workspace.containerId) {
        await this.containerManager.stopContainer(workspace.containerId);
        await this.containerManager.removeContainer(workspace.containerId);
      }
      
      // Delete workspace record
      // Mock deletion - replace with actual database operation
      
      res.status(204).send();
    } catch (error) {
      logger.error(`Error deleting workspace ${req.params.id}`, error);
      next(error);
    }
  }
}