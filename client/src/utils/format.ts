import type { Task } from "../types";

export const formatDateLabel = (value?: string | null) => {
  if (!value) {
    return "No date";
  }

  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric"
  });
};

export const getPriorityTone = (priority: Task["priority"]) => {
  switch (priority) {
    case "urgent":
      return "text-danger";
    case "high":
      return "text-warning";
    case "low":
      return "text-textSecondary";
    default:
      return "text-accent";
  }
};

export const getStatusLabel = (status: Task["status"]) =>
  status.replace("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
