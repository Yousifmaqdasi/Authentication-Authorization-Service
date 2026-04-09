import { Roles } from "../types/role.types";

export const roles: Roles = {
  admin: {
    can: ['create', 'edit', 'delete', 'view'],
  },
  editor: {
    can: ['create', 'edit', 'view'],
  },
  viewer: {
    can: ['view'],
  },
};