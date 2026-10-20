import { AlertCircle, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Shell } from "@/components/Shell";
import { ThemeToggle } from "@/components/ThemeToggle";
import { errorMessage } from "@/lib/api";
import {
  fetchDashboard,
  type Dashboard,
  type Pair,
  type RecentJob,
} from "@/lib/dashboard-api";
import { daysUntil, fmtDate, monthShort, num, typeLabel } from "@/lib/format";
import { useAuth } from "@/store/auth";

export default function DashboardPage() {
  const user = useAuth((s) => s.user);
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await fetchDashboard());
    } catch (e) {
      setError(errorMessage(e, "Couldn't load the dashboard."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Shell>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back, {user?.firstName}. Here's the state of the job board.
          </p>
        </div>
        <div className="hidden items-center gap-1 lg:flex">
          <button
            type="button"
            onClick={load}
            disabled={loading}
            aria-label="Refresh"
            className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <ThemeToggle />
        </div>
      </div>

      {error && !data ? (
        <div
          role="alert"
          className="mt-8 flex flex-col items-start gap-3 rounded-xl border bg-card p-5 sm:flex-row sm:items-center"
        >
          <AlertCircle
            className="size-5 shrink-0 text-destructive"
            aria-hidden
          />
          <p className="flex-1 text-sm">{error}</p>
          <button
            type="button"
            onClick={load}
            className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:brightness-110"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          <Stats data={data} />
          <div className="grid gap-x-10 gap-y-10 lg:grid-cols">
            <Monthly data={data} />
          </div>
          <Recent jobs={data?.recentJobs} />
        </div>
      )}
    </Shell>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-[shimmer_1.4s_ease-in-out_infinite] rounded-md bg-muted ${className}`}
    />
  );
}

function Stats({ data }: { data: Dashboard | null }) {
  const j = data?.jobs;
  const items = [
    {
      label: "Open now",
      value: j?.open,
      tone: "text-primary",
      hint: "Visible to seekers",
    },
    {
      label: "Closing in 7 days",
      value: j?.expiringIn7Days,
      tone: j?.expiringIn7Days ? "text-warning" : "",
      hint: "Open, with a deadline this week",
    },
    {
      label: "Closed",
      value: j?.closed,
      tone: "",
      hint: "Closed or past deadline",
    },
    { label: "All jobs", value: j?.total, tone: "", hint: "Ever posted" },
  ];
  return (
    <dl className="grid grid-cols-2 gap-y-6 divide-border sm:grid-cols-4 sm:divide-x">
      {items.map((it, i) => (
        <div
          key={it.label}
          className={`${i > 0 ? "sm:pl-6" : ""} ${i % 2 === 1 ? "pl-6 sm:pl-6" : ""}`}
        >
          <dt className="text-sm text-muted-foreground">{it.label}</dt>
          <dd
            className={`tabular mt-1 text-[2rem] font-semibold leading-none tracking-tight ${it.tone}`}
          >
            {it.value === undefined ? (
              <Skeleton className="h-8 w-14" />
            ) : (
              num(it.value)
            )}
          </dd>
          <p className="mt-2 text-xs text-muted-foreground">{it.hint}</p>
        </div>
      ))}
    </dl>
  );
}

function Monthly({ data }: { data: Dashboard | null }) {
  const rows = data?.jobs.createdPerMonth;
  const max = Math.max(1, ...(rows?.map((r) => r.count) ?? [0]));
  const empty = rows && rows.every((r) => r.count === 0);
  const total = rows?.reduce((a, r) => a + r.count, 0) ?? 0;

  return (
    <section aria-labelledby="monthly-h">
      <div className="flex items-baseline justify-between">
        <h2 id="monthly-h" className="text-base font-semibold">
          Jobs posted per month
        </h2>
        {rows && (
          <span className="tabular text-sm text-muted-foreground">
            {num(total)} in 6 months
          </span>
        )}
      </div>
      <div className="mt-5 rounded-xl border bg-card p-5">
        {!rows ? (
          <Skeleton className="h-48 w-full" />
        ) : empty ? (
          <div className="grid h-48 place-items-center text-center">
            <p className="max-w-[16rem] text-sm text-muted-foreground">
              No jobs posted in the last 6 months. New listings will chart here.
            </p>
          </div>
        ) : (
          <div
            className="flex h-48 items-end gap-2 sm:gap-4"
            role="img"
            aria-label={`Jobs posted per month: ${rows.map((r) => `${monthShort(r.month)} ${r.count}`).join(", ")}`}
          >
            {rows.map((r, i) => (
              <div
                key={r.month}
                className="flex h-full min-w-0 flex-1 flex-col justify-end"
              >
                <span className="tabular mb-1.5 text-center text-xs font-medium">
                  {r.count}
                </span>
                <div
                  className={`origin-bottom rounded-t-md ${i === rows.length - 1 ? "bg-primary" : "bg-primary/35"}`}
                  style={{
                    height: `${(r.count / max) * 100}%`,
                    minHeight: r.count ? 4 : 2,
                    animation: `bar-grow 600ms cubic-bezier(0.22,1,0.36,1) ${i * 40}ms backwards`,
                  }}
                />
                <span className="mt-2 text-center text-xs text-muted-foreground">
                  {monthShort(r.month)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Breakdown({
  title,
  rows,
  map = (s: string) => s,
}: {
  title: string;
  rows?: Pair[];
  map?: (s: string) => string;
}) {
  const max = Math.max(1, ...(rows?.map((r) => r.count) ?? [0]));
  return (
    <section>
      <h2 className="text-base font-semibold">{title}</h2>
      {!rows ? (
        <div className="mt-4 space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Nothing to break down yet.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows.map((r) => (
            <li key={r.name}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="truncate">{map(r.name)}</span>
                <span className="tabular font-medium">{num(r.count)}</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full origin-left rounded-full bg-primary"
                  style={{
                    width: `${(r.count / max) * 100}%`,
                    animation:
                      "bar-grow-x 600ms cubic-bezier(0.22,1,0.36,1) backwards",
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function StatusPill({ job }: { job: RecentJob }) {
  const left = daysUntil(job.deadline);
  const soon = job.status === "OPEN" && left !== null && left <= 7;
  const cls =
    job.status === "CLOSED"
      ? "bg-muted text-muted-foreground"
      : soon
        ? "bg-warning/15 text-warning"
        : "bg-success/15 text-success";
  return (
    <span
      className={`inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium ${cls}`}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {job.status === "CLOSED" ? "Closed" : soon ? "Closing soon" : "Open"}
    </span>
  );
}

function Recent({ jobs }: { jobs?: RecentJob[] }) {
  return (
    <section aria-labelledby="recent-h">
      <h2 id="recent-h" className="text-base font-semibold">
        Recently posted
      </h2>
      <div className="mt-4 overflow-x-auto rounded-xl border bg-card">
        {!jobs ? (
          <div className="space-y-3 p-5">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No jobs have been posted yet. The latest five will show here.
          </p>
        ) : (
          <table className="w-full min-w-160 text-left text-sm">
            <thead className="border-b text-xs text-muted-foreground">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">
                  Job
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Type
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Status
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Deadline
                </th>
                <th scope="col" className="px-5 py-3 text-right font-medium">
                  Posted
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {jobs.map((j) => (
                <tr key={j.id} className="transition-colors hover:bg-muted/50">
                  <td className="max-w-[18rem] px-5 py-3">
                    <p className="truncate font-medium">{j.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {j.company}
                      {j.location?.name ? ` · ${j.location.name}` : ""}
                    </p>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {typeLabel(j.employmentType)}
                  </td>
                  <td className="px-3 py-3">
                    <StatusPill job={j} />
                  </td>
                  <td className="tabular px-3 py-3 whitespace-nowrap text-muted-foreground">
                    {fmtDate(j.deadline)}
                  </td>
                  <td className="tabular px-5 py-3 text-right whitespace-nowrap text-muted-foreground">
                    {fmtDate(j.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
