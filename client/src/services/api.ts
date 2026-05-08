import { API_BASE_URL } from "../utils/constants";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const apiRequest = async <T>(
  path: string,
  init: RequestInit = {}
): Promise<T> => {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  const requestUrl = `${API_BASE_URL}${path}`;

  const response = await fetch(requestUrl, {
    ...init,
    headers
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;
    console.error("API request failed:", {
      path,
      requestUrl,
      status: response.status,
      message: data?.message ?? "Request failed"
    });
    throw new ApiError(data?.message ?? "Request failed", response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};
