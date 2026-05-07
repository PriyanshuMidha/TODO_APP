import { Request, Response } from "express";
import { Settings } from "../models/Settings";

const ensureSettings = async () => {
  const existing = await Settings.findOne();

  if (existing) {
    return existing;
  }

  return Settings.create({
    theme: "dark",
    defaultReminderBeforeMinutes: 15
  });
};

export const getSettings = async (_req: Request, res: Response) => {
  const settings = await ensureSettings();
  res.json({ settings });
};

export const updateSettings = async (req: Request, res: Response) => {
  const current = await ensureSettings();
  const settings = await Settings.findByIdAndUpdate(current._id, req.body, {
    new: true,
    runValidators: true
  });

  res.json({ settings });
};
