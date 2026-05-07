export type TaskStatus = "todo" | "in_progress" | "done" | "cancelled";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Subtask {
  title: string;
  completed: boolean;
  order: number;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  notes: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  dueTime?: string | null;
  reminderEnabled: boolean;
  reminderAt?: string | null;
  reminderBeforeMinutes?: number | null;
  pinned: boolean;
  tags: string[];
  subtasks: Subtask[];
  completedAt?: string | null;
  archivedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  _id: string;
  theme: string;
  defaultReminderBeforeMinutes: number;
  createdAt: string;
  updatedAt: string;
}
