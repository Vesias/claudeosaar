import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Logger } from '../../utils/logger';

export interface LoginDto {
  email: string;
  password: string;
}

export interface SignupDto {
  email: string;
  password: string;
  name?: string;
}

export class AuthService {
  private prisma: PrismaClient;
  private logger: Logger;
  private jwtSecret: string;

  constructor() {
    this.prisma = new PrismaClient();
    this.logger = new Logger('AuthService');
    this.jwtSecret = process.env.JWT_SECRET || 'development-secret';
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email }
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const validPassword = await bcrypt.compare(dto.password, user.passwordHash);
      if (!validPassword) {
        throw new Error('Invalid credentials');
      }

      const token = this.generateToken(user);
      
      // Remove sensitive data
      const { passwordHash, ...userWithoutPassword } = user;

      return {
        token,
        user: userWithoutPassword
      };
    } catch (error) {
      this.logger.error('Login failed:', error);
      throw error;
    }
  }

  async signup(dto: SignupDto) {
    try {
      // Check if user exists
      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email }
      });

      if (existing) {
        throw new Error('Email already in use');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(dto.password, 10);

      // Create user
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          passwordHash,
          subscriptionTier: 'free',
          isActive: true,
        }
      });

      const token = this.generateToken(user);
      
      // Remove sensitive data
      const { passwordHash: _, ...userWithoutPassword } = user;

      return {
        token,
        user: userWithoutPassword
      };
    } catch (error) {
      this.logger.error('Signup failed:', error);
      throw error;
    }
  }

  async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;
      
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.id }
      });

      if (!user || !user.isActive) {
        throw new Error('Invalid token');
      }

      const { passwordHash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      this.logger.error('Token verification failed:', error);
      throw error;
    }
  }

  private generateToken(user: any) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role || 'user'
      },
      this.jwtSecret,
      { expiresIn: '7d' }
    );
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }
}