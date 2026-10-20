import {
  Banknote,
  Briefcase,
  CalendarClock,
  Clock,
  Mail,
  MapPin,
  Send,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  formatDate,
  formatSalary,
  timeAgo,
  translateValue,
} from "@/lib/format";
import type { Job } from "@/lib/jobs-api";

interface JobDetailProps {
  job: Job | null;
  onClose: () => void;
}

function telegramUrl(handle: string) {
  return handle.startsWith("http")
    ? handle
    : `https://t.me/${handle.replace(/^@/, "")}`;
}

const JobDetail = ({ job, onClose }: JobDetailProps) => {
  const { t, i18n } = useTranslation();
  const lng = i18n.resolvedLanguage ?? "km";

  return (
    <Sheet open={job !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        closeLabel={t("detail.close")}
        className="w-full gap-0 p-0 sm:max-w-xl"
      >
        {job && (
          <>
            <SheetHeader className="gap-4 border-b p-6 text-left">
              <div className="flex items-start gap-3 pr-8">
                <div className="min-w-0">
                  <SheetTitle className="text-lg font-semibold tracking-tight">
                    {job.title}
                  </SheetTitle>
                  <SheetDescription>{job.company}</SheetDescription>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <Badge className="rounded-md">
                  {t(`type.${job.employmentType}`)}
                </Badge>
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  {job.location
                    ? translateValue(t, "location", job.location.name)
                    : ""}
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="size-4" />
                  {translateValue(t, "category", job.category)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4" />
                  {timeAgo(job.createdAt, t, lng)}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground">
                <Banknote className="size-4" />
                <span className="tabular text-base font-semibold">
                  {formatSalary(job.salary, t, lng)}
                </span>
                {job.salary &&
                  (job.salary.min !== undefined ||
                    job.salary.max !== undefined) && (
                    <span className="font-normal opacity-70">
                      {t("salary.perMonth")}
                    </span>
                  )}
              </div>
            </SheetHeader>

            <ScrollArea className="min-h-0 flex-1">
              <div className="space-y-6 p-6">
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold tracking-tight">
                    {t("detail.description")}
                  </h3>
                  <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                    {job.description}
                  </p>
                </section>

                {job.requirements.length > 0 && (
                  <>
                    <Separator />
                    <section className="space-y-3">
                      <h3 className="text-sm font-semibold tracking-tight">
                        {t("detail.requirements")}
                      </h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {job.requirements.map((r, i) => (
                          <li key={i} className="flex gap-2.5">
                            <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground/60" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </>
                )}

                {job.deadline && (
                  <>
                    <Separator />
                    <section className="space-y-3">
                      <h3 className="text-sm font-semibold tracking-tight">
                        {t("detail.deadline")}
                      </h3>
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarClock className="size-4 text-primary" />
                        {formatDate(job.deadline, lng)}
                      </p>
                    </section>
                  </>
                )}
              </div>
            </ScrollArea>

            <div className="space-y-2 border-t p-4">
              <p className="text-xs font-medium text-muted-foreground">
                {t("detail.howToApply")}
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                {job.apply.email && (
                  <a
                    href={`mailto:${job.apply.email}?subject=${encodeURIComponent(job.title)}`}
                    className={cn(buttonVariants(), "h-11 flex-1")}
                  >
                    <Mail /> {t("detail.applyEmail")}
                  </a>
                )}
                {job.apply.telegram && (
                  <a
                    href={telegramUrl(job.apply.telegram)}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      buttonVariants({
                        variant: job.apply.email ? "outline" : "default",
                      }),
                      "h-11 flex-1",
                    )}
                  >
                    <Send /> {t("detail.applyTelegram")}
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default JobDetail;
