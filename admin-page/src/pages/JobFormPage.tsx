import { Loader2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Shell } from "@/components/Shell";
import { ErrorBanner, Field, PageHeader, Skeleton, btnGhost, btnPrimary, field } from "@/components/ui";
import { errorMessage } from "@/lib/api";
import { typeLabel } from "@/lib/format";
import { jobsApi, locationsApi } from "@/lib/resources";
import { EMPLOYMENT_TYPES, type Job, type Location } from "@/lib/types";
import { toast } from "@/store/toast";

const toDateInput = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("en-CA") : "");

export default function JobFormPage() {
  const { id } = useParams();
  const editing = !!id;
  const navigate = useNavigate();
  const seed = (useLocation().state as { job?: Job } | null)?.job;

  const [job, setJob] = useState<Job | null>(seed ?? null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    locationsApi.list().then(setLocations).catch((e) => setLoadError(errorMessage(e, "Couldn't load locations.")));
  }, []);

  useEffect(() => {
    if (!editing || job) return;
    jobsApi.get(id!).then(setJob).catch(() =>
      setLoadError("Couldn't load this job. Closed jobs can only be edited by opening them from the Jobs list."),
    );
  }, [editing, id, job]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();

    const min = get("min"), max = get("max");
    const salary = min || max ? { ...(min ? { min: Number(min) } : {}), ...(max ? { max: Number(max) } : {}), currency: "USD" } : undefined;
    const apply = { ...(get("email") ? { email: get("email") } : {}), ...(get("telegram") ? { telegram: get("telegram") } : {}) };
    const body: Record<string, unknown> = {
      title: get("title"),
      company: get("company"),
      category: get("category"),
      location: get("location"),
      employmentType: get("employmentType"),
      description: get("description"),
      requirements: get("requirements").split("\n").map((l) => l.trim()).filter(Boolean),
      apply,
      ...(salary ? { salary } : {}),
    };
    const date = get("deadline");
    // The API rejects past deadlines, so an unchanged one is left out of edits.
    if (!editing || date !== toDateInput(job?.deadline ?? null)) {
      body.deadline = date ? new Date(`${date}T23:59:59`).toISOString() : null;
    }
    if (editing) body.status = get("status");

    setBusy(true);
    setError("");
    try {
      if (editing) await jobsApi.update(id!, body);
      else await jobsApi.create(body);
      toast.ok(editing ? "Job updated." : "Job posted.");
      navigate("/jobs");
    } catch (err) {
      setError(errorMessage(err, "Couldn't save the job."));
      setBusy(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const ready = (!editing || !!job) && locations.length > 0;
  const d = job;

  return (
    <Shell>
      <PageHeader title={editing ? "Edit job" : "New job"} description={editing ? undefined : "Seekers see pay and how to apply first, so fill those in."} />

      <div className="mt-6 max-w-3xl">
        {loadError && <div className="mb-4"><ErrorBanner message={loadError} /></div>}
        {!ready && !loadError ? (
          <div className="space-y-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
        ) : ready ? (
          <form onSubmit={submit} className="space-y-6" noValidate>
            {error && <ErrorBanner message={error} />}

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Job title" htmlFor="title"><input id="title" name="title" required defaultValue={d?.title} className={field} /></Field>
              <Field label="Company" htmlFor="company"><input id="company" name="company" required defaultValue={d?.company} className={field} /></Field>
              <Field label="Location" htmlFor="location">
                <select id="location" name="location" required defaultValue={d?.location?.id ?? ""} className={field}>
                  <option value="" disabled>Choose a location</option>
                  {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </Field>
              <Field label="Employment type" htmlFor="employmentType">
                <select id="employmentType" name="employmentType" defaultValue={d?.employmentType ?? "FULL_TIME"} className={field}>
                  {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{typeLabel(t)}</option>)}
                </select>
              </Field>
              <Field label="Category" htmlFor="category"><input id="category" name="category" required defaultValue={d?.category} placeholder="e.g. Sales" className={field} /></Field>
              <Field label="Application deadline" htmlFor="deadline" hint={editing ? "Leave unchanged to keep the current deadline." : "Must be in the future."}>
                <input id="deadline" name="deadline" type="date" required defaultValue={toDateInput(d?.deadline ?? null)} className={field} />
              </Field>
            </div>

            <fieldset className="grid gap-5 sm:grid-cols-2">
              <legend className="mb-3 text-sm font-medium">Monthly salary (USD)</legend>
              <Field label="Minimum" htmlFor="min"><input id="min" name="min" type="number" min={0} inputMode="numeric" defaultValue={d?.salary?.min} className={field} /></Field>
              <Field label="Maximum" htmlFor="max"><input id="max" name="max" type="number" min={0} inputMode="numeric" defaultValue={d?.salary?.max} className={field} /></Field>
              <p className="text-xs text-muted-foreground sm:col-span-2">Leave both empty to show "Negotiable".</p>
            </fieldset>

            <fieldset className="grid gap-5 sm:grid-cols-2">
              <legend className="mb-3 text-sm font-medium">How to apply (at least one)</legend>
              <Field label="Email" htmlFor="email"><input id="email" name="email" type="email" defaultValue={d?.apply.email} className={field} /></Field>
              <Field label="Telegram" htmlFor="telegram"><input id="telegram" name="telegram" defaultValue={d?.apply.telegram} placeholder="@username or https://t.me/…" className={field} /></Field>
            </fieldset>

            <Field label="Description" htmlFor="description">
              <textarea id="description" name="description" required rows={7} defaultValue={d?.description} className={`${field} h-auto py-2.5 leading-relaxed`} />
            </Field>
            <Field label="Requirements" htmlFor="requirements" hint="One per line.">
              <textarea id="requirements" name="requirements" rows={5} defaultValue={d?.requirements.join("\n")} className={`${field} h-auto py-2.5 leading-relaxed`} />
            </Field>

            {editing && (
              <Field label="Status" htmlFor="status" hint="Jobs past their deadline always show as closed.">
                <select id="status" name="status" defaultValue={d?.status} className={`${field} sm:w-48`}>
                  <option value="OPEN">Open</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </Field>
            )}

            <div className="flex gap-3 border-t pt-6">
              <button type="submit" disabled={busy} className={btnPrimary}>
                {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
                {busy ? "Saving…" : editing ? "Save changes" : "Post job"}
              </button>
              <Link to="/jobs" className={btnGhost}>Cancel</Link>
            </div>
          </form>
        ) : null}
      </div>
    </Shell>
  );
}
