import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  createElement,
  type ReactNode,
} from "react";
import { ar, type Dictionary } from "./locales/ar";
import { en } from "./locales/en";

export type Locale = "ar" | "en";
export type Direction = "rtl" | "ltr";

const DICTIONARIES: Record<Locale, Dictionary> = { ar, en };
const LOCALE_DIR: Record<Locale, Direction> = { ar: "rtl", en: "ltr" };
const STORAGE_KEY = "inspire.locale";
const DEFAULT_LOCALE: Locale = "ar";

// ─── Type-level path helper ──────────────────────────────────────────────────
// Builds dotted-path leaf keys from a nested object type.
type Primitive = string | number | boolean | null | undefined;
type Path<T> = T extends Primitive
  ? never
  : {
      [K in keyof T & string]: T[K] extends Primitive
        ? K
        : `${K}.${Path<T[K]>}`;
    }[keyof T & string];

export type TKey = Path<Dictionary>;

// ─── Locale detection ────────────────────────────────────────────────────────
function readUrlLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  const v = new URLSearchParams(window.location.search).get("lang");
  return v === "ar" || v === "en" ? v : null;
}

function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "ar" || v === "en" ? v : null;
  } catch {
    return null;
  }
}

function readNavigatorLocale(): Locale | null {
  if (typeof navigator === "undefined") return null;
  const lang = (navigator.language || "").toLowerCase();
  if (lang.startsWith("ar")) return "ar";
  if (lang.startsWith("en")) return "en";
  return null;
}

export function detectLocale(): Locale {
  return (
    readUrlLocale() ??
    readStoredLocale() ??
    readNavigatorLocale() ??
    DEFAULT_LOCALE
  );
}

// ─── Lookup ──────────────────────────────────────────────────────────────────
function resolve(dict: Dictionary, key: string): string {
  const parts = key.split(".");
  let cur: unknown = dict;
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return key; // fall back to the key itself if not found
    }
  }
  return typeof cur === "string" ? cur : key;
}

// ─── Context ─────────────────────────────────────────────────────────────────
interface I18nContextValue {
  locale: Locale;
  dir: Direction;
  t: (key: TKey) => string;
  setLocale: (next: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

interface ProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function I18nProvider({ children, initialLocale }: ProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(
    () => initialLocale ?? detectLocale(),
  );

  // Keep the document in sync with the active locale.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = locale;
    document.documentElement.dir = LOCALE_DIR[locale];
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage may be unavailable; ignore.
    }
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    const dict = DICTIONARIES[locale];
    return {
      locale,
      dir: LOCALE_DIR[locale],
      t: (key: TKey) => resolve(dict, key),
      setLocale,
    };
  }, [locale, setLocale]);

  return createElement(I18nContext.Provider, { value }, children);
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used inside <I18nProvider>");
  }
  return ctx;
}

export function useT(): (key: TKey) => string {
  return useI18n().t;
}

export function useLocale(): Locale {
  return useI18n().locale;
}

export function useDirection(): Direction {
  return useI18n().dir;
}
