import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shell } from "@/components/Shell";
import { ErrorBanner, Field, PageHeader, btnGhost, btnPrimary, field } from "@/components/ui";
import { errorMessage } from "@/lib/api";
import { usersApi } from "@/lib/resources";
import { toast } from "@/store/toast";

export default function UserCreatePage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      await usersApi.create({
        firstName: String(f.get("firstName")).trim(),
        lastName: String(f.get("lastName")).trim(),
        email: String(f.get("email")).trim(),
        password: String(f.get("password")),
      });
      toast.ok("Admin created.");
      navigate("/users");
    } catch (err) {
      setError(errorMessage(err, "Couldn't create the account."));
      setBusy(false);
    }
  };

  return (
    <Shell>
      <PageHeader title="New admin" description="They can sign in right away and manage jobs and other admins." />
      <form onSubmit={submit} className="mt-6 max-w-xl space-y-5" noValidate>
        {error && <ErrorBanner message={error} />}
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="First name" htmlFor="firstName"><input id="firstName" name="firstName" required className={field} /></Field>
          <Field label="Last name" htmlFor="lastName"><input id="lastName" name="lastName" required className={field} /></Field>
        </div>
        <Field label="Email" htmlFor="email"><input id="email" name="email" type="email" autoComplete="off" required className={field} /></Field>
        <Field label="Password" htmlFor="password" hint="8 to 72 characters. Share it with them securely.">
          <input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} maxLength={72} className={field} />
        </Field>
        <div className="flex gap-3 border-t pt-6">
          <button type="submit" disabled={busy} className={btnPrimary}>{busy && <Loader2 className="size-4 animate-spin" aria-hidden />}{busy ? "Creating…" : "Create admin"}</button>
          <Link to="/users" className={btnGhost}>Cancel</Link>
        </div>
      </form>
    </Shell>
  );
}
