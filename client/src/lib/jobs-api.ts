import { api } from "@/lib/axios"
import type { Location } from "@/lib/locations-api"

export const EMPLOYMENT_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"] as const
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number]

export interface Job {
  id: string
  title: string
  description: string
  company: string
  location: Location | null
  salary?: { min?: number; max?: number; currency: string }
  employmentType: EmploymentType
  category: string
  requirements: string[]
  apply: { email?: string; telegram?: string }
  deadline: string | null
  status: "OPEN" | "CLOSED"
  createdAt: string
  updatedAt: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface JobsQuery {
  page?: number
  limit?: number
  search?: string
  location?: string // location slug
  employmentType?: EmploymentType
  minSalary?: number
  maxSalary?: number
}

export async function fetchJobs(query: JobsQuery, signal?: AbortSignal) {
  const { data } = await api.get<{ data: Job[]; pagination: Pagination }>("/jobs", {
    params: query,
    signal,
  })
  return data
}
