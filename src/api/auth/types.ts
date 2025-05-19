import { Request } from 'express';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  apiKey?: string;
  subscription: {
    tier: 'free' | 'pro' | 'enterprise';
    limits: {
      memory: number;
      cpu: number;
      storage: number;
    };
  };
}

export interface AuthRequest extends Request {
  user: AuthUser;
}