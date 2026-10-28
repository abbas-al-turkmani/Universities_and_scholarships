import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ArrowUpLeft, ArrowUpRight, Check, MailCheck } from "lucide-react";

import type { Locale } from "@/domain/model";
import { container } from "@/infrastructure/di/container";
import { getDictionary } from "@/lib/i18n";

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ locale: string; reference: string }>;
}) {
  const { locale: candidate, reference } = await params;
  const locale = candidate as Locale;
  const userId = (await cookies()).get("manhal-session")?.value;
  const user = await container.controllers.auth.findActiveUser(userId);
  if (!user?.studentId) redirect(`/${locale}/login`);
  const application = await container.controllers.applications.findForStudent(reference, user.studentId);
  if (!application) notFound();
  const text = getDictionary(locale).applicationWizard;
  const Arrow = locale === "ar" ? ArrowUpLeft : ArrowUpRight;
  return <section className="container confirmation-page"><span className="confirmation-icon"><Check size={30} /></span><div className="eyebrow"><span className="eyebrow-dot" />MANHAL APPLICATION</div><h1>{text.successTitle}</h1><p>{text.successDescription}</p><div className="confirmation-reference"><small>{text.reference}</small><strong>{application.reference}</strong></div><div className="confirmation-email"><MailCheck size={18} /><span>{text.emailSent}</span></div><div className="confirmation-actions"><Link className="button button-primary" href={`/${locale}/dashboard`}>{getDictionary(locale).nav.dashboard}<Arrow size={16} /></Link><Link className="text-link" href={`/${locale}/track`}>{text.track}<Arrow size={16} /></Link></div></section>;
}
