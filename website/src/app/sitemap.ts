import type { MetadataRoute } from "next";

import { container } from "@/infrastructure/di/container";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://manhal.example";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const programs = await container.controllers.programs.list();
  const staticPaths = ["", "/programs", "/universities", "/about", "/contact", "/faq", "/privacy", "/terms", "/track"];
  const pages = ["ar", "en"].flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${baseUrl}/${locale}${path}`,
      alternates: {
        languages: {
          ar: `${baseUrl}/ar${path}`,
          en: `${baseUrl}/en${path}`,
        },
      },
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
  );
  const detailPages = programs.flatMap(({ opportunity }) =>
    ["ar", "en"].map((locale) => ({
      url: `${baseUrl}/${locale}/programs/${opportunity.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  );
  return [...pages, ...detailPages];
}
