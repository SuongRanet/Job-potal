import type { EmploymentType, JobsQuery } from "@/lib/jobs-api"

export interface Filters {
  query: string
  location: string // location slug, or "all"
  type: string
  salary: string
}

export const DEFAULT_FILTERS: Filters = { query: "", location: "all", type: "all", salary: "any" }

// Monthly salary in USD
export const SALARY_RANGES: Record<string, { min?: number; max?: number }> = {
  any: {},
  "0-300": { max: 300 },
  "300-600": { min: 300, max: 600 },
  "600-1000": { min: 600, max: 1000 },
  "1000+": { min: 1000 },
}

export function toQuery(f: Filters, page: number): JobsQuery {
  const range = SALARY_RANGES[f.salary] ?? {}
  return {
    page,
    limit: 10,
    search: f.query.trim() || undefined,
    location: f.location === "all" ? undefined : f.location,
    employmentType: f.type === "all" ? undefined : (f.type as EmploymentType),
    minSalary: range.min,
    maxSalary: range.max,
  }
}
