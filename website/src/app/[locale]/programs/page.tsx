import Link from "next/link";
import { ArrowDownUp, Search, SlidersHorizontal } from "lucide-react";

import { OpportunityCard } from "@/components/opportunity-card";
import { container } from "@/infrastructure/di/container";
import { getDictionary, type Locale } from "@/lib/i18n";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function ProgramsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const [{ locale: candidate }, query] = await Promise.all([params, searchParams]);
  const locale = candidate as Locale;
  const text = getDictionary(locale);
  const q = typeof query.q === "string" ? query.q.trim().toLowerCase() : "";
  const type = typeof query.type === "string" ? query.type : "";
  const country = typeof query.country === "string" ? query.country : "";
  const degree = typeof query.degree === "string" ? query.degree : "";
  const sort = typeof query.sort === "string" ? query.sort : "";
  const programs = await container.controllers.programs.list();
  const filtered = programs.filter(({ opportunity, university }) => {
    const matchesText = !q || [opportunity.title.en, opportunity.title.ar, opportunity.field.en, opportunity.field.ar, university.name.en, university.name.ar].some((value) => value.toLowerCase().includes(q));
    return matchesText && (!type || type === "all" || opportunity.type === type) &&
      (!country || university.country.en === country) && (!degree || opportunity.degree === degree);
  });
  if (sort === "deadline") filtered.sort((a, b) => a.opportunity.deadline.localeCompare(b.opportunity.deadline));
  if (sort === "name") filtered.sort((a, b) => a.opportunity.title[locale].localeCompare(b.opportunity.title[locale]));

  return (
    <div className="page-shell">
      <section className="page-hero"><div className="container page-hero-inner"><div className="eyebrow"><span className="eyebrow-dot" />{text.featured.eyebrow}</div><h1>{text.programs.title}</h1><p>{text.programs.description}</p>
        <form action={`/${locale}/programs`} className="catalog-search"><Search size={18} /><input defaultValue={q} name="q" placeholder={text.programs.search} /><button className="button button-primary" type="submit">{text.common.search}</button></form>
      </div></section>
      <div className="container catalog-layout">
        <aside className="filter-panel"><div className="filter-heading"><SlidersHorizontal size={17} /><strong>{text.programs.filterBy}</strong></div>
          <form action={`/${locale}/programs`} className="filter-form">
            {q && <input name="q" type="hidden" value={q} />}
            <label>{text.programs.all}<select defaultValue={type} name="type"><option value="">{text.programs.all}</option><option value="program">{text.programs.program}</option><option value="scholarship">{text.programs.scholarship}</option></select></label>
            <label>{text.programs.country}<select defaultValue={country} name="country"><option value="">{text.programs.allCountries}</option>{[...new Set(programs.map(({ university }) => university.country.en))].map((entry) => <option key={entry} value={entry}>{locale === "ar" ? programs.find(({ university }) => university.country.en === entry)?.university.country.ar : entry}</option>)}</select></label>
            <label>{text.programs.degree}<select defaultValue={degree} name="degree"><option value="">{text.programs.allDegrees}</option>{["Bachelor", "Master", "PhD"].map((entry) => <option key={entry}>{entry}</option>)}</select></label>
            <label>{text.programs.sort}<select defaultValue={sort} name="sort"><option value="">{text.programs.newest}</option><option value="deadline">{text.programs.deadlineSoon}</option><option value="name">{text.programs.name}</option></select></label>
            <button className="button button-primary filter-submit" type="submit"><ArrowDownUp size={16} />{text.programs.filterBy}</button>
            {(q || type || country || degree || sort) && <Link className="reset-filters" href={`/${locale}/programs`}>{locale === "ar" ? "مسح عوامل التصفية" : "Clear filters"}</Link>}
          </form>
        </aside>
        <section className="catalog-results"><div className="results-heading"><div><strong>{filtered.length}</strong> {text.programs.results}<span>{q ? ` · “${q}”` : ""}</span></div><span className="sort-hint"><ArrowDownUp size={15} />{text.programs.sort}</span></div>
          {filtered.length ? <div className="opportunity-grid catalog-grid">{filtered.slice(0, 12).map(({ opportunity, university }, index) => <OpportunityCard key={opportunity.id} opportunity={opportunity} university={university} locale={locale} text={text} index={index} />)}</div> : <div className="empty-state"><span className="empty-icon"><Search size={23} /></span><h2>{text.programs.empty}</h2><p>{text.programs.emptyHint}</p><Link className="button button-outline" href={`/${locale}/programs`}>{text.common.viewAll}</Link></div>}
          {filtered.length > 12 && <div className="catalog-pagination"><span>{locale === "ar" ? "عرض ١٢ من" : "Showing 12 of"} {filtered.length}</span><button aria-label="Next page" className="pagination-button" type="button">→</button></div>}
        </section>
      </div>
    </div>
  );
}
