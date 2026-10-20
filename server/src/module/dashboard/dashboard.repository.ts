import Job from "../jobs/job.model.js";

export const countJobs = (filter: Record<string, unknown> = {}) =>
  Job.countDocuments(filter);

export const countJobsBy = (field: "employmentType" | "category", limit: number) =>
  Job.aggregate<{ _id: string; count: number }>([
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
  ]);

export const jobsPerMonth = (since: Date) =>
  Job.aggregate<{ _id: { year: number; month: number }; count: number }>([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
  ]);

export const recentJobs = (limit: number) =>
  Job.find().sort({ createdAt: -1 }).limit(limit);
