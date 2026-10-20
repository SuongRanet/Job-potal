const TYPE_LABEL: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};
export const typeLabel = (t: string) => TYPE_LABEL[t] ?? t;

const nf = new Intl.NumberFormat("en-US");
export const num = (n: number) => nf.format(n);

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });
export const fmtDate = (iso: string | null) => (iso ? dateFmt.format(new Date(iso)) : "No deadline");

const monthFmt = new Intl.DateTimeFormat("en-GB", { month: "short" });
export const monthShort = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return monthFmt.format(new Date(y, m - 1, 1));
};

export function daysUntil(iso: string | null) {
  if (!iso) return null;
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}

export const fullName = (u: { firstName: string; lastName: string }) => `${u.firstName} ${u.lastName}`.trim();
