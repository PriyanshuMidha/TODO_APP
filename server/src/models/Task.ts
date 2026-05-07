import { Schema, model } from "mongoose";

export const TASK_STATUSES = [
  "todo",
  "in_progress",
  "done",
  "cancelled"
] as const;

export const TASK_PRIORITIES = ["low", "medium", "high", "urgent"] as const;

export interface Subtask {
  title: string;
  completed: boolean;
  order: number;
}

export interface TaskDocument {
  title: string;
  description: string;
  notes: string;
  status: (typeof TASK_STATUSES)[number];
  priority: (typeof TASK_PRIORITIES)[number];
  dueDate?: Date | null;
  dueTime?: string | null;
  reminderEnabled: boolean;
  reminderAt?: Date | null;
  reminderBeforeMinutes?: number | null;
  pinned: boolean;
  tags: string[];
  subtasks: Subtask[];
  completedAt?: Date | null;
  archivedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const subtaskSchema = new Schema<Subtask>(
  {
    title: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  },
  { _id: false }
);

const taskSchema = new Schema<TaskDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    notes: { type: String, default: "" },
    status: { type: String, enum: TASK_STATUSES, default: "todo" },
    priority: { type: String, enum: TASK_PRIORITIES, default: "medium" },
    dueDate: { type: Date, default: null },
    dueTime: { type: String, default: null },
    reminderEnabled: { type: Boolean, default: false },
    reminderAt: { type: Date, default: null },
    reminderBeforeMinutes: { type: Number, default: null },
    pinned: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    subtasks: { type: [subtaskSchema], default: [] },
    completedAt: { type: Date, default: null },
    archivedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export const Task = model<TaskDocument>("Task", taskSchema);
