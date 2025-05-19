import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'development-refresh-secret';

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
  sessionId?: string;
}

export class TokenManager {
  // Generate secure access token
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '15m', // Short-lived access token
      issuer: 'claudeosaar',
      audience: 'claudeosaar-api',
    });
  }

  // Generate secure refresh token
  static generateRefreshToken(payload: TokenPayload): string {
    const sessionId = crypto.randomBytes(32).toString('hex');
    return jwt.sign({ ...payload, sessionId }, REFRESH_SECRET, {
      expiresIn: '7d', // Longer-lived refresh token
      issuer: 'claudeosaar',
      audience: 'claudeosaar-refresh',
    });
  }

  // Verify access token
  static verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, JWT_SECRET, {
        issuer: 'claudeosaar',
        audience: 'claudeosaar-api',
      }) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  // Verify refresh token
  static verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, REFRESH_SECRET, {
        issuer: 'claudeosaar',
        audience: 'claudeosaar-refresh',
      }) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  // Generate CSRF token
  static generateCSRFToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Verify CSRF token
  static verifyCSRFToken(token: string, sessionToken: string): boolean {
    // In production, compare with stored session CSRF token
    return token === sessionToken;
  }

  // Generate secure API key
  static generateAPIKey(): string {
    const prefix = 'sk-ant';
    const randomBytes = crypto.randomBytes(32).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    return `${prefix}-${randomBytes}`;
  }

  // Hash API key for storage
  static hashAPIKey(apiKey: string): string {
    return crypto.createHash('sha256').update(apiKey).digest('hex');
  }

  // Validate API key format
  static validateAPIKeyFormat(apiKey: string): boolean {
    const pattern = /^sk-ant-[A-Za-z0-9_-]{40,}$/;
    return pattern.test(apiKey);
  }

  // Generate secure workspace ID
  static generateWorkspaceId(): string {
    const timestamp = Date.now().toString(36);
    const random = crypto.randomBytes(16).toString('hex');
    return `ws_${timestamp}_${random}`;
  }

  // Generate secure session ID
  static generateSessionId(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Time-based OTP for 2FA
  static generateTOTP(secret: string, window = 0): string {
    const time = Math.floor(Date.now() / 30000) + window;
    const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'base32'));
    hmac.update(Buffer.from(time.toString(16).padStart(16, '0'), 'hex'));
    const hash = hmac.digest();
    const offset = hash[hash.length - 1] & 0xf;
    const code = (
      ((hash[offset] & 0x7f) << 24) |
      ((hash[offset + 1] & 0xff) << 16) |
      ((hash[offset + 2] & 0xff) << 8) |
      (hash[offset + 3] & 0xff)
    ) % 1000000;
    return code.toString().padStart(6, '0');
  }
}