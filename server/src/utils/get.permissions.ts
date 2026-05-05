import { ROLE_PERMISSIONS } from "../config/permissions";

export const getPermissions = (role: string) => {
  return ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS] || [];
};
