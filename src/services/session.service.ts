import { PrismaClient } from '@prisma/client';
import { TokenManager } from '../utils/token';
import { Logger } from '../utils/logger';

interface Session {
  id: string;
  userId: string;
  refreshToken: string;
  userAgent?: string;
  ipAddress?: string;
  expiresAt: Date;
  createdAt: Date;
  lastUsedAt: Date;
}

export class SessionService {
  private prisma: PrismaClient;
  private logger: Logger;

  constructor() {
    this.prisma = new PrismaClient();
    this.logger = new Logger('SessionService');
  }

  async createSession(
    userId: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    sessionId: string;
  }> {
    try {
      // Generate tokens
      const payload = { id: userId, email: '', role: 'user' };
      const accessToken = TokenManager.generateAccessToken(payload);
      const refreshToken = TokenManager.generateRefreshToken(payload);
      const sessionId = TokenManager.generateSessionId();

      // Store session in database
      await this.prisma.$executeRaw`
        INSERT INTO sessions (id, user_id, refresh_token, user_agent, ip_address, expires_at)
        VALUES (${sessionId}, ${userId}, ${TokenManager.hashAPIKey(refreshToken)}, ${userAgent}, ${ipAddress}, ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)})
      `;

      this.logger.info(`Session created for user ${userId}`);

      return {
        accessToken,
        refreshToken,
        sessionId,
      };
    } catch (error) {
      this.logger.error('Failed to create session', error);
      throw new Error('Session creation failed');
    }
  }

  async refreshSession(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      // Verify refresh token
      const payload = TokenManager.verifyRefreshToken(refreshToken);
      
      // Check if session exists
      const hashedToken = TokenManager.hashAPIKey(refreshToken);
      const session = await this.prisma.$queryRaw<Session[]>`
        SELECT * FROM sessions 
        WHERE refresh_token = ${hashedToken} 
        AND expires_at > NOW()
        LIMIT 1
      `;

      if (!session.length) {
        throw new Error('Invalid or expired session');
      }

      // Generate new tokens
      const newAccessToken = TokenManager.generateAccessToken({
        id: payload.id,
        email: payload.email,
        role: payload.role,
      });
      const newRefreshToken = TokenManager.generateRefreshToken({
        id: payload.id,
        email: payload.email,
        role: payload.role,
      });

      // Update session
      await this.prisma.$executeRaw`
        UPDATE sessions 
        SET refresh_token = ${TokenManager.hashAPIKey(newRefreshToken)},
            last_used_at = NOW(),
            expires_at = ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
        WHERE id = ${session[0].id}
      `;

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      this.logger.error('Failed to refresh session', error);
      throw new Error('Session refresh failed');
    }
  }

  async revokeSession(sessionId: string): Promise<void> {
    try {
      await this.prisma.$executeRaw`
        DELETE FROM sessions WHERE id = ${sessionId}
      `;
      this.logger.info(`Session ${sessionId} revoked`);
    } catch (error) {
      this.logger.error('Failed to revoke session', error);
      throw new Error('Session revocation failed');
    }
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    try {
      await this.prisma.$executeRaw`
        DELETE FROM sessions WHERE user_id = ${userId}
      `;
      this.logger.info(`All sessions revoked for user ${userId}`);
    } catch (error) {
      this.logger.error('Failed to revoke user sessions', error);
      throw new Error('Session revocation failed');
    }
  }

  async cleanupExpiredSessions(): Promise<void> {
    try {
      const result = await this.prisma.$executeRaw`
        DELETE FROM sessions WHERE expires_at < NOW()
      `;
      this.logger.info(`Cleaned up ${result} expired sessions`);
    } catch (error) {
      this.logger.error('Failed to cleanup sessions', error);
    }
  }

  async getUserSessions(userId: string): Promise<Session[]> {
    try {
      return await this.prisma.$queryRaw<Session[]>`
        SELECT id, user_agent, ip_address, created_at, last_used_at
        FROM sessions
        WHERE user_id = ${userId}
        AND expires_at > NOW()
        ORDER BY last_used_at DESC
      `;
    } catch (error) {
      this.logger.error('Failed to get user sessions', error);
      return [];
    }
  }

  // Middleware to validate session
  async validateSession(sessionId: string): Promise<boolean> {
    try {
      const session = await this.prisma.$queryRaw<Session[]>`
        SELECT * FROM sessions
        WHERE id = ${sessionId}
        AND expires_at > NOW()
        LIMIT 1
      `;

      if (session.length > 0) {
        // Update last used timestamp
        await this.prisma.$executeRaw`
          UPDATE sessions 
          SET last_used_at = NOW()
          WHERE id = ${sessionId}
        `;
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error('Failed to validate session', error);
      return false;
    }
  }
}