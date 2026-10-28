import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowDownRight,
  ArrowUpLeft,
  ArrowUpRight,
  Award,
  BookOpenCheck,
  Check,
  ChevronDown,
  Globe2,
  HeartHandshake,
  MoveUpRight,
  Search,
  Sparkles,
  UsersRound,
} from "lucide-react";

import { OpportunityCard } from "@/components/opportunity-card";
import { container } from "@/infrastructure/di/container";
import { getDictionary, type Locale } from "@/lib/i18n";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: candidate } = await params;
  const locale = candidate as Locale;
  const text = getDictionary(locale);
  const [programViews, universityRecords] = await Promise.all([
    container.controllers.programs.list(),
    container.controllers.universities.list(),
  ]);
  const featured = programViews.slice(0, 3);
  const arabic = locale === "ar";
  const ArrowDown = arabic ? ArrowDownLeft : ArrowDownRight;
  const ArrowUp = arabic ? ArrowUpLeft : ArrowUpRight;

  return (
    <>
      <section className="hero-section">
        <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
        <div className="container hero-layout">
          <div className="hero-copy">
            <div className="eyebrow eyebrow-light"><span className="eyebrow-dot" />{text.hero.eyebrow}</div>
            <h1>{text.hero.title}</h1>
            <p className="hero-description">{text.hero.description}</p>
            <form action={`/${locale}/programs`} className="hero-search">
              <Search size={19} />
              <input aria-label={text.hero.search} name="q" placeholder={text.hero.search} />
              <button className="button button-amber" type="submit">{text.hero.searchButton}<MoveUpRight size={16} /></button>
            </form>
            <div className="hero-proof">
              <div className="avatar-stack"><span>س</span><span>م</span><span>ع</span><span>+</span></div>
              <p><strong>12,500+</strong> students found their way</p>
              <div className="proof-stars" aria-label="Rated 4.9 out of 5">★★★★★</div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-frame">
              <div className="hero-image" role="img" aria-label="Students celebrating their graduation" />
              <div className="image-shade" />
              <div className="floating-note note-scholarship">
                <span className="note-icon"><Award size={18} /></span>
                <span><small>Scholarship match</small><strong>100% funded</strong></span>
                <span className="note-check"><Check size={14} /></span>
              </div>
              <div className="floating-note note-students">
                <span className="mini-avatars"><i>م</i><i>ع</i><i>ل</i></span>
                <span><strong>1,200+</strong><small>new opportunities</small></span>
              </div>
              <div className="hero-image-caption"><span className="caption-line" /><span>New beginnings, everywhere.</span></div>
            </div>
            <div className="visual-decoration decoration-top"><Sparkles size={16} /></div>
            <div className="visual-decoration decoration-bottom">M</div>
          </div>
        </div>
        <div className="container hero-bottom">
          <span>Helping you find your place</span><span className="hero-bottom-line" /><span>01 — 03</span><ArrowDown size={17} />
        </div>
      </section>

      <section className="trust-strip">
        <div className="container trust-inner">
          <span className="trust-label">A world of learning, connected</span>
          <div className="trust-logos"><span>◉ <b>BOĞAZİÇİ</b></span><span>✦ <b>TUM</b></span><span>▰ <b>TORONTO</b></span><span>⬡ <b>MANCHESTER</b></span><span>✺ <b>MALAYA</b></span></div>
        </div>
      </section>

      <section className="section opportunities-section">
        <div className="container">
          <div className="section-heading">
            <div><div className="eyebrow"><span className="eyebrow-dot" />{text.featured.eyebrow}</div><h2>{text.featured.title}</h2><p>{text.featured.description}</p></div>
            <Link className="text-link" href={`/${locale}/programs`}>{text.featured.viewAll}<ArrowUp size={17} /></Link>
          </div>
          <div className="opportunity-grid">{featured.map(({ opportunity, university }, index) => <OpportunityCard key={opportunity.id} opportunity={opportunity} university={university} locale={locale} text={text} index={index} />)}</div>
          <div className="stats-band">
            <div><span className="stat-icon"><Globe2 size={20} /></span><strong>120<span>+</span></strong><small>{text.hero.universities}</small></div>
            <div><span className="stat-icon"><Award size={20} /></span><strong>850<span>+</span></strong><small>{text.hero.scholarships}</small></div>
            <div><span className="stat-icon"><UsersRound size={20} /></span><strong>12.5k</strong><small>{text.hero.students}</small></div>
            <div className="stat-note"><span>Good things take courage.</span><span>We’re here for your next step.</span></div>
          </div>
        </div>
      </section>

      <section className="section how-section" id="how-it-works">
        <div className="container how-layout">
          <div className="how-intro">
            <div className="eyebrow"><span className="eyebrow-dot" />{text.how.eyebrow}</div>
            <h2>{text.how.title}</h2>
            <p>{text.how.description}</p>
            <Link className="button button-outline" href={`/${locale}/programs`}>{text.common.learnMore}<MoveUpRight size={16} /></Link>
            <div className="how-art"><div className="art-sun" /><div className="art-line" /><div className="art-book"><BookOpenCheck size={54} strokeWidth={1.1} /></div><div className="art-stamp">YOUR<br />NEXT<br />CHAPTER</div></div>
          </div>
          <div className="steps-list">
            {[text.how.stepOne, text.how.stepTwo, text.how.stepThree].map((title, index) => (
              <article className="step-card" key={title}>
                <span className={`step-number step-${index + 1}`}>0{index + 1}</span>
                <div><h3>{title}</h3><p>{[text.how.stepOneBody, text.how.stepTwoBody, text.how.stepThreeBody][index]}</p></div>
                <span className="step-arrow"><MoveUpRight size={17} /></span>
              </article>
            ))}
            <div className="steps-promise"><HeartHandshake size={18} /><span>One application. A world of possibility.</span><ChevronDown size={16} /></div>
          </div>
        </div>
      </section>

      <section className="university-preview">
        <div className="container university-preview-inner">
          <div><div className="eyebrow eyebrow-light"><span className="eyebrow-dot" />Built around your future</div><h2>Find the community<br />where you’ll thrive.</h2><p>Meet universities that see your potential and help you turn it into impact.</p><Link className="button button-amber" href={`/${locale}/universities`}>{text.nav.universities}<MoveUpRight size={16} /></Link></div>
          <div className="university-stamps">{universityRecords.slice(0, 4).map((university, index) => <div className={`university-stamp stamp-${index + 1}`} key={university.id}><span>{university.name[locale].slice(0, 2)}</span><small>{university.name[locale]}</small></div>)}</div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-inner"><span className="cta-sparkle"><Sparkles size={19} /></span><div><h2>{text.common.startJourney}</h2><p>{text.common.startJourneyBody}</p></div><Link className="button button-primary" href={`/${locale}/programs`}>{text.common.exploreNow}<ArrowUp size={17} /></Link></div>
      </section>
    </>
  );
}
