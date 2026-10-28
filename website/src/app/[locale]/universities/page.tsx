import Link from "next/link";
import { ArrowUpLeft, ArrowUpRight, MapPin, MoveUpRight } from "lucide-react";

import { container } from "@/infrastructure/di/container";
import { getDictionary, type Locale } from "@/lib/i18n";

export default async function UniversitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: candidate } = await params;
  const locale = candidate as Locale;
  const text = getDictionary(locale);
  const [universities, programs] = await Promise.all([
    container.controllers.universities.list(),
    container.controllers.programs.list(),
  ]);
  return (
    <div className="page-shell">
      <section className="page-hero"><div className="container page-hero-inner"><div className="eyebrow"><span className="eyebrow-dot" />{text.nav.universities}</div><h1>{text.universities.title}</h1><p>{text.universities.description}</p></div></section>
      <section className="container university-grid-section">
        <div className="university-grid">{universities.map((university, index) => {
          const count = programs.filter((item) => item.university.id === university.id).length;
          return <article className="university-card" key={university.id}><div className={`university-logo logo-${index % 4}`}><span>{university.name[locale].split(" ").slice(0, 2).map((word) => word[0]).join("")}</span><span className="ranking">#{university.ranking}</span></div><p className="university-country"><MapPin size={14} />{university.city[locale]}, {university.country[locale]}</p><h2>{university.name[locale]}</h2><p className="university-description">{university.description[locale]}</p><div className="university-card-bottom"><span>{count} {text.universities.programs}</span><Link aria-label={`${text.common.learnMore}: ${university.name[locale]}`} href={`/${locale}/programs?country=${encodeURIComponent(university.country.en)}`}>{locale === "ar" ? <ArrowUpLeft size={17} /> : <ArrowUpRight size={17} />}</Link></div></article>;
        })}</div>
        <div className="university-bottom-cta"><span>{locale === "ar" ? "هل ترغب في مواصلة البحث؟" : "Want to keep exploring?"}</span><Link className="text-link" href={`/${locale}/programs`}>{text.nav.programs}<MoveUpRight size={16} /></Link></div>
      </section>
    </div>
  );
}
