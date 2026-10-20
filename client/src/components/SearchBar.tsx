import { useState } from "react"
import { Banknote, Briefcase, MapPin, Search, SlidersHorizontal } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatNumber, translateValue } from "@/lib/format"
import { DEFAULT_FILTERS, SALARY_RANGES, type Filters } from "@/lib/filters"
import { useLocations } from "@/hooks/use-locations"
import { EMPLOYMENT_TYPES } from "@/lib/jobs-api"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  filters: Filters
  onChange: (next: Filters) => void
  total: number | null
}

const SearchBar = ({ filters, onChange, total }: SearchBarProps) => {
  const { t, i18n } = useTranslation()
  const lng = i18n.resolvedLanguage ?? "km"
  const [open, setOpen] = useState(false)
  const locations = useLocations()
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch })

  const active = (["location", "type", "salary"] as const).filter((k) => filters[k] !== DEFAULT_FILTERS[k]).length

  const locationItems = [
    { value: "all", label: t("search.allLocations") },
    ...locations.map((l) => ({ value: l.slug, label: translateValue(t, "location", l.name) })),
  ]
  const typeItems = [
    { value: "all", label: t("search.allTypes") },
    ...EMPLOYMENT_TYPES.map((v) => ({ value: v, label: t(`type.${v}`) })),
  ]
  const salaryItems = Object.keys(SALARY_RANGES).map((v) => ({ value: v, label: t(`salaryRange.${v}`) }))

  return (
    <form role="search" onSubmit={(e) => e.preventDefault()} className="space-y-3">
      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            enterKeyHint="search"
            value={filters.query}
            onChange={(e) => set({ query: e.target.value })}
            placeholder={t("search.placeholder")}
            aria-label={t("search.label")}
            className="h-12 bg-card pr-3 pl-11 text-base shadow-sm md:text-base"
          />
        </div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="job-filters"
          aria-label={active > 0 ? t("search.filtersCount", { n: formatNumber(active, lng) }) : t("search.filters")}
          className={cn(
            "flex h-12 shrink-0 items-center gap-2 rounded-lg border bg-card px-4 text-sm font-medium shadow-sm transition-colors hover:bg-secondary",
            (open || active > 0) && "border-primary text-primary",
          )}
        >
          <SlidersHorizontal className="size-5" />
          <span className="hidden sm:inline">{t("search.filters")}</span>
          {active > 0 && (
            <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {formatNumber(active, lng)}
            </span>
          )}
        </button>
      </div>

      <div id="job-filters" hidden={!open} className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Select items={locationItems} value={filters.location} onValueChange={(v) => set({ location: v as string })}>
          <SelectTrigger aria-label={t("search.location")} className="h-11 w-full bg-card">
            <MapPin className="text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {locationItems.map((i) => (
              <SelectItem key={i.value} value={i.value}>
                {i.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select items={typeItems} value={filters.type} onValueChange={(v) => set({ type: v as string })}>
          <SelectTrigger aria-label={t("search.type")} className="h-11 w-full bg-card">
            <Briefcase className="text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {typeItems.map((i) => (
              <SelectItem key={i.value} value={i.value}>
                {i.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select items={salaryItems} value={filters.salary} onValueChange={(v) => set({ salary: v as string })}>
          <SelectTrigger aria-label={t("search.salary")} className="h-11 w-full bg-card">
            <Banknote className="text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {salaryItems.map((i) => (
              <SelectItem key={i.value} value={i.value}>
                {i.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex min-h-6 items-center justify-between gap-4 text-sm text-muted-foreground" aria-live="polite">
        <span className="tabular font-medium text-foreground">
          {total !== null && t("jobs.count", { count: total, n: formatNumber(total, lng) })}
        </span>
        {(active > 0 || filters.query) && (
          <button type="button" onClick={() => onChange(DEFAULT_FILTERS)} className="flex h-11 items-center px-1 text-primary underline-offset-4 hover:underline">
            {t("jobs.clear")}
          </button>
        )}
      </div>
    </form>
  )
}

export default SearchBar
