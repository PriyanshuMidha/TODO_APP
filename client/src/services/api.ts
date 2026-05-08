import { API_BASE_URL } from "../utils/constants";

export class ApiError extends Error {
  status: number;
  requestUrl: string;

  constructor(message: string, status: number, requestUrl: string) {
    super(message);
    this.status = status;
    this.requestUrl = requestUrl;
  }
}

export const apiRequest = async <T>(
  path: string,
  init: RequestInit = {}
): Promise<T> => {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  const requestUrl = `${API_BASE_URL}${path}`;
  console.log(
    path === "/tasks" && (!init.method || init.method === "GET")
      ? "Fetching tasks from:"
      : "API request:",
    requestUrl
  );

  let response: Response;

  try {
    response = await fetch(requestUrl, {
      ...init,
      headers
    });
  } catch (error) {
    console.error("API request failed:", {
      path,
      requestUrl,
      status: 0,
      message: error instanceof Error ? error.message : "Failed to fetch"
    });
    throw new ApiError(
      error instanceof Error ? error.message : "Failed to fetch",
      0,
      requestUrl
    );
  }

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
    throw new ApiError(
      data?.message ?? "Request failed",
      response.status,
      requestUrl
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};
