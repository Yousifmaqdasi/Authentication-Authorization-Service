import { Request } from "express";

export interface AuthRequest extends Request{
  user?: {
    id: number;
    role: string;
  }
}

export type Roles = {
  admin: {can: string[]}
  user: {can: string[]}
}