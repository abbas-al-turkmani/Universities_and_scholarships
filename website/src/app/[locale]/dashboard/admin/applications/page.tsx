import Link from "next/link";

import { container } from "@/infrastructure/di/container";
import type { Locale } from "@/domain/model";

export default async function AdminApplicationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: candidate } = await params;
  const locale = candidate as Locale;
  const arabic = locale === "ar";
  const { applications, opportunities, students, universities } = await container.controllers.admin.getDashboardData();
  return <section className="container profile-page"><div className="eyebrow"><span className="eyebrow-dot" />ADMISSIONS OPERATIONS</div><h1>{arabic ? "إدارة الطلبات" : "Application management"}</h1><p>{arabic ? "تابع طلبات الطلاب وحالة المراجعة." : "Review student submissions and monitor application status."}</p><div className="admin-table-wrap"><table className="admin-table"><thead><tr>{(arabic ? ["المرجع", "الطالب", "البرنامج", "الحالة", "تاريخ التقديم"] : ["Reference", "Student", "Program", "Status", "Submitted"]).map((label) => <th key={label}>{label}</th>)}</tr></thead><tbody>{applications.slice(0, 20).map((application) => {const student = students.find((item) => item.id === application.studentId);const opportunity = opportunities.find((item) => item.id === application.opportunityId);const university = opportunity ? universities.find((item) => item.id === opportunity.universityId) : undefined;return <tr key={application.id}><td><strong>{application.reference}</strong></td><td>{student?.name[locale]}</td><td><span>{opportunity?.title[locale]}</span><small>{university?.name[locale]}</small></td><td><span className={`status-pill status-${application.status === "ACCEPTED" ? "green" : application.status === "REJECTED" ? "red" : application.status === "UNDER_REVIEW" ? "amber" : "blue"}`}>{application.status.replaceAll("_", " ")}</span></td><td>{new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }).format(new Date(application.submittedAt))}</td></tr>;})}</tbody></table></div><Link className="text-link profile-return" href={`/${locale}/dashboard`}>{arabic ? "العودة للوحة التحكم" : "Back to dashboard"}<span>→</span></Link></section>;
}
