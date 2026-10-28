import { cookies } from "next/headers";
import { Bell } from "lucide-react";

import { container } from "@/infrastructure/di/container";
import type { Locale } from "@/domain/model";

export default async function NotificationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: candidate } = await params;
  const locale = candidate as Locale;
  const id = (await cookies()).get("manhal-session")?.value;
  const user = await container.controllers.auth.findActiveUser(id);
  const items = user ? await container.repositories.notifications.listForUser(user.id) : [];
  return <section className="container profile-page"><div className="eyebrow"><span className="eyebrow-dot" />STAY IN THE LOOP</div><h1>{locale === "ar" ? "الإشعارات" : "Notifications"}</h1><p>{locale === "ar" ? "آخر التحديثات حول طلباتك وفرصك." : "The latest updates about your applications and opportunities."}</p><div className="notification-page-list">{items.length ? items.map((item) => <article key={item.id}><span><Bell size={16} /></span><div><strong>{item.title[locale]}</strong><p>{item.body[locale]}</p><small>{new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }).format(new Date(item.date))}</small></div></article>) : <div className="empty-state"><span className="empty-icon"><Bell size={21} /></span><h2>{locale === "ar" ? "لا توجد إشعارات جديدة" : "You're all caught up"}</h2></div>}</div></section>;
}
