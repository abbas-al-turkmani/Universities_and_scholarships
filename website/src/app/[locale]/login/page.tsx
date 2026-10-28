import type { Metadata } from "next";
import { getDictionary, type Locale } from "@/lib/i18n";
import { LoginForm } from "@/components/login-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "ar" ? "تسجيل الدخول" : "Sign in" };
}

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const [{ locale: candidate }, query] = await Promise.all([params, searchParams]);
  const locale = candidate as Locale;
  const text = getDictionary(locale);
  const redirectTo = query.next?.startsWith(`/${locale}/`) && !query.next.startsWith("//")
    ? query.next
    : `/${locale}/dashboard`;
  return <section className="auth-page"><div className="auth-card"><div className="auth-symbol"><span>m</span></div><div className="eyebrow"><span className="eyebrow-dot" />MANHAL STUDENT PORTAL</div><h1>{text.auth.welcome}</h1><p className="auth-description">{text.auth.description}</p><LoginForm locale={locale} text={text} redirectTo={redirectTo} /><div className="demo-box"><div><strong>{text.auth.demo}</strong><p>{text.auth.demoHelp}</p></div><code>student@example.com</code><code>Demo@1234</code></div><p className="auth-signup">{text.auth.noAccount} <a href={`/${locale}/dashboard`}>{text.auth.createAccount}</a></p></div><div className="auth-aside"><div className="auth-aside-orbit" /><span className="auth-aside-kicker">A future without borders</span><h2>“The beautiful thing about learning is that no one can take it away from you.”</h2><span className="auth-aside-author">B.B. King</span><div className="auth-aside-bottom">Good things take courage. <span>✦</span></div></div></section>;
}
