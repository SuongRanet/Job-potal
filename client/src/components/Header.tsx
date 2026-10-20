import { Building2, Briefcase, Moon, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { Theme } from "@/hooks/use-theme";

export type View = "jobs" | "companies";

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  view: View;
  onNavigate: (view: View) => void;
}

const LANGUAGES = [
  { code: "km", label: "ខ្មែរ" },
  { code: "en", label: "EN" },
];

const Header = ({ theme, onToggleTheme, view, onNavigate }: HeaderProps) => {
  const { t, i18n } = useTranslation();
  const current = i18n.resolvedLanguage ?? "km";
  const nav: { view: View; label: string; icon: LucideIcon }[] = [
    { view: "jobs", label: t("nav.jobs"), icon: Briefcase },
    { view: "companies", label: t("nav.companies"), icon: Building2 },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => onNavigate("jobs")}
            className="flex h-11 items-center gap-2 font-semibold tracking-tight"
          >
            <span
              aria-hidden
              className="flex size-10 items-center overflow-hidden justify-center rounded-full  text-lg leading-none text-primary-foreground"
            >
              <img  src="/logo.jpeg" alt="Company logo" />
            </span>
            {t("brand")}
          </button>

          <nav
            className="hidden items-center gap-1 sm:flex"
            aria-label={t("nav.main")}
          >
            {nav.map((item) => (
              <button
                key={item.view}
                type="button"
                onClick={() => onNavigate(item.view)}
                aria-current={view === item.view ? "page" : undefined}
                className="h-11 rounded-md px-4 text-sm whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:bg-accent aria-[current=page]:font-medium aria-[current=page]:text-accent-foreground"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <div
              role="group"
              aria-label={t("header.language")}
              className="flex rounded-full border bg-secondary p-0.5"
            >
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  lang={l.code}
                  aria-pressed={current === l.code}
                  onClick={() => i18n.changeLanguage(l.code)}
                  className={cn(
                    "h-11 min-w-12 rounded-full px-3 text-sm font-medium transition-colors",
                    current === l.code
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={
                theme === "dark" ? t("header.toLight") : t("header.toDark")
              }
              className="flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {theme === "dark" ? (
                <Sun className="size-5" />
              ) : (
                <Moon className="size-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      <nav
        aria-label={t("nav.main")}
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t bg-background pb-[env(safe-area-inset-bottom)] sm:hidden"
      >
        {nav.map((item) => (
          <button
            key={item.view}
            type="button"
            onClick={() => onNavigate(item.view)}
            aria-current={view === item.view ? "page" : undefined}
            className="flex h-14 flex-col items-center justify-center gap-0.5 text-xs text-muted-foreground aria-[current=page]:font-medium aria-[current=page]:text-primary"
          >
            <item.icon className="size-5" />
            {item.label}
          </button>
        ))}
      </nav>
    </>
  );
};

export default Header;
