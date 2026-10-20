import type { Job } from "@/lib/jobs-api";

type T = (key: string, o?: Record<string, unknown>) => string;

const KHMER_DIGITS = "០១២៣៤៥៦៧៨៩";
const KHMER_MONTHS = [
  "មករា",
  "កុម្ភៈ",
  "មីនា",
  "មេសា",
  "ឧសភា",
  "មិថុនា",
  "កក្កដា",
  "សីហា",
  "កញ្ញា",
  "តុលា",
  "វិច្ឆិកា",
  "ធ្នូ",
];

// Khmer UI shows Khmer numerals. Mapped by hand because Intl has no Khmer locale data in many browsers.
export const toKhmerDigits = (s: string) =>
  s.replace(/\d/g, (d) => KHMER_DIGITS[Number(d)]);

export function formatNumber(n: number, lng: string) {
  const out = new Intl.NumberFormat("en-US").format(n);
  return lng === "km" ? toKhmerDigits(out) : out;
}

export function formatMoney(n: number, currency: string, lng: string) {
  const symbol = currency === "USD" ? "$" : `${currency} `;
  return `${symbol}${formatNumber(n, lng)}`;
}

export function formatSalary(salary: Job["salary"], t: T, lng: string) {
  if (!salary || (salary.min === undefined && salary.max === undefined))
    return t("salary.negotiable");
  const cur = salary.currency || "USD";
  if (salary.min !== undefined && salary.max !== undefined) {
    return `${formatMoney(salary.min, cur, lng)} – ${formatMoney(salary.max, cur, lng)}`;
  }
  if (salary.min !== undefined)
    return t("salary.from", { amount: formatMoney(salary.min, cur, lng) });
  return t("salary.upTo", { amount: formatMoney(salary.max!, cur, lng) });
}

export function timeAgo(iso: string, t: T, lng: string) {
  const diffSec = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  const units: [string, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, secs] of units) {
    if (diffSec >= secs) {
      const count = Math.floor(diffSec / secs);
      return t(`time.${unit}`, { count, n: formatNumber(count, lng) });
    }
  }
  return t("time.now");
}

export function formatDate(iso: string, lng: string) {
  const d = new Date(iso);
  if (lng !== "km")
    return new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(d);
  return toKhmerDigits(
    `${d.getDate()} ${KHMER_MONTHS[d.getMonth()]} ${d.getFullYear()}`,
  );
}

// Whole days until the deadline (0 = today), or null when there is none or it has passed
export function daysUntil(iso: string | null) {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return null;
  return Math.ceil(ms / 86400000) - 1;
}

export const DEADLINE_SOON_DAYS = 7;

// Translate a free-text API value (location, category) when we have a label; otherwise show it as-is
export const translateValue = (
  t: T,
  group: "location" | "category",
  value: string,
) => t(`${group}.${value}`, { defaultValue: value });
