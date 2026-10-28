import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowUpLeft, ArrowUpRight, Bell, CalendarDays, CheckCircle2, Clock3, FileText, MoveUpRight, Sparkles } from "lucide-react";

import { OpportunityCard } from "@/components/opportunity-card";
import { container } from "@/infrastructure/di/container";
import { getDictionary, type Locale } from "@/lib/i18n";

const statusLabels: Record<string, { en: string; ar: string; className: string }> = {
  SUBMITTED: { en: "Submitted", ar: "تم الإرسال", className: "status-blue" },
  UNDER_REVIEW: { en: "Under review", ar: "قيد المراجعة", className: "status-amber" },
  ACCEPTED: { en: "Accepted", ar: "مقبول", className: "status-green" },
  DOCUMENTS_REQUESTED: { en: "Documents requested", ar: "مطلوب مستندات", className: "status-orange" },
  REJECTED: { en: "Not selected", ar: "لم يتم القبول", className: "status-red" },
  WAITLISTED: { en: "Waitlisted", ar: "قائمة الانتظار", className: "status-purple" },
  DRAFT: { en: "Draft", ar: "مسودة", className: "status-slate" },
  WITHDRAWN: { en: "Withdrawn", ar: "منسحب", className: "status-slate" },
};

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: candidate } = await params;
  const locale = candidate as Locale;
  const text = getDictionary(locale);
  const sessionId = (await cookies()).get("manhal-session")?.value;
  const user = await container.controllers.auth.findActiveUser(sessionId);
  if (!user) redirect(`/${locale}/login`);
  if (user.role !== "STUDENT") {
    redirect(user.role === "REVIEWER" ? `/${locale}/dashboard/reviewer` : `/${locale}/dashboard/admin`);
  }
  const dashboard = await container.controllers.dashboard.getStudentDashboard(sessionId ?? "");
  const { student } = dashboard;
  const studentApplications = dashboard.applications;
  const programViews = await container.controllers.programs.list();
  const allRecommended = dashboard.recommendations.slice(0, 2).flatMap((recommendation) => {
    const view = programViews.find(({ opportunity }) => opportunity.id === recommendation.opportunity.id);
    return view ? [{ opportunity: recommendation.opportunity, university: view.university }] : [];
  });
  const userNotifications = dashboard.notifications.slice(0, 3);
  const arrow = locale === "ar" ? <ArrowUpLeft size={16} /> : <ArrowUpRight size={16} />;
  const dateFormatter = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" });

  return (
    <div className="dashboard-page">
      <div className="container dashboard-container">
        <div className="dashboard-welcome"><div><div className="eyebrow"><span className="eyebrow-dot" />YOUR STUDENT SPACE</div><h1>{locale === "ar" ? `أهلاً بعودتك، ${student.name.ar.split(" ")[0]}` : `Welcome back, ${student.name.en.split(" ")[0]}`}</h1><p>{text.dashboard.subtitle}</p></div><Link className="button button-outline" href={`/${locale}/programs`}>{text.dashboard.browse}<MoveUpRight size={16} /></Link></div>
        <div className="dashboard-grid">
          <section className="dashboard-main-column">
            <div className="dashboard-stats"><article className="dash-stat"><span className="dash-stat-icon"><FileText size={18} /></span><small>{text.dashboard.applications}</small><strong>{studentApplications.length.toString().padStart(2, "0")}</strong><span className="dash-stat-foot">{locale === "ar" ? "طلبات قيد المتابعة" : "applications in progress"}</span></article><article className="dash-stat"><span className="dash-stat-icon stat-icon-review"><Clock3 size={18} /></span><small>{text.dashboard.underReview}</small><strong>{studentApplications.filter((application) => application.status === "UNDER_REVIEW").length.toString().padStart(2, "0")}</strong><span className="dash-stat-foot">{locale === "ar" ? "سنوافيك بأي تحديث" : "we’ll keep you updated"}</span></article><article className="dash-stat"><span className="dash-stat-icon stat-icon-accept"><CheckCircle2 size={18} /></span><small>{text.dashboard.accepted}</small><strong>{studentApplications.filter((application) => application.status === "ACCEPTED").length.toString().padStart(2, "0")}</strong><span className="dash-stat-foot">{locale === "ar" ? "إنجازاتك تبدأ هنا" : "your journey is taking shape"}</span></article></div>
            <section className="dashboard-panel applications-panel"><div className="panel-heading"><div><span className="eyebrow"><span className="eyebrow-dot" />KEEP YOUR MOMENTUM</span><h2>{text.dashboard.applications}</h2></div><Link className="text-link" href={`/${locale}/programs`}>{text.dashboard.viewAll}{arrow}</Link></div>
              {studentApplications.length ? <div className="application-list">{studentApplications.slice(0, 4).map((application) => {
                const opportunity = application.opportunity;
                const university = application.university;
                const status = statusLabels[application.status];
                return <article className="application-row" key={application.id}><span className="application-mark">{university?.name[locale].slice(0, 2)}</span><div className="application-info"><strong>{opportunity?.title[locale]}</strong><span>{university?.name[locale]} · {application.reference}</span></div><span className={`status-pill ${status.className}`}>{status[locale]}</span><span className="application-date">{dateFormatter.format(new Date(application.submittedAt))}</span></article>;
              })}</div> : <div className="empty-dash"><span>{locale === "ar" ? "لم تبدأ أي طلب بعد" : "No applications yet"}</span><Link href={`/${locale}/programs`}>{text.common.exploreNow}{arrow}</Link></div>}
            </section>
            <section className="dashboard-panel recommendations-panel"><div className="panel-heading"><div><span className="eyebrow"><span className="eyebrow-dot" />A GOOD PLACE TO START</span><h2>{text.dashboard.recommended}</h2></div><Link className="text-link" href={`/${locale}/programs`}>{text.dashboard.viewAll}{arrow}</Link></div><div className="recommendation-grid">{allRecommended.map(({ opportunity, university }, index) => <OpportunityCard key={opportunity.id} opportunity={opportunity} university={university} locale={locale} text={text} index={index} />)}</div></section>
          </section>
          <aside className="dashboard-side-column"><section className="profile-card"><div className="profile-top"><span className="profile-avatar">{student.name[locale].slice(0, 1)}</span><span className="profile-complete"><Sparkles size={14} />{locale === "ar" ? "ملفك الشخصي" : "Your profile"}</span></div><h2>{student.name[locale]}</h2><p>{student.field} · {student.country}</p><div className="profile-progress"><span><span /></span><small>{locale === "ar" ? "ملف مكتمل بنسبة ٨٠٪" : "Profile is 80% complete"}</small></div><Link href={`/${locale}/dashboard/profile`}>{locale === "ar" ? "إكمال الملف الشخصي" : "Complete your profile"}{arrow}</Link></section>
            <section className="dashboard-panel notifications-panel"><div className="panel-heading"><div><span className="eyebrow"><span className="eyebrow-dot" />DON’T MISS A THING</span><h2>{text.dashboard.notifications}</h2></div><Bell size={17} /></div><div className="notification-list">{userNotifications.map((notification) => <article className="notification-row" key={notification.id}><span className="notification-dot" /><div><strong>{notification.title[locale]}</strong><p>{notification.body[locale]}</p><small><CalendarDays size={12} />{dateFormatter.format(new Date(notification.date))}</small></div></article>)}</div><Link className="notification-more" href={`/${locale}/dashboard/notifications`}>{text.dashboard.viewAll}{arrow}</Link></section>
            <div className="deadline-reminder"><span className="reminder-icon"><Clock3 size={18} /></span><div><strong>{locale === "ar" ? "لا تدع الفرصة تفوتك" : "A little reminder"}</strong><p>{locale === "ar" ? "بعض المنح تغلق قريباً. ابدأ طلبك اليوم." : "Some scholarships close soon. Start your application today."}</p><Link href={`/${locale}/programs?type=scholarship`}>{locale === "ar" ? "اكتشف المنح" : "Explore scholarships"}{arrow}</Link></div></div>
          </aside>
        </div>
      </div>
    </div>
  );
}
