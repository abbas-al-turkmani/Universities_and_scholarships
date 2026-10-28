import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { container } from "@/infrastructure/di/container";

export default async function ReviewerLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const sessionId = (await cookies()).get("manhal-session")?.value;
  const user = await container.controllers.auth.findActiveUser(sessionId);
  if (user?.role !== "REVIEWER") redirect(user ? `/${locale}/dashboard` : `/${locale}/login`);
  return children;
}
