import { Schema, model } from "mongoose";

export interface SettingsDocument {
  theme: string;
  defaultReminderBeforeMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new Schema<SettingsDocument>(
  {
    theme: { type: String, default: "dark", trim: true },
    defaultReminderBeforeMinutes: { type: Number, default: 15 }
  },
  { timestamps: true }
);

export const Settings = model<SettingsDocument>("Settings", settingsSchema);
