import { en } from '../i18n/en';

export type Locale = 'en';

const translations = { en } as const;

export function getLangFromUrl(_url: URL): Locale {
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
    return resolve(translations[lang], keys) ?? key;
  };
}
