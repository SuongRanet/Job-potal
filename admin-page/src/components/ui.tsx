import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useToast } from "@/store/toast";
import type { Pagination } from "@/lib/types";
import { num } from "@/lib/format";

export const field =
  "h-10 w-full rounded-lg border border-input bg-card px-3 text-sm placeholder:text-muted-foreground/70 transition-colors hover:border-muted-foreground/50 focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-0 disabled:opacity-60";
export const btn =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-[filter,background-color,transform] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50";
export const btnPrimary = `${btn} bg-primary text-primary-foreground shadow-sm hover:brightness-110`;
export const btnGhost = `${btn} border bg-card hover:bg-secondary`;
export const btnDanger = `${btn} bg-destructive text-white hover:brightness-110`;
export const iconBtn =
  "grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-40";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Field({ label, htmlFor, hint, children }: { label: string; htmlFor: string; hint?: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex items-start gap-3 rounded-xl border bg-card p-4 text-sm">
      <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
      <p className="flex-1">{message}</p>
      {onRetry && <button type="button" onClick={onRetry} className="font-medium text-primary hover:underline">Try again</button>}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-[shimmer_1.4s_ease-in-out_infinite] rounded-md bg-muted ${className}`} />;
}

export function Pager({ p, onPage }: { p: Pagination; onPage: (n: number) => void }) {
  if (p.total === 0) return null;
  const from = (p.page - 1) * p.limit + 1;
  const to = Math.min(p.total, p.page * p.limit);
  return (
    <div className="flex items-center justify-between gap-3 px-1 pt-4 text-sm text-muted-foreground">
      <span className="tabular">{num(from)}–{num(to)} of {num(p.total)}</span>
      <div className="flex items-center gap-1">
        <button type="button" className={iconBtn} aria-label="Previous page" disabled={p.page <= 1} onClick={() => onPage(p.page - 1)}><ChevronLeft className="size-4" /></button>
        <span className="tabular px-1">{p.page} / {Math.max(1, p.totalPages)}</span>
        <button type="button" className={iconBtn} aria-label="Next page" disabled={p.page >= p.totalPages} onClick={() => onPage(p.page + 1)}><ChevronRight className="size-4" /></button>
      </div>
    </div>
  );
}

export function Toaster() {
  const { items, drop } = useToast();
  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-end gap-2" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className="pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-lg border bg-card px-3.5 py-3 text-sm shadow-lg">
          {t.kind === "ok" ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden /> : <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />}
          <p className="flex-1">{t.text}</p>
          <button type="button" onClick={() => drop(t.id)} aria-label="Dismiss" className="text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
        </div>
      ))}
    </div>
  );
}

export function Pill({ tone, children }: { tone: "ok" | "warn" | "off" | "info"; children: ReactNode }) {
  const cls = { ok: "bg-success/15 text-success", warn: "bg-warning/15 text-warning", off: "bg-muted text-muted-foreground", info: "bg-accent text-accent-foreground" }[tone];
  return (
    <span className={`inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-xs font-medium ${cls}`}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />{children}
    </span>
  );
}

/** Two-step delete: first click arms the button, second confirms. */
export function ConfirmButton({ label, confirmLabel = "Confirm delete", onConfirm, busy, children }: { label: string; confirmLabel?: string; onConfirm: () => void; busy?: boolean; children: ReactNode }) {
  return <ConfirmInner {...{ label, confirmLabel, onConfirm, busy }}>{children}</ConfirmInner>;
}
function ConfirmInner({ label, confirmLabel, onConfirm, busy, children }: { label: string; confirmLabel: string; onConfirm: () => void; busy?: boolean; children: ReactNode }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(t);
  }, [armed]);
  return armed ? (
    <button type="button" disabled={busy} onClick={() => { setArmed(false); onConfirm(); }} className="h-8 whitespace-nowrap rounded-lg bg-destructive px-2.5 text-xs font-medium text-white hover:brightness-110 disabled:opacity-50">{confirmLabel}</button>
  ) : (
    <button type="button" aria-label={label} title={label} disabled={busy} onClick={() => setArmed(true)} className={`${iconBtn} hover:text-destructive`}>{children}</button>
  );
}
