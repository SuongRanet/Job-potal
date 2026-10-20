import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatNumber, translateValue } from "@/lib/format";
import { fetchJobs, type Job } from "@/lib/jobs-api";

const CompaniesPage = ({
  onSelect,
}: {
  onSelect: (company: string) => void;
}) => {
  const { t, i18n } = useTranslation();
  const lng = i18n.resolvedLanguage ?? "km";
  const [jobs, setJobs] = useState<Job[] | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchJobs({ limit: 100 }, controller.signal)
      .then((res) => setJobs(res.data))
      .catch(() => !controller.signal.aborted && setJobs([]));
    return () => controller.abort();
  }, []);

  const companies = useMemo(() => {
    const map = new Map<string, { count: number; locations: Set<string> }>();
    for (const j of jobs ?? []) {
      const entry = map.get(j.company) ?? {
        count: 0,
        locations: new Set<string>(),
      };
      entry.count += 1;
      if (j.location) entry.locations.add(j.location.name);
      map.set(j.company, entry);
    }
    return [...map].sort((a, b) => b[1].count - a[1].count);
  }, [jobs]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">
        {t("companies.heading")}
      </h1>
      {jobs && companies.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("companies.empty")}</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map(([name, info]) => (
            <li key={name}>
              <button
                type="button"
                onClick={() => onSelect(name)}
                className="flex w-full items-center gap-3 rounded-lg border bg-card p-4 text-left transition-colors hover:border-primary/50 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold tracking-tight">
                    {name}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {t("companies.openRoles", {
                      count: info.count,
                      n: formatNumber(info.count, lng),
                    })}{" "}
                    ·{" "}
                    {[...info.locations]
                      .map((l) => translateValue(t, "location", l))
                      .join(", ")}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default CompaniesPage;
