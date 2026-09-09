import type { NextFunction, Request, Response } from "express";

import { HttpError } from "../utils/http-error.js";

/**
 * Last link of the Express chain: turns any error into a JSON response the
 * client can act upon.
 */
export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const status = error instanceof HttpError ? error.status : 500;
  if (status >= 500) {
    console.error("[api] unexpected error", error);
  }

  res.status(status).json({
    error: status >= 500 ? "Internal server error." : (error as Error).message,
  });
};
