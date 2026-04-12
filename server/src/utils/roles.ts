import { Roles } from "../types/auth.types";

export const roles: Roles = {
  admin: {
    can: ['create', 'edit', 'delete', 'view'],
  },
  user: {
    can: ['create', 'edit', 'view'],
  }
};