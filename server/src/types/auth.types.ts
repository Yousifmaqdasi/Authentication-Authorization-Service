import { Request } from "express";
import { PERMISSIONS } from "../config/permissions";

export type Permission = typeof PERMISSIONS [keyof typeof PERMISSIONS]

export interface AuthRequest extends Request {
  user?: {
    id: number;
    permissions?: Permission[]
  };
}

