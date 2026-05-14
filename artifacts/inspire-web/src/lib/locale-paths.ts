import type { Locale } from "@/i18n";

export const AR_PREFIX = "/ar";

export function getPathLocale(path: string): Locale | null {
  const pathname = path.split("?")[0] || "/";
  return pathname === AR_PREFIX || pathname.startsWith(`${AR_PREFIX}/`) ? "ar" : null;
}

export function stripLocalePrefix(path: string): string {
  const [pathname, search = ""] = path.split("?");
  const suffix = search ? `?${search}` : "";

  if (pathname === AR_PREFIX) return `/${suffix}`;
  if (pathname.startsWith(`${AR_PREFIX}/`)) {
    const stripped = pathname.slice(AR_PREFIX.length) || "/";
    return `${stripped}${suffix}`;
  }

  return path;
}

export function localizePath(path: string, locale: Locale): string {
  const stripped = stripLocalePrefix(path);
  const [pathname, search = ""] = stripped.split("?");
  const suffix = search ? `?${search}` : "";
  const cleanPath = pathname || "/";

  if (locale === "ar") {
    return cleanPath === "/" ? `${AR_PREFIX}${suffix}` : `${AR_PREFIX}${cleanPath}${suffix}`;
  }

  return `${cleanPath}${suffix}`;
}

export function stripLangParam(path: string): string {
  const [pathname, search = ""] = path.split("?");
  if (!search) return path;

  const params = new URLSearchParams(search);
  params.delete("lang");
  const nextSearch = params.toString();
  return nextSearch ? `${pathname}?${nextSearch}` : pathname;
}
