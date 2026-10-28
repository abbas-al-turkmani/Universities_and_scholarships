import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Manhal — your next chapter starts here",
  description:
    "Discover universities, scholarships and study programs designed around your ambitions.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
