import {
  countJobs,
  countJobsBy,
  jobsPerMonth,
  recentJobs,
} from "./dashboard.repository.js";
import { toPublicJob } from "../jobs/job.service.js";

const DAY = 24 * 60 * 60 * 1000;

export const getDashboardService = async () => {
  const now = new Date();
  const in7Days = new Date(now.getTime() + 7 * DAY);
  // First day of the month, 5 months back => 6 months including this one.
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  // Same rule as the jobs module: a job past its deadline counts as closed.
  const openFilter = {
    status: "OPEN",
    $or: [{ deadline: null }, { deadline: { $gt: now } }],
  };

  const [
    totalJobs,
    openJobs,
    expiringSoon,
    byEmploymentType,
    byCategory,
    monthly,
    latestJobs,
  ] = await Promise.all([
    countJobs(),
    countJobs(openFilter),
    countJobs({ status: "OPEN", deadline: { $gt: now, $lte: in7Days } }),
    countJobsBy("employmentType", 10),
    countJobsBy("category", 10),
    jobsPerMonth(sixMonthsAgo),
    recentJobs(5),
  ]);

  // Fill months with no jobs so the chart always has 6 points.
  const counts = new Map(
    monthly.map((m) => [`${m._id.year}-${m._id.month}`, m.count]),
  );
  const jobsByMonth = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    return {
      month: `${year}-${String(month).padStart(2, "0")}`,
      count: counts.get(`${year}-${month}`) ?? 0,
    };
  });

  const toPairs = (rows: { _id: string; count: number }[]) =>
    rows.map((r) => ({ name: r._id, count: r.count }));

  return {
    jobs: {
      total: totalJobs,
      open: openJobs,
      closed: totalJobs - openJobs,
      expiringIn7Days: expiringSoon,
      byEmploymentType: toPairs(byEmploymentType),
      byCategory: toPairs(byCategory),
      createdPerMonth: jobsByMonth,
    },
    recentJobs: latestJobs.map(toPublicJob),
  };
};
