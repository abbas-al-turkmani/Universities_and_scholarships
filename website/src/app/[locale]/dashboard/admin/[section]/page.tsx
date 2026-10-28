import Link from "next/link";
import { notFound } from "next/navigation";
import { Search } from "lucide-react";

import type { Locale } from "@/domain/model";
import { container } from "@/infrastructure/di/container";
import { getDictionary } from "@/lib/i18n";

const sections = ["universities", "programs", "students", "users", "database", "permissions"] as const;
type AdminSection = (typeof sections)[number];

export default async function AdminSectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; section: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ locale: candidate, section: sectionCandidate }, query] = await Promise.all([params, searchParams]);
  if (!sections.includes(sectionCandidate as AdminSection)) notFound();
  const section = sectionCandidate as AdminSection;
  const locale = candidate as Locale;
  const text = getDictionary(locale);
  const adminText = text.admin;
  const search = query.q?.trim().toLowerCase() ?? "";
  let headings: string[] = [];
  let rows: string[][] = [];
  let databaseSummary: { name: string; rows: number; sample: unknown[] }[] = [];

  if (section === "universities") {
    const [universities, programs] = await Promise.all([
      container.repositories.universities.list(),
      container.repositories.programs.list(),
    ]);
    headings = [adminText.name, adminText.country, adminText.city, adminText.programCount, adminText.status];
    rows = universities.map((university) => [
      university.name[locale],
      university.country[locale],
      university.city[locale],
      String(programs.filter((program) => program.universityId === university.id).length),
      locale === "ar" ? "شريك نشط" : "Active partner",
    ]);
  } else if (section === "programs") {
    const programs = await container.controllers.programs.list();
    headings = [adminText.name, adminText.country, adminText.degree, adminText.type, adminText.deadline, adminText.status];
    rows = programs.map(({ opportunity, university }) => [
      opportunity.title[locale],
      university.country[locale],
      opportunity.degree,
      opportunity.type === "program" ? text.programs.program : text.programs.scholarship,
      new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${opportunity.deadline}T12:00:00`)),
      opportunity.status === "OPEN" ? (locale === "ar" ? "مفتوح" : "Open") : (locale === "ar" ? "مغلق" : "Closed"),
    ]);
  } else if (section === "students") {
    const students = await container.repositories.students.list();
    headings = [adminText.name, adminText.email, adminText.country, adminText.degree, adminText.gpa];
    rows = students.map((student) => [
      student.name[locale],
      student.email,
      student.countryName[locale],
      student.degree,
      `${student.gpa.toFixed(1)} / 4.0`,
    ]);
  } else if (section === "users") {
    const users = await container.repositories.users.list();
    headings = [adminText.name, adminText.email, adminText.role, adminText.active];
    rows = users.map((user) => [
      user.name,
      user.email,
      user.role.replaceAll("_", " "),
      user.active ? (locale === "ar" ? "نعم" : "Yes") : (locale === "ar" ? "لا" : "No"),
    ]);
  } else if (section === "database") {
    const tables = await import("@/infrastructure/database/sqlite").then((module) => module.getDatabaseSnapshot());
    databaseSummary = tables;
    headings = [locale === "ar" ? "الجدول" : "Table", locale === "ar" ? "عدد السجلات" : "Rows", locale === "ar" ? "عينات" : "Samples"];
    rows = tables.map((table) => [
      table.name,
      String(table.rows),
      table.rows > 0 ? table.sample.map((item) => {
        const record = item as Record<string, unknown>;
        const value = record.id ?? record.name ?? record.email ?? record.reference ?? "";
        return String(value);
      }).join(", ") : (locale === "ar" ? "فارغ" : "Empty"),
    ]);
  } else {
    headings = [
      locale === "ar" ? "الصلاحية" : "Capability",
      "SUPER_ADMIN",
      "ADMIN",
      "REVIEWER",
      "STUDENT",
    ];
    rows = [
      [locale === "ar" ? "إدارة الجامعات والبرامج" : "Manage universities and programs", "✓", "✓", "—", "—"],
      [locale === "ar" ? "عرض الطلبات" : "View applications", "✓", "✓", "Assigned", "Own only"],
      [locale === "ar" ? "تغيير حالة الطلب" : "Change application status", "✓", "✓", "Assigned", "—"],
      [locale === "ar" ? "إدارة المستخدمين" : "Manage users", "✓", "✓*", "—", "—"],
      [locale === "ar" ? "حذف المستخدمين" : "Delete users", "✓", "—", "—", "—"],
    ];
  }
  const filteredRows = section === "permissions"
    ? rows
    : rows.filter((row) => row.some((value) => value.toLowerCase().includes(search)));
  const title = adminText[section];

  return <section className="container profile-page"><Link className="text-link" href={`/${locale}/dashboard/admin`}>{locale === "ar" ? "لوحة الإدارة" : "Admin overview"}<span>→</span></Link><div className="eyebrow admin-section-eyebrow"><span className="eyebrow-dot" />{adminText.manage}</div><h1>{title}</h1><p>{locale === "ar" ? "استعرض السجلات وابحث في بيانات المنصة التجريبية." : "Browse and search records in the demo workspace."}</p><nav aria-label={adminText.manage} className="admin-section-nav">{sections.map((entry) => <Link aria-current={entry === section ? "page" : undefined} href={`/${locale}/dashboard/admin/${entry}`} key={entry}>{adminText[entry]}</Link>)}</nav>{section !== "permissions" && <form action={`/${locale}/dashboard/admin/${section}`} className="admin-search"><Search size={16} /><input defaultValue={search} name="q" placeholder={adminText.search} /><button className="button button-outline" type="submit">{text.common.search}</button></form>}{section === "permissions" && <p className="permission-note">* {locale === "ar" ? "لا يمكن للمسؤول تغيير دور مدير النظام الأعلى أو حذفه." : "Admins cannot change SUPER_ADMIN roles or delete users."}</p>}<div className="admin-table-wrap"><table className="admin-table"><thead><tr>{headings.map((heading) => <th key={heading}>{heading}</th>)}</tr></thead><tbody>{filteredRows.map((row, rowIndex) => <tr key={`${section}-${rowIndex}`}>{row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>)}</tr>)}</tbody></table>{filteredRows.length === 0 && <p className="admin-no-results">{adminText.noResults}</p>}</div>{section === "database" && databaseSummary.length > 0 && <div className="database-snapshot-grid">{databaseSummary.map((table) => <div className="dashboard-panel database-snapshot" key={table.name}><div className="panel-heading"><div><span className="eyebrow"><span className="eyebrow-dot" />DATABASE TABLE</span><h2>{table.name}</h2></div><span className="chart-period">{table.rows} {locale === "ar" ? "سجلات" : "rows"}</span></div>{table.sample.length === 0 ? <p className="admin-no-results">{locale === "ar" ? "لا توجد سجلات" : "No records"}</p> : <ul className="database-sample-list">{table.sample.map((record, index) => <li key={`${table.name}-${index}`}><code>{JSON.stringify(record)}</code></li>)}</ul>}</div>)}</div>}</section>;
}
