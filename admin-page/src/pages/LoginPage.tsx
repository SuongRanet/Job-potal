import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Brand } from "@/components/Brand";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/store/auth";

export default function LoginPage() {
  const user = useAuth((s) => s.user);
  const login = useAuth((s) => s.login);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (user) return <Navigate to="/" replace />;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (busy) return;

    setBusy(true);
    setError("");

    try {
      await login(email.trim(), password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  const field =
    "block h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <main className="relative flex min-h-dvh flex-col bg-muted/30 px-4 py-6 sm:px-6">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Brand />
        <ThemeToggle />
      </header>

      {/* Login Section */}
      <section className="flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
            {/* Title */}
            <div className="mb-7 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Welcome back
              </h1>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Sign in to access your Job Portal account.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="space-y-5">
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-md border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"
                >
                  <AlertCircle
                    className="mt-0.5 size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <p>{error}</p>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="username"
                  inputMode="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={busy}
                  placeholder="name@example.com"
                  aria-invalid={!!error}
                  aria-describedby={error ? "login-error" : undefined}
                  className={field}
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={show ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={busy}
                    placeholder="Enter your password"
                    aria-invalid={!!error}
                    className={`${field} pr-11`}
                  />

                  <button
                    type="button"
                    onClick={() => setShow((value) => !value)}
                    disabled={busy}
                    aria-label={show ? "Hide password" : "Show password"}
                    aria-pressed={show}
                    className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                  >
                    {show ? (
                      <EyeOff className="size-4" aria-hidden="true" />
                    ) : (
                      <Eye className="size-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={busy || !email.trim() || !password}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy && (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                )}

                {busy ? "Signing in..." : "Sign in"}
              </button>
            </form>

            {/* Footer Note */}
            
          </div>

          {/* Copyright */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Job Portal. All rights reserved.
          </p>
        </div>
      </section>
    </main>
  );
}
