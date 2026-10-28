import Link from "next/link";
import { ArrowUpRight, Building2, CircleDollarSign, FileCheck2, UsersRound } from "lucide-react";

import { container } from "@/infrastructure/di/container";
import type { Locale } from "@/domain/model";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: candidate } = await params;
  const locale = candidate as Locale;
  const arabic = locale === "ar";
  const { applications, opportunities, students, universities } = await container.controllers.admin.getDashboardData();
  const submitted = applications.filter((application) => ["SUBMITTED", "UNDER_REVIEW", "DOCUMENTS_REQUESTED"].includes(application.status)).length;
  const cards = [
    { title: arabic ? "إجمالي الطلبات" : "Total applications", value: applications.length, icon: <FileCheck2 size={19} />, color: "blue" },
    { title: arabic ? "قيد المراجعة" : "Pending review", value: submitted, icon: <CircleDollarSign size={19} />, color: "amber" },
    { title: arabic ? "البرامج النشطة" : "Active programs", value: opportunities.filter((item) => item.status === "OPEN").length, icon: <Building2 size={19} />, color: "teal" },
    { title: arabic ? "الطلبة المسجلون" : "Registered students", value: students.length, icon: <UsersRound size={19} />, color: "purple" },
  ];
  return <div className="dashboard-page"><div className="container admin-dashboard"><div className="dashboard-welcome"><div><div className="eyebrow"><span className="eyebrow-dot" />MANHAL ADMINISTRATION</div><h1>{arabic ? "نظرة عامة" : "Overview"}</h1><p>{arabic ? "نظرة شاملة على أداء المنصة وطلبات الطلاب." : "A clear view of platform activity and student applications."}</p></div><Link className="button button-primary" href={`/${locale}/dashboard/admin/applications`}>{arabic ? "إدارة الطلبات" : "Manage applications"}<ArrowUpRight size={16} /></Link></div>
    <nav aria-label={arabic ? "إدارة المنصة" : "Workspace"} className="admin-quick-links">{["universities", "programs", "students", "users", "database", "permissions"].map((section) => <Link href={`/${locale}/dashboard/admin/${section}`} key={section}>{arabic ? ({ universities: "الجامعات", programs: "البرامج والمنح", students: "الطلاب", users: "المستخدمون", database: "قاعدة البيانات", permissions: "الصلاحيات" }[section]) : ({ universities: "Universities", programs: "Programs & scholarships", students: "Students", users: "Users & roles", database: "Database", permissions: "Permissions" }[section])}<ArrowUpRight size={14} /></Link>)}</nav>
    <div className="admin-stats">{cards.map((card) => <article className="admin-stat-card" key={card.title}><span className={`admin-stat-icon ${card.color}`}>{card.icon}</span><span className="admin-stat-label">{card.title}</span><strong>{card.value}</strong><small>{arabic ? "بيانات تجريبية" : "Seeded demo data"}</small></article>)}</div>
    <div className="admin-panels"><section className="dashboard-panel admin-chart-panel"><div className="panel-heading"><div><span className="eyebrow"><span className="eyebrow-dot" />APPLICATION MOMENTUM</span><h2>{arabic ? "الطلبات خلال الأشهر الماضية" : "Applications over time"}</h2></div><span className="chart-period">{arabic ? "آخر ٦ أشهر" : "Last 6 months"}</span></div><div className="chart-legend"><span><i />{arabic ? "الطلبات" : "Applications"}</span></div><div className="bar-chart">{[32, 45, 37, 63, 54, 82, 68, 96, 76, 100, 84, 92].map((height, index) => <div className="chart-column" key={index}><span style={{ height: `${height}%` }} /><small>{["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"][index]}</small></div>)}</div></section>
      <section className="dashboard-panel status-panel"><div className="panel-heading"><div><span className="eyebrow"><span className="eyebrow-dot" />APPLICATIONS AT A GLANCE</span><h2>{arabic ? "حالة الطلبات" : "Status distribution"}</h2></div></div><div className="donut-wrap"><div className="donut"><span>{applications.length}<small>{arabic ? "طلباً" : "applications"}</small></span></div><div className="donut-legend">{[["Under review", "amber"], ["Submitted", "blue"], ["Accepted", "green"], ["Other", "purple"]].map(([label, color], index) => <div key={label}><i className={color} /><span>{arabic ? ["قيد المراجعة", "تم الإرسال", "مقبول", "أخرى"][index] : label}</span><strong>{[12, 10, 4, applications.length - 26][index]}</strong></div>)}</div></div></section></div>
    <div className="admin-bottom-grid"><section className="dashboard-panel"><div className="panel-heading"><div><span className="eyebrow"><span className="eyebrow-dot" />RECENT ACTIVITY</span><h2>{arabic ? "أحدث الطلبات" : "Recent applications"}</h2></div><Link className="text-link" href={`/${locale}/dashboard`}>{arabic ? "عرض الكل" : "View all"}<ArrowUpRight size={16} /></Link></div><div className="admin-application-list">{applications.slice(0, 5).map((application) => {const student = students.find((item) => item.id === application.studentId);const opportunity = opportunities.find((item) => item.id === application.opportunityId);return <div className="admin-app-row" key={application.id}><span className="profile-avatar">{student?.name[locale].slice(0, 1)}</span><div><strong>{student?.name[locale]}</strong><small>{opportunity?.title[locale]}</small></div><span className="application-reference">{application.reference}</span><ArrowUpRight size={14} /></div>;})}</div></section>
      <section className="dashboard-panel top-universities"><div className="panel-heading"><div><span className="eyebrow"><span className="eyebrow-dot" />UNIVERSITY PARTNERS</span><h2>{arabic ? "الجامعات" : "Universities"}</h2></div></div>{universities.slice(0, 5).map((university, index) => <div className="top-university-row" key={university.id}><span>{index + 1}</span><strong>{university.name[locale]}</strong><small>{opportunities.filter((item) => item.universityId === university.id).length} {arabic ? "فرص" : "opportunities"}</small></div>)}</section></div>
  </div></div>;
}
