import { Response, NextFunction } from 'express';
import { Logger } from '../../utils/logger';
import { AuthRequest } from '../auth/types';

const logger = new Logger('AuthMiddleware');

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export type { AuthRequest };

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Use auth service to verify token
    const authService = await import('../services/auth.service');
    const service = new authService.AuthService();
    
    try {
      const user = await service.verifyToken(token);
      
      // Map subscription tier to limits
      const tierLimits = {
        free: { memory: 512, cpu: 0.5, storage: 5 },
        pro: { memory: 2048, cpu: 2, storage: 50 },
        enterprise: { memory: 8192, cpu: 4, storage: 100 },
      };
      
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name || user.email,
        role: 'user',
        apiKey: user.apiKey,
        subscription: {
          tier: user.subscriptionTier as 'free' | 'pro' | 'enterprise',
          limits: tierLimits[user.subscriptionTier as keyof typeof tierLimits] || tierLimits.free
        }
      };
      
      next();
    } catch (error) {
      logger.error('Token verification failed:', error);
      return res.status(401).json({ error: 'Invalid token' });
    } finally {
      await service.disconnect();
    }
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(500).json({ error: 'Authentication service error' });
  }
};