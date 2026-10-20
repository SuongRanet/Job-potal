import type { QueryFilter } from "mongoose";
import type { IJob } from "./job.model.js";
import type { ILocation } from "../locations/location.model.js";
import {
  findLocationByIdRepository,
  findLocationBySlugRepository,
} from "../locations/location.repository.js";
import { toPublicLocation } from "../locations/location.service.js";
import {
  countJobsRepository,
  createJobRepository,
  deleteJobRepository,
  findJobByIdRepository,
  listJobsRepository,
  updateJobRepository,
} from "./job.repository.js";
import type {
  CreateJobInput,
  ListJobsQuery,
  UpdateJobInput,
} from "./job.schema.js";

export class JobError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "JobError";
  }
}

const isExpired = (job: Pick<IJob, "deadline">) =>
  job.deadline != null && job.deadline.getTime() <= Date.now();

// A job past its deadline counts as CLOSED even if never manually closed.
const effectiveStatus = (job: Pick<IJob, "deadline" | "status">): IJob["status"] =>
  job.status === "OPEN" && isExpired(job) ? "CLOSED" : job.status;

// The repository layer populates `location`, so at runtime it is a Location doc.
export const toPublicJob = (job: IJob) => {
  const location = job.location as unknown as ILocation | null;
  return {
    id: job._id,
    title: job.title,
    description: job.description,
    company: job.company,
    location: location ? toPublicLocation(location) : null,
    salary: job.salary,
    employmentType: job.employmentType,
    category: job.category,
    requirements: job.requirements,
    apply: job.apply,
    deadline: job.deadline ?? null,
    employer: job.employer,
    status: effectiveStatus(job),
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  };
};

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildFilter = async (query: ListJobsQuery): Promise<QueryFilter<IJob>> => {
  const filter: QueryFilter<IJob> = {};
  if (query.category) filter.category = new RegExp(`^${escapeRegex(query.category)}$`, "i");
  if (query.location) {
    const location = await findLocationBySlugRepository(query.location);
    // Unknown slug matches nothing instead of silently returning every job.
    filter.location = location?._id ?? null;
  }
  if (query.employmentType) filter.employmentType = query.employmentType;
  const notExpired = [{ deadline: null }, { deadline: { $gt: new Date() } }];
  if (query.status === "OPEN") {
    filter.status = "OPEN";
    filter.$and = [{ $or: notExpired }];
  } else if (query.status === "CLOSED") {
    filter.$or = [{ status: "CLOSED" }, { deadline: { $lte: new Date() } }];
  }
  if (query.minSalary !== undefined) filter["salary.max"] = { $gte: query.minSalary };
  if (query.maxSalary !== undefined) filter["salary.min"] = { $lte: query.maxSalary };
  if (query.search) {
    const regex = new RegExp(escapeRegex(query.search), "i");
    filter.$and = [
      ...(filter.$and ?? []),
      { $or: [{ title: regex }, { company: regex }, { description: regex }] },
    ];
  }
  return filter;
};

const paginate = async (filter: QueryFilter<IJob>, query: ListJobsQuery) => {
  const skip = (query.page - 1) * query.limit;
  const [jobs, total] = await Promise.all([
    listJobsRepository(filter, skip, query.limit),
    countJobsRepository(filter),
  ]);
  return {
    jobs: jobs.map(toPublicJob),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
};

// Public listing: only OPEN jobs are ever visible.
export const listPublicJobsService = (query: ListJobsQuery) =>
  buildFilter({ ...query, status: "OPEN" }).then((f) => paginate(f, query));

// Admin view: every job, any status.
export const listAllJobsService = (query: ListJobsQuery) =>
  buildFilter(query).then((f) => paginate(f, query));

export const getPublicJobService = async (id: string) => {
  const job = await findJobByIdRepository(id);
  if (!job || effectiveStatus(job) !== "OPEN") throw new JobError("Job not found", 404);
  return toPublicJob(job);
};

const assertLocationExists = async (id: string) => {
  if (!(await findLocationByIdRepository(id))) {
    throw new JobError("Location not found", 400);
  }
};

export const createJobService = async (
  adminId: string,
  data: CreateJobInput,
) => {
  await assertLocationExists(data.location);
  const job = await createJobRepository({ ...data, employer: adminId });
  return toPublicJob(job);
};

export const updateJobService = async (id: string, data: UpdateJobInput) => {
  if (data.location) await assertLocationExists(data.location);
  const job = await updateJobRepository(id, data);
  if (!job) throw new JobError("Job not found", 404);
  return toPublicJob(job);
};

export const deleteJobService = async (id: string) => {
  const job = await deleteJobRepository(id);
  if (!job) throw new JobError("Job not found", 404);
};
