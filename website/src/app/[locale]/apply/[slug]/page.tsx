import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { ApplicationWizard } from "@/components/application-wizard";
import { container } from "@/infrastructure/di/container";
import type { Locale } from "@/domain/model";
import { getDictionary } from "@/lib/i18n";

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: candidate, slug } = await params;
  const locale = candidate as Locale;
  const program = (await container.controllers.programs.list()).find(({ opportunity }) => opportunity.slug === slug);
  if (!program) notFound();
  const { opportunity } = program;
  if (opportunity.status !== "OPEN") {
    return <section className="container profile-page"><h1>{getDictionary(locale).applicationWizard.closed}</h1></section>;
  }
  const sessionId = (await cookies()).get("manhal-session")?.value;
  const user = await container.controllers.auth.findActiveUser(sessionId);
  const student = user?.studentId ? await container.controllers.students.getProfile(user.studentId) : undefined;
  if (!user || !student || user.role !== "STUDENT") {
    redirect(`/${locale}/login?next=${encodeURIComponent(`/${locale}/apply/${slug}`)}`);
  }
  return <section className="container wizard-page"><div className="eyebrow"><span className="eyebrow-dot" />{opportunity.title[locale]}</div><h1>{getDictionary(locale).applicationWizard.title}</h1><p>{getDictionary(locale).applicationWizard.description}</p><ApplicationWizard locale={locale} opportunity={opportunity} student={student} text={getDictionary(locale).applicationWizard} /></section>;
}
