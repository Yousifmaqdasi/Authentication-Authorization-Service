import { Request } from "express";

export type Role = "admin" | "editor" | "user";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    role?: Role;
  };
}

