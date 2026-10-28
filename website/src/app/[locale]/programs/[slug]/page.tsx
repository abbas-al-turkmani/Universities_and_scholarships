import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpLeft, ArrowUpRight, Check, Clock3, FileText, MapPin, MoveUpRight, Sparkles } from "lucide-react";

import { container } from "@/infrastructure/di/container";
import { getDictionary, type Locale } from "@/lib/i18n";

export async function generateStaticParams() {
  return (await container.controllers.programs.list()).map(({ opportunity }) => ({ slug: opportunity.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: candidate, slug } = await params;
  const view = (await container.controllers.programs.list()).find(({ opportunity }) => opportunity.slug === slug);
  if (!view) return {};
  const locale = candidate as Locale;
  const { opportunity } = view;
  return {
    title: opportunity.title[locale],
    description: opportunity.description[locale],
    alternates: { languages: { ar: `/ar/programs/${slug}`, en: `/en/programs/${slug}` } },
    openGraph: { title: opportunity.title[locale], description: opportunity.description[locale] },
  };
}

export default async function OpportunityPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: candidate, slug } = await params;
  const locale = candidate as Locale;
  const text = getDictionary(locale);
  const programViews = await container.controllers.programs.list();
  const current = programViews.find(({ opportunity }) => opportunity.slug === slug);
  if (!current) notFound();
  const { opportunity, university } = current;
  const arrow = locale === "ar" ? <ArrowUpLeft size={17} /> : <ArrowUpRight size={17} />;
  const date = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${opportunity.deadline}T12:00:00`));

  return (
    <div className="page-shell detail-shell">
      <div className="container"><div className="breadcrumbs"><Link href={`/${locale}`}>{text.common.home}</Link><span>/</span><Link href={`/${locale}/programs`}>{text.nav.programs}</Link><span>/</span><span>{opportunity.title[locale]}</span></div>
        <div className="detail-layout">
          <article className="detail-main">
            <div className="detail-banner"><span className="university-avatar detail-avatar">{university.name[locale].slice(0, 2)}</span><div><span className="university-name">{university.name[locale]}</span><span className="card-field"><MapPin size={14} />{opportunity.city[locale]}, {opportunity.country[locale]}</span></div><span className={`type-pill ${opportunity.type}`}>{opportunity.type === "scholarship" ? <Sparkles size={13} /> : null}{opportunity.type === "scholarship" ? text.programs.scholarship : text.programs.program}</span></div>
            <h1 className="detail-title">{opportunity.title[locale]}</h1>
            <p className="detail-lead">{opportunity.description[locale]}</p>
            <div className="detail-chips"><span>{opportunity.degree}</span><span>{opportunity.field[locale]}</span><span>{opportunity.duration}</span></div>
            <section className="detail-section"><h2>{locale === "ar" ? "عن الفرصة" : "About this opportunity"}</h2><p>{opportunity.description[locale]} {locale === "ar" ? "ستستفيد من موارد أكاديمية حديثة وفرص للتواصل مع خبراء في المجال." : "You’ll benefit from modern academic resources and opportunities to connect with leaders in your field."}</p></section>
            <section className="detail-section"><h2>{locale === "ar" ? "متطلبات التقديم" : "What you’ll need"}</h2><ul className="requirement-list">{opportunity.requirements.map((requirement) => <li key={requirement.en}><span><Check size={15} /></span>{requirement[locale]}</li>)}</ul></section>
            <section className="detail-section eligibility-card"><div className="eligibility-title"><span><Sparkles size={16} /></span><div><h2>{locale === "ar" ? "شروط الأهلية" : "Eligibility criteria"}</h2><p>{locale === "ar" ? "تحقق من ملاءمة ملفك لهذه الفرصة." : "Check how your profile fits this opportunity."}</p></div></div><div className="eligibility-items"><span>{locale === "ar" ? "الحد الأدنى للمعدل" : "Minimum GPA"}<strong>{opportunity.rules.minimumGpa.toFixed(1)} / 4.0</strong></span><span>{locale === "ar" ? "اللغة" : "Language"}<strong>{opportunity.rules.language} · {opportunity.rules.minimumLanguageScore}</strong></span><span>{locale === "ar" ? "الدرجة المطلوبة" : "Degree required"}<strong>{opportunity.rules.acceptedDegrees.join(", ")}</strong></span></div></section>
          </article>
          <aside className="detail-sidebar"><div className="apply-card">          <div className="apply-card-top"><span className="apply-amount">{opportunity.type === "scholarship" ? opportunity.funding[locale] : opportunity.tuition.toLocaleString(locale, { style: "currency", currency: opportunity.currency, maximumFractionDigits: 0 })}</span><span className="apply-amount-label">{opportunity.type === "scholarship" ? text.featured.fullyFunded : locale === "ar" ? "الرسوم السنوية التقديرية" : "Estimated annual tuition"}</span></div><div className="apply-meta"><span><Clock3 size={16} />{text.featured.deadline}</span><strong>{date}</strong></div><div className="apply-meta"><span><FileText size={16} />{locale === "ar" ? "المقاعد المتاحة" : "Available seats"}</span><strong>{opportunity.seats}</strong></div>{opportunity.status === "OPEN" ? <Link className="button button-primary apply-button" href={`/${locale}/apply/${opportunity.slug}`}>{locale === "ar" ? "قدّم الآن" : "Apply now"}{arrow}</Link> : <button className="button button-disabled apply-button" disabled>{locale === "ar" ? "انتهى التقديم" : "Applications closed"}</button>}<p className="apply-note">{locale === "ar" ? "لن يستغرق إنشاء طلبك سوى بضع دقائق." : "It only takes a few minutes to start your application."}</p></div>
            <div className="about-university"><span className="university-avatar">{university.name[locale].slice(0, 2)}</span><h3>{university.name[locale]}</h3><p>{university.description[locale]}</p><Link className="text-link" href={`/${locale}/universities`}>{text.nav.universities}<MoveUpRight size={15} /></Link></div>
          </aside>
        </div>
        <div className="related-block"><div><h2>{locale === "ar" ? "قد تهمك أيضاً" : "You might also like"}</h2><Link className="text-link" href={`/${locale}/programs`}>{text.common.viewAll}<MoveUpRight size={16} /></Link></div><div className="related-links">{programViews.filter(({ opportunity: entry }) => entry.id !== opportunity.id && entry.field.en === opportunity.field.en).slice(0, 3).map(({ opportunity: entry }) => <Link key={entry.id} href={`/${locale}/programs/${entry.slug}`}><span>{entry.title[locale]}</span>{arrow}</Link>)}</div></div>
      </div>
    </div>
  );
}
