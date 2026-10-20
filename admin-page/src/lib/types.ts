export type Pagination = { page: number; limit: number; total: number; totalPages: number };
export type Page<T> = { data: T[]; pagination: Pagination };

export const EMPLOYMENT_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"] as const;
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

export type Location = { id: string; name: string; slug: string; type: "capital" | "province" };

export type Job = {
  id: string;
  title: string;
  description: string;
  company: string;
  location: Location | null;
  salary?: { min?: number; max?: number; currency?: string };
  employmentType: EmploymentType;
  category: string;
  requirements: string[];
  apply: { email?: string; telegram?: string };
  deadline: string | null;
  status: "OPEN" | "CLOSED";
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};
