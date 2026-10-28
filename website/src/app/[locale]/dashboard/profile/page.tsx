import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserRound } from "lucide-react";

import { container } from "@/infrastructure/di/container";
import type { Locale } from "@/domain/model";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: candidate } = await params;
  const locale = candidate as Locale;
  const id = (await cookies()).get("manhal-session")?.value;
  const user = await container.controllers.auth.findActiveUser(id);
  const student = user?.studentId ? await container.controllers.students.getProfile(user.studentId) : undefined;
  if (!student) redirect(`/${locale}/dashboard`);
  const arabic = locale === "ar";
  const labels = arabic
    ? [["الاسم الكامل", student.name.ar], ["البريد الإلكتروني", student.email], ["الدولة", student.country], ["مجال الدراسة", student.field], ["المعدل التراكمي", `${student.gpa.toFixed(1)} / 4.0`], ["رقم الهاتف", student.phone]]
    : [["Full name", student.name.en], ["Email address", student.email], ["Country", student.country], ["Field of study", student.field], ["GPA", `${student.gpa.toFixed(1)} / 4.0`], ["Phone number", student.phone]];
  return <section className="container profile-page"><div className="eyebrow"><span className="eyebrow-dot" />STUDENT PROFILE</div><h1>{arabic ? "ملفي الشخصي" : "My profile"}</h1><p>{arabic ? "معلوماتك تساعدنا في اقتراح الفرص الأنسب لك." : "Your profile helps us recommend the right opportunities for you."}</p><div className="profile-details">{labels.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><div className="profile-tip"><UserRound size={17} />{arabic ? "تأكد من تحديث بياناتك الأكاديمية لنتائج مطابقة أدق." : "Keep your academic details up to date for better recommendations."}</div></section>;
}
