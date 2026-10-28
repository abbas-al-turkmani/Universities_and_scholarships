import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ArrowUpLeft, ArrowUpRight, FileText } from "lucide-react";

import { ReviewControls } from "@/components/review-controls";
import type { Locale } from "@/domain/model";
import { container } from "@/infrastructure/di/container";
import { getDictionary } from "@/lib/i18n";

export default async function ReviewApplicationPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: candidate, id } = await params;
  const locale = candidate as Locale;
  const userId = (await cookies()).get("manhal-session")?.value;
  const application = await container.repositories.applications.findById(id);
  if (!application || application.assignedReviewer !== userId) notFound();
  const [student, opportunity] = await Promise.all([
    container.repositories.students.findById(application.studentId),
    container.repositories.programs.findById(application.opportunityId),
  ]);
  if (!student || !opportunity) notFound();
  const text = getDictionary(locale);
  const Arrow = locale === "ar" ? ArrowUpLeft : ArrowUpRight;
  return <section className="container profile-page"><Link className="text-link" href={`/${locale}/dashboard/reviewer`}><Arrow size={15} />{text.reviewer.title}</Link><div className="eyebrow reviewer-page-eyebrow"><span className="eyebrow-dot" />{application.reference}</div><h1>{text.reviewer.details}</h1><p>{opportunity.title[locale]} · {student.name[locale]}</p><div className="review-detail-grid"><section className="dashboard-panel"><h2>{locale === "ar" ? "ملف الطالب" : "Student profile"}</h2><dl className="review-profile"><div><dt>{locale === "ar" ? "البريد الإلكتروني" : "Email"}</dt><dd>{student.email}</dd></div><div><dt>{locale === "ar" ? "مجال الدراسة" : "Field of study"}</dt><dd>{student.field}</dd></div><div><dt>{locale === "ar" ? "المعدل التراكمي" : "GPA"}</dt><dd>{student.gpa.toFixed(1)} / 4.0</dd></div><div><dt>{locale === "ar" ? "الجنسية" : "Nationality"}</dt><dd>{student.countryName[locale]}</dd></div></dl><h2 className="review-section-heading">{text.reviewer.documents}</h2><ul className="review-doc-list">{application.documents.map((document) => <li key={document.name}><FileText size={16} /><span>{document.name}</span><small>{(document.size / 1024).toFixed(0)} KB</small></li>)}</ul><h2 className="review-section-heading">{text.reviewer.history}</h2><ol className="review-history">{application.history.map((entry, index) => <li key={`${entry.status}-${index}`}><strong>{entry.status.replaceAll("_", " ")}</strong><p>{entry.note}</p><small>{new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(new Date(entry.date))}</small></li>)}</ol></section><aside><ReviewControls applicationId={application.id} locale={locale} text={text.reviewer} /></aside></div></section>;
}
