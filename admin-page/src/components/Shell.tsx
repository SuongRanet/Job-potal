import { Briefcase, LayoutDashboard, LogOut, UserCog, Users, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Brand } from "./Brand";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/store/auth";

const NAV: { to: string; label: string; icon: LucideIcon; end?: boolean }[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/users", label: "Users", icon: Users },
  { to: "/account", label: "Account", icon: UserCog },
];

export function Shell({ children }: { children: ReactNode }) {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const name = user ? `${user.firstName} ${user.lastName}`.trim() : "";
  const initials = user ? `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase() : "";

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="hidden flex-col border-r bg-sidebar lg:sticky lg:top-0 lg:flex lg:h-dvh">
        <div className="px-5 pb-4 pt-5"><Brand /></div>
        <nav aria-label="Main" className="flex flex-col gap-0.5 px-3">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex h-9 items-center gap-2.5 rounded-lg px-3 text-sm font-medium transition-colors ${
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`
              }
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto flex items-center gap-3 border-t p-4">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">{initials}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <ThemeToggle className="size-8" />
          <button type="button" onClick={logout} aria-label="Sign out" className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <LogOut className="size-4" />
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="border-b bg-sidebar lg:hidden">
          <div className="flex h-14 items-center justify-between px-4">
            <Brand />
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <button type="button" onClick={logout} aria-label="Sign out" className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
          <nav aria-label="Main" className="flex gap-1 overflow-x-auto px-3 pb-2">
            {NAV.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `h-8 shrink-0 rounded-lg px-3 text-sm font-medium leading-8 ${isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </header>
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8 sm:py-9">{children}</div>
      </div>
    </div>
  );
}
