export const locales = ["tr", "en"] as const;
export const defaultLocale = "tr" as const;

export type Locale = (typeof locales)[number];

export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split("/");
  const locale = segments[1] as Locale;

  if (locales.includes(locale)) {
    return locale;
  }

  return defaultLocale;
}

export function addLocaleToPathname(pathname: string, locale: Locale): string {
  if (locale === defaultLocale) {
    return pathname;
  }

  return `/${locale}${pathname}`;
}
