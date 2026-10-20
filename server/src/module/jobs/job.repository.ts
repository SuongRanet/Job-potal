import type { QueryFilter } from "mongoose";
import Job from "./job.model.js";
import type { IJob } from "./job.model.js";
import type { CreateJobInput, UpdateJobInput } from "./job.schema.js";

export const createJobRepository = async (
  data: CreateJobInput & { employer: string },
) => {
  const job = await Job.create(data);
  return job.populate("location");
};

export const listJobsRepository = async (
  filter: QueryFilter<IJob>,
  skip: number,
  limit: number,
) => {
  return Job.find(filter).populate("location").sort({ createdAt: -1 }).skip(skip).limit(limit);
};

export const countJobsRepository = async (filter: QueryFilter<IJob>) => {
  return Job.countDocuments(filter);
};

export const findJobByIdRepository = async (id: string) => {
  return Job.findById(id).populate("location");
};

export const updateJobRepository = async (id: string, data: UpdateJobInput) => {
  return Job.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate("location");
};

export const deleteJobRepository = async (id: string) => {
  return Job.findByIdAndDelete(id);
};
