import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactForm } from "@/components/contact-form";
import type { Locale } from "@/domain/model";
import { getDictionary } from "@/lib/i18n";

const pageSlugs = ["about", "contact", "faq", "privacy", "terms"] as const;

export function generateStaticParams() {
  return pageSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: candidate, slug } = await params;
  if (!pageSlugs.some((pageSlug) => pageSlug === slug)) return {};
  const locale = candidate as Locale;
  return { title: getDictionary(locale).staticPages[slug as (typeof pageSlugs)[number]].title };
}

export default async function StaticPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: candidate, slug } = await params;
  if (!pageSlugs.some((pageSlug) => pageSlug === slug)) notFound();
  const locale = candidate as Locale;
  const text = getDictionary(locale);
  const page = text.staticPages[slug as (typeof pageSlugs)[number]];

  if (slug === "contact") {
    return (
      <div className="page-shell">
        <section className="page-hero"><div className="container page-hero-inner"><div className="eyebrow"><span className="eyebrow-dot" />{text.brand}</div><h1>{page.title}</h1><p>{page.intro}</p></div></section>
        <section className="container static-content contact-content"><ContactForm text={text.staticPages.contact} /></section>
      </div>
    );
  }
  const informationalPage = text.staticPages[slug as Exclude<(typeof pageSlugs)[number], "contact">];
  return (
    <div className="page-shell">
      <section className="page-hero"><div className="container page-hero-inner"><div className="eyebrow"><span className="eyebrow-dot" />{text.brand}</div><h1>{informationalPage.title}</h1><p>{informationalPage.intro}</p></div></section>
      <section className="container static-content">
        <div className="static-section-list">{informationalPage.sections.map((section) => <article key={section.title}><span className="static-section-mark">✦</span><div><h2>{section.title}</h2><p>{section.body}</p></div></article>)}</div>
      </section>
    </div>
  );
}
