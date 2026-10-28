import type { Locale } from "@/domain/model";
import { getDictionary } from "@/lib/i18n";
import { TrackApplicationForm } from "@/components/track-application-form";

export default async function TrackPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: candidate } = await params;
  const locale = candidate as Locale;
  const text = getDictionary(locale);
  return <section className="container track-page"><div className="eyebrow"><span className="eyebrow-dot" />MANHAL APPLICATIONS</div><h1>{text.applicationWizard.track}</h1><p>{text.applicationWizard.trackingDescription}</p><TrackApplicationForm locale={locale} text={text.applicationWizard} /></section>;
}
