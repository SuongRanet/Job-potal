import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Shell } from "@/components/Shell";
import { ErrorBanner, Field, PageHeader, btnPrimary, field } from "@/components/ui";
import { errorMessage } from "@/lib/api";
import { usersApi } from "@/lib/resources";
import { useAuth } from "@/store/auth";
import { toast } from "@/store/toast";

export default function AccountPage() {
  const user = useAuth((s) => s.user)!;
  const [profileErr, setProfileErr] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [busy, setBusy] = useState<"" | "profile" | "pw">("");

  const saveProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy("profile");
    setProfileErr("");
    try {
      const u = await usersApi.updateMe({
        firstName: String(f.get("firstName")).trim(),
        lastName: String(f.get("lastName")).trim(),
        email: String(f.get("email")).trim(),
      });
      useAuth.setState({ user: { ...user, ...u } });
      toast.ok("Profile updated.");
    } catch (err) {
      setProfileErr(errorMessage(err, "Couldn't save your profile."));
    } finally {
      setBusy("");
    }
  };

  const savePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setBusy("pw");
    setPwErr("");
    try {
      await usersApi.changePassword({ currentPassword: String(f.get("currentPassword")), newPassword: String(f.get("newPassword")) });
      form.reset();
      toast.ok("Password changed.");
    } catch (err) {
      setPwErr(errorMessage(err, "Couldn't change your password."));
    } finally {
      setBusy("");
    }
  };

  return (
    <Shell>
      <PageHeader title="Account" description="Your own admin profile and password." />
      <div className="mt-8 max-w-xl space-y-12">
        <form onSubmit={saveProfile} className="space-y-5" noValidate>
          <h2 className="text-base font-semibold">Profile</h2>
          {profileErr && <ErrorBanner message={profileErr} />}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="First name" htmlFor="firstName"><input id="firstName" name="firstName" required defaultValue={user.firstName} className={field} /></Field>
            <Field label="Last name" htmlFor="lastName"><input id="lastName" name="lastName" required defaultValue={user.lastName} className={field} /></Field>
          </div>
          <Field label="Email" htmlFor="email"><input id="email" name="email" type="email" required defaultValue={user.email} className={field} /></Field>
          <button type="submit" disabled={busy !== ""} className={btnPrimary}>{busy === "profile" && <Loader2 className="size-4 animate-spin" aria-hidden />}Save profile</button>
        </form>

        <form onSubmit={savePassword} className="space-y-5 border-t pt-10" noValidate>
          <h2 className="text-base font-semibold">Change password</h2>
          {pwErr && <ErrorBanner message={pwErr} />}
          <Field label="Current password" htmlFor="currentPassword"><input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" required className={field} /></Field>
          <Field label="New password" htmlFor="newPassword" hint="8 to 72 characters."><input id="newPassword" name="newPassword" type="password" autoComplete="new-password" required minLength={8} maxLength={72} className={field} /></Field>
          <button type="submit" disabled={busy !== ""} className={btnPrimary}>{busy === "pw" && <Loader2 className="size-4 animate-spin" aria-hidden />}Change password</button>
        </form>
      </div>
    </Shell>
  );
}
