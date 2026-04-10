import { Roles } from "../types/role.types";

export const roles: Roles = {
  admin: {
    can: ['create', 'edit', 'delete', 'view'],
  },
  user: {
    can: ['create', 'edit', 'view'],
  },
  viewer: {
    can: ['view'],
  },
};