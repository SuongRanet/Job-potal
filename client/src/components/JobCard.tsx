import { CalendarClock, Clock, Mail, MapPin, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import {
  DEADLINE_SOON_DAYS,
  daysUntil,
  formatNumber,
  formatSalary,
  timeAgo,
  translateValue,
} from "@/lib/format";
import type { Job } from "@/lib/jobs-api";

interface JobCardProps {
  job: Job;
  onSelect: (job: Job) => void;
}

const JobCard = ({ job, onSelect }: JobCardProps) => {
  const { t, i18n } = useTranslation();
  const lng = i18n.resolvedLanguage ?? "km";
  const days = daysUntil(job.deadline);
  const closingSoon = days !== null && days <= DEADLINE_SOON_DAYS;

  return (
    <article className="group relative flex min-w-0 flex-col gap-3 rounded-lg border bg-card p-4 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 hover:border-primary/50 sm:p-5">
      <div className="flex min-w-0 items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold tracking-tight wrap-break-word">
            <button
              type="button"
              onClick={() => onSelect(job)}
              className="text-left outline-none after:absolute after:inset-0 after:content-[''] group-hover:text-primary"
            >
              {job.title}
            </button>
          </h3>
          <p className="truncate text-sm text-muted-foreground">
            {job.company}
          </p>
        </div>
        <Badge variant="secondary" className="shrink-0 rounded-md">
          {t(`type.${job.employmentType}`)}
        </Badge>
      </div>

      <p className="tabular text-xl leading-tight font-semibold tracking-tight text-primary">
        {formatSalary(job.salary, t, lng)}
      </p>

      <p className="hidden line-clamp-2 text-sm text-muted-foreground sm:block">
        {job.description}
      </p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t pt-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <MapPin className="size-4" />
          {job.location ? translateValue(t, "location", job.location.name) : ""}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="size-4" />
          {timeAgo(job.createdAt, t, lng)}
        </span>
        <span className="ml-auto flex items-center gap-2">
          {job.apply.email && (
            <Mail
              role="img"
              aria-label={t("card.applyEmail")}
              className="size-4"
            />
          )}
          {job.apply.telegram && (
            <Send
              role="img"
              aria-label={t("card.applyTelegram")}
              className="size-4"
            />
          )}
        </span>
      </div>

      {closingSoon && (
        <p className="flex items-center gap-1.5 rounded-md bg-accent px-2.5 py-1.5 text-sm font-medium text-accent-foreground">
          <CalendarClock className="size-4" />
          {days === 0
            ? t("card.closesToday")
            : t("card.closesIn", { count: days, n: formatNumber(days!, lng) })}
        </p>
      )}
    </article>
  );
};

export default JobCard;
