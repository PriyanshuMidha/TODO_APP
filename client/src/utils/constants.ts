import type { TaskPriority, TaskStatus } from "../types";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

export const sidebarItems = [
  { label: "Today", path: "/app/today" },
  { label: "All Tasks", path: "/app/tasks" },
  { label: "Pinned", path: "/app/pinned" },
  { label: "Settings", path: "/app/settings" }
];

export const taskStatuses: { label: string; value: TaskStatus }[] = [
  { label: "Todo", value: "todo" },
  { label: "In Progress", value: "in_progress" },
  { label: "Done", value: "done" },
  { label: "Cancelled", value: "cancelled" }
];

export const taskPriorities: { label: string; value: TaskPriority }[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent" }
];
