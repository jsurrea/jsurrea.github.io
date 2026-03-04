import { en } from '../i18n/en';
import { es } from '../i18n/es';

export type Locale = 'en' | 'es';

const translations = { en, es } as const;

export function getLangFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en' || lang === 'es') return lang;
  return 'en';
}

function resolve(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: any,
  keys: string[]
): string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = obj;
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return undefined;
    }
  }
  return typeof value === 'string' ? value : undefined;
}

export function useTranslations(lang: Locale) {
  return function t(key: string): string {
    const keys = key.split('.');
    return resolve(translations[lang], keys) ?? resolve(translations['en'], keys) ?? key;
  };
}
