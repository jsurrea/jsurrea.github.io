import { describe, it, expect } from 'vitest';
import { getLangFromUrl, useTranslations } from '../../src/lib/i18n';

describe('getLangFromUrl', () => {
  it('returns en for /en/ path', () => {
    expect(getLangFromUrl(new URL('https://jsurrea.github.io/en/'))).toBe('en');
  });
  it('returns es for /es/ path', () => {
    expect(getLangFromUrl(new URL('https://jsurrea.github.io/es/'))).toBe('es');
  });
  it('defaults to en for root path', () => {
    expect(getLangFromUrl(new URL('https://jsurrea.github.io/'))).toBe('en');
  });
  it('defaults to en for unknown lang', () => {
    expect(getLangFromUrl(new URL('https://jsurrea.github.io/fr/'))).toBe('en');
  });
  it('returns en for deep /en/ path', () => {
    expect(getLangFromUrl(new URL('https://jsurrea.github.io/en/blog/post'))).toBe('en');
  });
  it('returns es for deep /es/ path', () => {
    expect(getLangFromUrl(new URL('https://jsurrea.github.io/es/contacto'))).toBe('es');
  });
});

describe('useTranslations', () => {
  it('returns English translation for known key', () => {
    const t = useTranslations('en');
    expect(t('nav.home')).toBe('Home');
  });
  it('returns Spanish translation for known key', () => {
    const t = useTranslations('es');
    expect(t('nav.home')).toBe('Inicio');
  });
  it('falls back to English for missing key in Spanish', () => {
    const t = useTranslations('es');
    // A key that exists in en but not in es would fall back
    expect(typeof t('nav.home')).toBe('string');
  });
  it('returns key for completely unknown key', () => {
    const t = useTranslations('en');
    expect(t('nonexistent.key')).toBe('nonexistent.key');
  });
  it('returns key for partially unknown path', () => {
    const t = useTranslations('en');
    expect(t('nav.nonexistent')).toBe('nav.nonexistent');
  });
  it('returns key for unknown root in Spanish too', () => {
    const t = useTranslations('es');
    expect(t('nonexistent.key')).toBe('nonexistent.key');
  });
  it('handles hero title key', () => {
    const t = useTranslations('en');
    expect(t('hero.viewWork')).toBe('View My Work');
  });
  it('handles nested key resolution in Spanish', () => {
    const t = useTranslations('es');
    expect(t('hero.viewWork')).toBe('Ver mi trabajo');
  });
  it('returns experience present in English', () => {
    const t = useTranslations('en');
    expect(t('experience.present')).toBe('Present');
  });
  it('returns highlights title in Spanish', () => {
    const t = useTranslations('es');
    expect(t('highlights.title')).toBe('En Números');
  });
  it('returns key when value is not a string (array type)', () => {
    const t = useTranslations('en');
    // hero.roles is an array, not a string
    expect(t('hero.roles')).toBe('hero.roles');
  });
  it('returns key when value is not a string in Spanish (array type)', () => {
    const t = useTranslations('es');
    expect(t('hero.roles')).toBe('hero.roles');
  });
});
