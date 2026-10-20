import { useState } from "react"
import { AlertCircle, SearchX } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import JobCard from "@/components/JobCard"
import JobDetail from "@/components/JobDetail"
import SearchBar from "@/components/SearchBar"
import { useJobs } from "@/hooks/use-jobs"
import { DEFAULT_FILTERS, type Filters } from "@/lib/filters"
import type { Job } from "@/lib/jobs-api"

const JobsPage = ({ initialQuery }: { initialQuery: string }) => {
  const { t } = useTranslation()
  const [filters, setFilters] = useState<Filters>({ ...DEFAULT_FILTERS, query: initialQuery })
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Job | null>(null)
  const [reload, setReload] = useState(0)
  const { jobs, pagination, loading, error } = useJobs(filters, page, reload)

  const updateFilters = (next: Filters) => {
    setFilters(next)
    setPage(1)
  }

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-6 pb-4 sm:px-6 sm:pt-10">
        <h1 className="mb-4 text-2xl font-semibold tracking-tight sm:mb-6 sm:text-4xl">{t("hero.title")}</h1>
        <SearchBar filters={filters} onChange={updateFilters} total={error ? null : (pagination?.total ?? null)} />
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-2 pb-10 sm:px-6">
        <h2 className="sr-only">{t("jobs.heading")}</h2>

        {error ? (
          <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed p-10">
            <AlertCircle className="size-6 text-destructive" />
            <div>
              <p className="font-medium">{t("jobs.loadError")}</p>
              <p className="text-sm text-muted-foreground">{t("jobs.loadErrorHint")}</p>
            </div>
            <Button variant="outline" onClick={() => setReload((n) => n + 1)}>
              {t("jobs.retry")}
            </Button>
          </div>
        ) : loading && jobs.length === 0 ? (
          <div className="grid gap-4 md:grid-cols-2" aria-busy>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-44 animate-pulse rounded-lg border bg-muted/50" />
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <>
            <div className={`grid gap-4 transition-opacity md:grid-cols-2 ${loading ? "opacity-60" : ""}`}>
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} onSelect={setSelected} />
              ))}
            </div>
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between gap-4">
                <Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  {t("jobs.prev")}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {t("jobs.page", { page: pagination.page, total: pagination.totalPages })}
                </span>
                <Button variant="outline" disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)}>
                  {t("jobs.next")}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed p-10">
            <SearchX className="size-6 text-muted-foreground" />
            <div>
              <p className="font-medium">{t("jobs.emptyTitle")}</p>
              <p className="text-sm text-muted-foreground">{t("jobs.emptyHint")}</p>
            </div>
            <Button variant="outline" onClick={() => updateFilters(DEFAULT_FILTERS)}>
              {t("jobs.clear")}
            </Button>
          </div>
        )}
      </section>

      <JobDetail job={selected} onClose={() => setSelected(null)} />
    </>
  )
}

export default JobsPage
