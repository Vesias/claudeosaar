import { PrismaClient } from '@prisma/client';
import { Logger } from '../../utils/logger';

export interface CreateWorkspaceDto {
  name: string;
  userId: string;
  template?: string;
  description?: string;
}

export class WorkspaceService {
  private logger: Logger;
  private prisma: PrismaClient;

  constructor() {
    this.logger = new Logger('WorkspaceService');
    this.prisma = new PrismaClient();
  }

  async create(dto: CreateWorkspaceDto) {
    try {
      const workspace = await this.prisma.workspace.create({
        data: {
          name: dto.name,
          userId: dto.userId,
          template: dto.template,
          description: dto.description,
          status: 'stopped',
          tier: 'free',
          resources: {
            cpu: 0.5,
            memory: 512 * 1024 * 1024, // 512MB
            storage: 5 * 1024 * 1024 * 1024, // 5GB
          }
        }
      });

      this.logger.info(`Created workspace ${workspace.id} for user ${workspace.userId}`);
      return workspace;
    } catch (error) {
      this.logger.error('Failed to create workspace:', error);
      throw error;
    }
  }

  async getById(id: string, userId: string) {
    try {
      const workspace = await this.prisma.workspace.findFirst({
        where: {
          id,
          userId,
        },
        include: {
          agents: true,
          memoryBanks: {
            take: 5,
            orderBy: {
              updatedAt: 'desc'
            }
          }
        }
      });

      return workspace;
    } catch (error) {
      this.logger.error('Failed to get workspace:', error);
      throw error;
    }
  }

  async listByUser(userId: string) {
    try {
      const workspaces = await this.prisma.workspace.findMany({
        where: {
          userId,
        },
        orderBy: {
          updatedAt: 'desc'
        },
        include: {
          agents: {
            where: {
              status: 'active'
            }
          }
        }
      });

      return workspaces;
    } catch (error) {
      this.logger.error('Failed to list workspaces:', error);
      throw error;
    }
  }

  async update(id: string, userId: string, updates: any) {
    try {
      const workspace = await this.prisma.workspace.update({
        where: {
          id,
          userId,
        },
        data: updates,
      });

      return workspace;
    } catch (error) {
      this.logger.error('Failed to update workspace:', error);
      throw error;
    }
  }

  async delete(id: string, userId: string) {
    try {
      // First delete related records
      await this.prisma.agent.deleteMany({
        where: { workspaceId: id }
      });
      
      await this.prisma.memoryBank.deleteMany({
        where: { workspaceId: id }
      });
      
      await this.prisma.usageMetric.deleteMany({
        where: { workspaceId: id }
      });

      // Then delete the workspace
      await this.prisma.workspace.delete({
        where: {
          id,
          userId,
        },
      });

      this.logger.info(`Deleted workspace ${id} for user ${userId}`);
      return true;
    } catch (error) {
      this.logger.error('Failed to delete workspace:', error);
      throw error;
    }
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }
}