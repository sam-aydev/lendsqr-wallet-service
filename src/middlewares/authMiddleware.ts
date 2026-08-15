import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

// Extend the Express Request type to include our user object
export interface AuthRequest extends Request {
  user?: { id: string };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized: No token provided", 401));
  }

  const token = authHeader.split(" ")[1].trim();

  if (!token) {
    return next(new AppError("Unauthorized: Invalid token format", 401));
  }

  // Attach the user ID to the request object
  req.user = { id: token };

  next();
};
