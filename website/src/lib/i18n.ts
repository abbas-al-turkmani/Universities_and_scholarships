import ar from "@/messages/ar.json";
import en from "@/messages/en.json";

export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];
export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { ar, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function localized(
  value: { ar: string; en: string },
  locale: Locale,
): string {
  return value[locale];
}
