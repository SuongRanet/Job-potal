import { api } from "./api";
import type { Job, Location, Page, User } from "./types";

type Params = Record<string, string | number | undefined>;
const clean = (p: Params) => Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined && v !== ""));

export const jobsApi = {
  list: (p: Params) => api.get<Page<Job>>("/jobs/manage", { params: clean(p) }).then((r) => r.data),
  // Only OPEN jobs are readable by id; the edit page prefers the row passed from the list.
  get: (id: string) => api.get<{ data: Job }>(`/jobs/${id}`).then((r) => r.data.data),
  create: (body: unknown) => api.post<{ data: Job }>("/jobs", body).then((r) => r.data.data),
  update: (id: string, body: unknown) => api.patch<{ data: Job }>(`/jobs/${id}`, body).then((r) => r.data.data),
  remove: (id: string) => api.delete(`/jobs/${id}`),
};

export const usersApi = {
  list: (p: Params) => api.get<Page<User>>("/users", { params: clean(p) }).then((r) => r.data),
  get: (id: string) => api.get<{ data: User }>(`/users/${id}`).then((r) => r.data.data),
  create: (body: unknown) => api.post<{ data: User }>("/users", body).then((r) => r.data.data),
  update: (id: string, body: unknown) => api.patch<{ data: User }>(`/users/${id}`, body).then((r) => r.data.data),
  remove: (id: string) => api.delete(`/users/${id}`),
  updateMe: (body: unknown) => api.patch<{ data: User }>("/users/me", body).then((r) => r.data.data),
  changePassword: (body: { currentPassword: string; newPassword: string }) => api.patch("/users/me/password", body),
};

export const locationsApi = {
  list: () => api.get<{ data: Location[] }>("/locations").then((r) => r.data.data),
};
