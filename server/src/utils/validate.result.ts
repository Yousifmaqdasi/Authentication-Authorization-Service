import { ZodSafeParseResult } from "zod";
import { NextFunction } from "express";

export function handleValidationResult<T>(
  result: ZodSafeParseResult<T>,
  next: NextFunction,
) {
  if (!result.success) {
    next({
      status: 400,
      message: result.error.issues[0].message,
    });
    return;
  }

  return result.data;
}
