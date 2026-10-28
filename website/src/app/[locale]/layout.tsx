import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import { notFound } from "next/navigation";

import { SiteFooter, SiteHeader } from "@/components/site-header";
import { getDictionary, locales, type Locale } from "@/lib/i18n";

const englishFont = Inter({ subsets: ["latin"], variable: "--font-english" });
const arabicFont = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";
  return {
    title: {
      default: isArabic ? "منهل — فصلك القادم يبدأ هنا" : "Manhal — your next chapter starts here",
      template: isArabic ? "%s | منهل" : "%s | Manhal",
    },
    description: isArabic
      ? "اكتشف الجامعات والمنح والبرامج الدراسية التي تناسب طموحك."
      : "Discover universities, scholarships and study programs designed around your ambitions.",
    alternates: {
      canonical: `/${locale}`,
      languages: { ar: "/ar", en: "/en" },
    },
    openGraph: {
      title: isArabic ? "منهل — مستقبلك له مكان" : "Manhal — your future has a place",
      description: isArabic
        ? "اعثر على الجامعة والمنحة المناسبتين مع منهل."
        : "Find the right university and scholarship with Manhal.",
      type: "website",
      locale: isArabic ? "ar_AR" : "en_US",
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: candidate } = await params;
  if (!locales.includes(candidate as Locale)) notFound();

  const locale = candidate as Locale;
  const text = getDictionary(locale);
  return (
    <div lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className={`${englishFont.variable} ${arabicFont.variable} ${locale === "ar" ? "font-arabic" : "font-english"}`}>
        <SiteHeader locale={locale} text={text} />
        <main>{children}</main>
        <SiteFooter locale={locale} text={text} />
    </div>
  );
}
