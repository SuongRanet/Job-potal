import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: import.meta.env.API_URL ?? "/api/v1",
  withCredentials: true,
});

const NO_RETRY = ["/auth/login", "/auth/refresh", "/auth/logout"];

type Retryable = InternalAxiosRequestConfig & { _retried?: boolean };

// The access token lives 15 minutes in an httpOnly cookie. On a 401, try the
// refresh cookie once and replay the request. Login, refresh and logout are never
// retried; /auth/me is, so a reload after expiry restores the session.
api.interceptors.response.use(undefined, async (error: AxiosError) => {
  const config = error.config as Retryable | undefined;
  if (
    error.response?.status === 401 &&
    config &&
    !config._retried &&
    !NO_RETRY.some((u) => config.url?.startsWith(u))
  ) {
    config._retried = true;
    try {
      await api.post("/auth/refresh");
      return api(config);
    } catch {
      /* fall through to the original 401 */
    }
  }
  return Promise.reject(error);
});

export function errorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    if (!error.response)
      return "Can't reach the server. Check your connection and try again.";
    const data = error.response.data as
      | { message?: string; errors?: unknown }
      | undefined;
    if (
      Array.isArray(data?.errors) &&
      data.errors.length &&
      data.errors.every((x) => typeof x === "string")
    )
      return (data.errors as string[]).join(" · ");
    if (data?.message) return data.message;
  }
  return fallback;
}
