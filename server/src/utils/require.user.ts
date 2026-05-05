import { Request } from "express";
import { AppError } from "./custom.error";

export function requireUser(
  req: Request,
): asserts req is Request & { user: { id: number } } {
  if (!req.user) throw new AppError("Unauthorized", 401);
}
