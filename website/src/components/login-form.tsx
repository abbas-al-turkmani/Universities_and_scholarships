"use client";

import { useState, type FormEvent } from "react";
import { Eye, EyeOff, LoaderCircle, MoveUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

import type { Locale } from "@/domain/model";
import type { Dictionary } from "@/lib/i18n";

export function LoginForm({
  locale,
  text,
  redirectTo,
}: {
  locale: Locale;
  text: Dictionary;
  redirectTo: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });
      if (!response.ok) {
        setError(locale === "ar" ? "البريد الإلكتروني أو كلمة المرور غير صحيحة." : "The email or password is incorrect.");
        return;
      }
      const result: unknown = await response.json();
      const role = result && typeof result === "object" && "role" in result ? result.role : undefined;
      const destination = role === "ADMIN" || role === "SUPER_ADMIN"
        ? `/${locale}/dashboard/admin`
        : role === "REVIEWER"
          ? `/${locale}/dashboard/reviewer`
          : redirectTo;
      router.push(destination);
      router.refresh();
    } catch {
      setError(locale === "ar" ? "تعذر تسجيل الدخول. حاول مرة أخرى." : "Unable to sign in. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <label>{text.auth.email}<input autoComplete="email" name="email" placeholder="you@example.com" required type="email" /></label>
      <label>{text.auth.password}<span className="password-input"><input autoComplete="current-password" minLength={8} name="password" placeholder="••••••••" required type={showPassword ? "text" : "password"} /><button aria-label={showPassword ? "Hide password" : "Show password"} className="password-toggle" onClick={() => setShowPassword(!showPassword)} type="button">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-primary auth-submit" disabled={pending} type="submit">{pending ? <LoaderCircle className="spin" size={17} /> : null}{text.auth.signIn}<MoveUpRight size={16} /></button>
    </form>
  );
}
