import Link from "next/link";
import { cookies } from "next/headers";
import { ArrowUpLeft, ArrowUpRight, FileCheck2 } from "lucide-react";

import type { Locale } from "@/domain/model";
import { container } from "@/infrastructure/di/container";
import { getDictionary } from "@/lib/i18n";

export default async function ReviewerDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: candidate } = await params;
  const locale = candidate as Locale;
  const text = getDictionary(locale);
  const userId = (await cookies()).get("manhal-session")?.value;
  const [user, assigned, studentRecords, programRecords] = await Promise.all([
    container.controllers.auth.findActiveUser(userId),
    container.controllers.reviewer.listAssigned(userId ?? ""),
    container.controllers.students.list(),
    container.controllers.programs.list(),
  ]);
  const Arrow = locale === "ar" ? ArrowUpLeft : ArrowUpRight;

  return <section className="container profile-page"><div className="eyebrow"><span className="eyebrow-dot" />REVIEW WORKSPACE · {user?.name}</div><h1>{text.reviewer.title}</h1><p>{text.reviewer.description}</p><div className="reviewer-queue">{assigned.map((application) => {const student = studentRecords.find((entry) => entry.id === application.studentId);const program = programRecords.find(({ opportunity }) => opportunity.id === application.opportunityId)?.opportunity;return <article key={application.id}><span className="reviewer-file"><FileCheck2 size={19} /></span><div><strong>{student?.name[locale]}</strong><small>{program?.title[locale]} · {application.reference}</small><span className={`status-pill status-${application.status === "ACCEPTED" ? "green" : application.status === "REJECTED" ? "red" : "amber"}`}>{application.status.replaceAll("_", " ")}</span></div><Link className="button button-outline" href={`/${locale}/dashboard/reviewer/applications/${application.id}`}>{text.reviewer.open}<Arrow size={15} /></Link></article>;})}{assigned.length === 0 && <div className="empty-state"><span className="empty-icon"><FileCheck2 size={21} /></span><h2>{text.reviewer.empty}</h2></div>}</div></section>;
}
