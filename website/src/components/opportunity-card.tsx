import Link from "next/link";
import { ArrowUpLeft, ArrowUpRight, Clock3, MapPin, Sparkles } from "lucide-react";

import type { Opportunity, Locale, University } from "@/domain/model";
import type { Dictionary } from "@/lib/i18n";

function daysUntil(deadline: string) {
  return Math.ceil((new Date(`${deadline}T23:59:59Z`).getTime() - Date.now()) / 86_400_000);
}

export function OpportunityCard({
  opportunity,
  university,
  locale,
  text,
  index = 0,
}: {
  opportunity: Opportunity;
  university: University;
  locale: Locale;
  text: Dictionary;
  index?: number;
}) {
  const days = daysUntil(opportunity.deadline);
  const arrow = locale === "ar" ? <ArrowUpLeft size={17} /> : <ArrowUpRight size={17} />;
  const initials = university.name[locale].split(" ").slice(0, 2).map((part) => part[0]).join("");

  return (
    <article className={`opportunity-card card-accent-${index % 4}`}>
      <div className="card-topline">
        <span className="university-avatar">{initials}</span>
        <span className={`type-pill ${opportunity.type}`}>
          {opportunity.type === "scholarship" ? <Sparkles size={13} /> : null}
          {opportunity.type === "scholarship" ? text.programs.scholarship : text.programs.program}
        </span>
        {days > 0 && days <= 7 ? <span className="closing-pill">{text.featured.closingSoon}</span> : null}
      </div>
      <div className="card-copy">
        <p className="university-name">{university.name[locale]}</p>
        <h3>{opportunity.title[locale]}</h3>
        <p className="card-field">{opportunity.field[locale]} <span>·</span> {opportunity.degree}</p>
      </div>
      <div className="card-details">
        <span><MapPin size={14} />{opportunity.city[locale]}, {opportunity.country[locale]}</span>
        <span><Clock3 size={14} />{days < 0 ? text.featured.closingSoon : `${days} ${text.featured.daysLeft}`}</span>
      </div>
      <div className="card-bottom">
        <div><small>{opportunity.type === "scholarship" ? text.featured.fullyFunded : text.featured.deadline}</small><strong>{opportunity.type === "scholarship" ? opportunity.funding[locale] : new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${opportunity.deadline}T12:00:00`))}</strong></div>
        <Link aria-label={`${text.featured.apply}: ${opportunity.title[locale]}`} className="card-arrow" href={`/${locale}/programs/${opportunity.slug}`}>{arrow}</Link>
      </div>
    </article>
  );
}
