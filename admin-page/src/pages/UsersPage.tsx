import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shell } from "@/components/Shell";
import { ConfirmButton, ErrorBanner, PageHeader, Pager, Skeleton, btnPrimary, field, iconBtn } from "@/components/ui";
import { errorMessage } from "@/lib/api";
import { fmtDate, fullName } from "@/lib/format";
import { useDebounced } from "@/lib/hooks";
import { usersApi } from "@/lib/resources";
import type { Page, User } from "@/lib/types";
import { useAuth } from "@/store/auth";
import { toast } from "@/store/toast";

export default function UsersPage() {
  const me = useAuth((s) => s.user);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
  const q = useDebounced(search);
  const [res, setRes] = useState<Page<User> | null>(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      setRes(await usersApi.list({ page, limit: 15, search: q }));
    } catch (e) {
      setError(errorMessage(e, "Couldn't load users."));
    }
  }, [page, q]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (u: User) => {
    setBusyId(u.id);
    try {
      await usersApi.remove(u.id);
      toast.ok("User deleted.");
      await load();
    } catch (e) {
      toast.error(errorMessage(e, "Couldn't delete this user."));
    } finally {
      setBusyId("");
    }
  };

  return (
    <Shell>
      <PageHeader title="Users" description="Everyone with an account here is an admin. Seekers don't need one."
        actions={<Link to="/users/new" className={btnPrimary}><Plus className="size-4" />New admin</Link>}
      />

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative min-w-52 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input type="search" aria-label="Search users" placeholder="Search name or email" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className={`${field} pl-9`} />
        </div>
      </div>

      <div className="mt-4">
        {error && !res ? (
          <ErrorBanner message={error} onRetry={load} />
        ) : (
          <div className="overflow-x-auto rounded-xl border bg-card">
            {!res ? (
              <div className="space-y-3 p-5">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-6 w-full" />)}</div>
            ) : res.data.length === 0 ? (
              <p className="p-10 text-center text-sm text-muted-foreground">No admins match this search.</p>
            ) : (
              <table className="w-full min-w-[40rem] text-left text-sm">
                <thead className="border-b text-xs text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">User</th>
                    <th scope="col" className="px-3 py-3 font-medium">Joined</th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {res.data.map((u) => (
                    <tr key={u.id} className="transition-colors hover:bg-muted/50">
                      <td className="px-5 py-3">
                        <p className="font-medium">{fullName(u)}{u.id === me?.id && <span className="ml-2 text-xs font-normal text-muted-foreground">(you)</span>}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </td>
                      <td className="tabular whitespace-nowrap px-3 py-3 text-muted-foreground">{fmtDate(u.createdAt)}</td>
                      <td className="px-5 py-2">
                        <div className="flex items-center justify-end gap-0.5">
                          <button type="button" className={iconBtn} aria-label="Edit user" title="Edit user" onClick={() => navigate(`/users/${u.id}/edit`, { state: { user: u } })}><Pencil className="size-4" /></button>
                          {u.id !== me?.id && <ConfirmButton label="Delete user" busy={busyId === u.id} onConfirm={() => remove(u)}><Trash2 className="size-4" /></ConfirmButton>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        {res && <Pager p={res.pagination} onPage={setPage} />}
      </div>
    </Shell>
  );
}
