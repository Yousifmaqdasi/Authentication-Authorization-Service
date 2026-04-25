import { Request } from "express";

export type Role = "admin" | "user" | "editor";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: Role;
  };
}

