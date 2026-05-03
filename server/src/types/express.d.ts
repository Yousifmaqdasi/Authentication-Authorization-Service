import { Permission } from "./auth.types";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        permissions?: Permission[];
        isVerified: boolean;
      };
    }
  }
}

export {};