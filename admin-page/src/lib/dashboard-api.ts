import { api } from "./api";

export type Pair = { name: string; count: number };

export type RecentJob = {
  id: string;
  title: string;
  company: string;
  location: { name?: string } | null;
  employmentType: string;
  status: "OPEN" | "CLOSED";
  deadline: string | null;
  createdAt: string;
};

export type Dashboard = {
  jobs: {
    total: number;
    open: number;
    closed: number;
    expiringIn7Days: number;
    byEmploymentType: Pair[];
    byCategory: Pair[];
    createdPerMonth: { month: string; count: number }[];
  };
  recentJobs: RecentJob[];
};

export const fetchDashboard = () =>
  api.get<{ data: Dashboard }>("/dashboard").then((r) => r.data.data);
