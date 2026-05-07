import { Response } from "express";

export const sendError = (
  res: Response,
  status: number,
  message: string
) => res.status(status).json({ message });
