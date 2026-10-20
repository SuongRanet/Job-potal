import { Loader2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Shell } from "@/components/Shell";
import { ErrorBanner, Field, PageHeader, Skeleton, btnGhost, btnPrimary, field } from "@/components/ui";
import { errorMessage } from "@/lib/api";
import { usersApi } from "@/lib/resources";
import type { User } from "@/lib/types";
import { toast } from "@/store/toast";

export default function UserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>((useLocation().state as { user?: User } | null)?.user ?? null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) return;
    usersApi.get(id!).then(setUser).catch((e) => setError(errorMessage(e, "Couldn't load this user.")));
  }, [id, user]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      await usersApi.update(id!, {
        firstName: String(f.get("firstName")).trim(),
        lastName: String(f.get("lastName")).trim(),
        email: String(f.get("email")).trim(),
      });
      toast.ok("User updated.");
      navigate("/users");
    } catch (err) {
      setError(errorMessage(err, "Couldn't save changes."));
      setBusy(false);
    }
  };

  return (
    <Shell>
      <PageHeader title="Edit user" />
      <div className="mt-6 max-w-xl">
        {error && <div className="mb-4"><ErrorBanner message={error} /></div>}
        {!user && !error ? (
          <div className="space-y-4">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
        ) : user ? (
          <form onSubmit={submit} className="space-y-5" noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="First name" htmlFor="firstName"><input id="firstName" name="firstName" required defaultValue={user.firstName} className={field} /></Field>
              <Field label="Last name" htmlFor="lastName"><input id="lastName" name="lastName" required defaultValue={user.lastName} className={field} /></Field>
            </div>
            <Field label="Email" htmlFor="email"><input id="email" name="email" type="email" required defaultValue={user.email} className={field} /></Field>
            <div className="flex gap-3 border-t pt-6">
              <button type="submit" disabled={busy} className={btnPrimary}>{busy && <Loader2 className="size-4 animate-spin" aria-hidden />}{busy ? "Saving…" : "Save changes"}</button>
              <Link to="/users" className={btnGhost}>Cancel</Link>
            </div>
          </form>
        ) : null}
      </div>
    </Shell>
  );
}
