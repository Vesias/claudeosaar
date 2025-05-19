import { Router, Request, Response } from 'express';
import { WorkspaceController } from '../workspaces/workspace.controller';
import { WorkspaceService } from '../workspaces/workspace.service';
import { ContainerManager } from '../../containers/container-manager';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Initialize dependencies
const workspaceService = new WorkspaceService();
const containerManager = new ContainerManager();
const workspaceController = new WorkspaceController(workspaceService, containerManager);

// All routes require authentication
router.use(authMiddleware);

// Workspace CRUD operations
router.post('/', (req: Request, res: Response) => workspaceController.createWorkspace(req as AuthRequest, res));
router.get('/', (req: Request, res: Response) => workspaceController.listWorkspaces(req as AuthRequest, res));
router.get('/:id', (req: Request, res: Response) => workspaceController.getWorkspace(req as AuthRequest, res));
router.delete('/:id', (req: Request, res: Response) => workspaceController.deleteWorkspace(req as AuthRequest, res));

// Workspace container operations
router.post('/:id/start', (req: Request, res: Response) => workspaceController.startWorkspace(req as AuthRequest, res));
router.post('/:id/stop', (req: Request, res: Response) => workspaceController.stopWorkspace(req as AuthRequest, res));

export default router;