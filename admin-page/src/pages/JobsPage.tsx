import { Lock, LockOpen, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shell } from "@/components/Shell";
import { ConfirmButton, ErrorBanner, PageHeader, Pager, Pill, Skeleton, btnPrimary, field, iconBtn } from "@/components/ui";
import { errorMessage } from "@/lib/api";
import { daysUntil, fmtDate, typeLabel } from "@/lib/format";
import { useDebounced } from "@/lib/hooks";
import { jobsApi } from "@/lib/resources";
import { EMPLOYMENT_TYPES, type Job, type Page } from "@/lib/types";
import { toast } from "@/store/toast";

export default function JobsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const q = useDebounced(search);

  const [res, setRes] = useState<Page<Job> | null>(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      setRes(await jobsApi.list({ page, limit: 15, search: q, status, employmentType: type }));
    } catch (e) {
      setError(errorMessage(e, "Couldn't load jobs."));
    }
  }, [page, q, status, type]);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (job: Job, fn: () => Promise<unknown>, ok: string) => {
    setBusyId(job.id);
    try {
      await fn();
      toast.ok(ok);
      await load();
    } catch (e) {
      toast.error(errorMessage(e, "That didn't work. Try again."));
    } finally {
      setBusyId("");
    }
  };

  const reset = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setPage(1);
  };

  return (
    <Shell>
      <PageHeader
        title="Jobs"
        description="Every listing, open or closed. Seekers only see open ones."
        actions={<Link to="/jobs/new" className={btnPrimary}><Plus className="size-4" />New job</Link>}
      />

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative min-w-52 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input type="search" aria-label="Search jobs" placeholder="Search title, company, description" value={search} onChange={(e) => reset(setSearch)(e.target.value)} className={`${field} pl-9`} />
        </div>
        <select aria-label="Status" value={status} onChange={(e) => reset(setStatus)(e.target.value)} className={`${field} w-auto`}>
          <option value="">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="CLOSED">Closed</option>
        </select>
        <select aria-label="Employment type" value={type} onChange={(e) => reset(setType)(e.target.value)} className={`${field} w-auto`}>
          <option value="">All types</option>
          {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{typeLabel(t)}</option>)}
        </select>
      </div>

      <div className="mt-4">
        {error && !res ? (
          <ErrorBanner message={error} onRetry={load} />
        ) : (
          <div className="overflow-x-auto rounded-xl border bg-card">
            {!res ? (
              <div className="space-y-3 p-5">{[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-6 w-full" />)}</div>
            ) : res.data.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-sm text-muted-foreground">
                  {q || status || type ? "No jobs match these filters." : "No jobs yet. Post the first one and it appears here."}
                </p>
                {!(q || status || type) && <Link to="/jobs/new" className={`${btnPrimary} mt-4`}><Plus className="size-4" />New job</Link>}
              </div>
            ) : (
              <table className="w-full min-w-[46rem] text-left text-sm">
                <thead className="border-b text-xs text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">Job</th>
                    <th scope="col" className="px-3 py-3 font-medium">Type</th>
                    <th scope="col" className="px-3 py-3 font-medium">Status</th>
                    <th scope="col" className="px-3 py-3 font-medium">Deadline</th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {res.data.map((j) => {
                    const left = daysUntil(j.deadline);
                    const expired = left !== null && left <= 0;
                    const soon = j.status === "OPEN" && left !== null && left <= 7;
                    return (
                      <tr key={j.id} className="transition-colors hover:bg-muted/50">
                        <td className="max-w-[20rem] px-5 py-3">
                          <p className="truncate font-medium">{j.title}</p>
                          <p className="truncate text-xs text-muted-foreground">{j.company}{j.location ? ` · ${j.location.name}` : ""}</p>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">{typeLabel(j.employmentType)}</td>
                        <td className="px-3 py-3">
                          {j.status === "OPEN" ? <Pill tone={soon ? "warn" : "ok"}>{soon ? "Closing soon" : "Open"}</Pill> : <Pill tone="off">{expired ? "Expired" : "Closed"}</Pill>}
                        </td>
                        <td className="tabular whitespace-nowrap px-3 py-3 text-muted-foreground">{fmtDate(j.deadline)}</td>
                        <td className="px-5 py-2">
                          <div className="flex items-center justify-end gap-0.5">
                            {j.status === "OPEN" ? (
                              <button type="button" className={iconBtn} aria-label="Close job" title="Close job" disabled={busyId === j.id} onClick={() => act(j, () => jobsApi.update(j.id, { status: "CLOSED" }), "Job closed.")}><Lock className="size-4" /></button>
                            ) : !expired ? (
                              <button type="button" className={iconBtn} aria-label="Reopen job" title="Reopen job" disabled={busyId === j.id} onClick={() => act(j, () => jobsApi.update(j.id, { status: "OPEN" }), "Job reopened.")}><LockOpen className="size-4" /></button>
                            ) : null}
                            <button type="button" className={iconBtn} aria-label="Edit job" title={expired ? "Edit, set a new deadline to reopen" : "Edit job"} onClick={() => navigate(`/jobs/${j.id}/edit`, { state: { job: j } })}><Pencil className="size-4" /></button>
                            <ConfirmButton label="Delete job" busy={busyId === j.id} onConfirm={() => act(j, () => jobsApi.remove(j.id), "Job deleted.")}><Trash2 className="size-4" /></ConfirmButton>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
        {res && <Pager p={res.pagination} onPage={setPage} />}
      </div>
    </Shell>
  );
}
