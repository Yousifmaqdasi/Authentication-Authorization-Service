import { Request, Response, NextFunction } from "express";

export function requireVerified(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    return res.status(401).send("Unauthorized");
  }

  if (!req.user.isVerified) {
    return res.status(403).send("Please verify your email first");
  }

  next();
}
