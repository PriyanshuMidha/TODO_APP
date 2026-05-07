import type { Task } from "../types";
import { apiRequest } from "./api";

export const taskService = {
  list: () => apiRequest<{ tasks: Task[] }>("/tasks"),
  today: () => apiRequest<{ tasks: Task[] }>("/tasks/today"),
  overdue: () => apiRequest<{ tasks: Task[] }>("/tasks/overdue"),
  pinned: () => apiRequest<{ tasks: Task[] }>("/tasks/pinned"),
  create: (payload: Partial<Task> & Pick<Task, "title">) =>
    apiRequest<{ task: Task }>("/tasks", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  update: (id: string, payload: Partial<Task>) =>
    apiRequest<{ task: Task }>(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    }),
  updateStatus: (id: string, status: Task["status"]) =>
    apiRequest<{ task: Task }>(`/tasks/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    }),
  updatePin: (
    id: string,
    pinned: boolean
  ) =>
    apiRequest<{ task: Task }>(`/tasks/${id}/pin`, {
      method: "PATCH",
      body: JSON.stringify({ pinned })
    }),
  remove: (id: string) =>
    apiRequest<void>(`/tasks/${id}`, {
      method: "DELETE"
    })
};
