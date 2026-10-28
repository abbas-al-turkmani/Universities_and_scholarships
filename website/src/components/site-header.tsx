import Link from "next/link";
import { ArrowUpRight, GraduationCap, Languages } from "lucide-react";

import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/domain/model";

export function SiteHeader({
  locale,
  text,
}: {
  locale: Locale;
  text: Dictionary;
}) {
  const otherLocale = locale === "ar" ? "en" : "ar";

  return (
    <header className="site-header">
      <div className="container header-content">
        <Link aria-label={text.brand} className="brand" href={`/${locale}`}>
          <span className="brand-mark"><GraduationCap size={21} strokeWidth={2.2} /></span>
          <span>{text.brand}<small>LEARN WITHOUT LIMITS</small></span>
        </Link>
        <nav aria-label="Main navigation" className="main-nav">
          <Link href={`/${locale}/programs`}>{text.nav.programs}</Link>
          <Link href={`/${locale}/universities`}>{text.nav.universities}</Link>
          <a href={`/${locale}#how-it-works`}>{text.nav.howItWorks}</a>
        </nav>
        <div className="header-actions">
          <Link aria-label={locale === "ar" ? "Switch to English" : "التبديل إلى العربية"} className="language-link" href={`/${otherLocale}`}>
            <Languages size={16} /><span>{otherLocale === "en" ? "EN" : "عربي"}</span>
          </Link>
          <Link className="login-link" href={`/${locale}/login`}>{text.nav.login}</Link>
          <Link className="button button-small button-primary" href={`/${locale}/dashboard`}>
            {text.nav.getStarted}<ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({
  locale,
  text,
}: {
  locale: Locale;
  text: Dictionary;
}) {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div>
          <Link className="brand brand-footer" href={`/${locale}`}>
            <span className="brand-mark"><GraduationCap size={21} /></span>
            <span>{text.brand}<small>LEARN WITHOUT LIMITS</small></span>
          </Link>
          <p>{text.common.footerText}</p>
        </div>
        <div className="footer-links">
          <Link href={`/${locale}/programs`}>{text.nav.programs}</Link>
          <Link href={`/${locale}/universities`}>{text.nav.universities}</Link>
          <Link href={`/${locale}/dashboard`}>{text.nav.dashboard}</Link>
          <Link href={`/${locale}/about`}>{text.common.about}</Link>
          <Link href={`/${locale}/contact`}>{locale === "ar" ? "تواصل معنا" : "Contact"}</Link>
        </div>
        <Link className="footer-cta" href={`/${locale}/programs`}>{text.common.exploreNow}<ArrowUpRight size={17} /></Link>
      </div>
      <div className="container footer-bottom"><span>{text.common.allRights}</span><span>Made for students, everywhere.</span></div>
    </footer>
  );
}
