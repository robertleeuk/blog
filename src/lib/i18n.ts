import { Locale } from '@/types/post';
import koTranslations from '@/translations/ko.json';
import enTranslations from '@/translations/en.json';

type TranslationKeys = typeof koTranslations;

const translations: Record<Locale, TranslationKeys> = {
  ko: koTranslations,
  en: enTranslations,
};

export const defaultLocale: Locale = 'ko';
export const locales: Locale[] = ['ko', 'en'];

// 번역 가져오기
export function getTranslations(locale: Locale): TranslationKeys {
  return translations[locale] || translations[defaultLocale];
}

// 중첩된 키로 번역 가져오기
export function t(locale: Locale, key: string): string {
  const trans = getTranslations(locale);
  const keys = key.split('.');
  
  let result: unknown = trans;
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = (result as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  
  let text = typeof result === 'string' ? result : key;
  
  // 플레이스홀더 치환 (예: {year} → 현재 연도)
  text = text.replace('{year}', new Date().getFullYear().toString());
  
  return text;
}

// 로컬 스토리지에서 언어 설정 가져오기
export function getStoredLocale(): Locale | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('locale');
  if (stored && locales.includes(stored as Locale)) {
    return stored as Locale;
  }
  return null;
}

// 로컬 스토리지에 언어 설정 저장
export function setStoredLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('locale', locale);
}

// 브라우저 언어 감지
export function detectBrowserLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale;
  
  const browserLang = navigator.language.split('-')[0];
  if (locales.includes(browserLang as Locale)) {
    return browserLang as Locale;
  }
  
  return defaultLocale;
}

// 초기 언어 결정
export function getInitialLocale(): Locale {
  const stored = getStoredLocale();
  if (stored) return stored;
  
  return detectBrowserLocale();
}
