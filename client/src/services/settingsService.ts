import type { Settings } from "../types";
import { apiRequest } from "./api";

export const settingsService = {
  get: () => apiRequest<{ settings: Settings }>("/settings"),
  update: (payload: Partial<Settings>) =>
    apiRequest<{ settings: Settings }>("/settings", {
      method: "PUT",
      body: JSON.stringify(payload)
    })
};
