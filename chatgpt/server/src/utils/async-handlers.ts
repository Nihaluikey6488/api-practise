import { NextFunction, Request, Response } from "express";
import { errorMonitor } from "node:events";

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err) => {
      console.log("Error in asynHandler:", err);
      next(errorMonitor);
    });
  };
}
