import { Request } from "express";

export interface RoleRequest extends Request {
    user: {
        role: string
    }
}

export type Roles = {
  admin: {can: string[]}
  editor: {can: string[]}
  viewer: {can: string[]}
}