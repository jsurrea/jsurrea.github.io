import { describe, it, expect } from 'vitest';
import { getLangFromUrl, useTranslations } from '../../src/lib/i18n';

describe('getLangFromUrl', () => {
  it('returns en for root path', () => {
    expect(getLangFromUrl(new URL('https://jsurrea.github.io/'))).toBe('en');
  });
  it('returns en for any path', () => {
    expect(getLangFromUrl(new URL('https://jsurrea.github.io/projects'))).toBe('en');
  });
  it('returns en for deep path', () => {
    expect(getLangFromUrl(new URL('https://jsurrea.github.io/blog/post'))).toBe('en');
  });
});

describe('useTranslations', () => {
  it('returns English translation for known key', () => {
    const t = useTranslations('en');
    expect(t('nav.home')).toBe('Home');
  });
  it('returns key for completely unknown key', () => {
    const t = useTranslations('en');
    expect(t('nonexistent.key')).toBe('nonexistent.key');
  });
  it('returns key for partially unknown path', () => {
    const t = useTranslations('en');
    expect(t('nav.nonexistent')).toBe('nav.nonexistent');
  });
  it('handles hero title key', () => {
    const t = useTranslations('en');
    expect(t('hero.viewWork')).toBe('View My Work');
  });
  it('returns experience present in English', () => {
    const t = useTranslations('en');
    expect(t('experience.present')).toBe('Present');
  });
  it('returns key when value is not a string (array type)', () => {
    const t = useTranslations('en');
    // hero.roles is an array, not a string
    expect(t('hero.roles')).toBe('hero.roles');
  });
  it('returns highlights title', () => {
    const t = useTranslations('en');
    expect(t('highlights.title')).toBe('By the Numbers');
  });
  it('returns education title', () => {
    const t = useTranslations('en');
    expect(t('education.title')).toBe('Education');
  });
  it('returns projects title', () => {
    const t = useTranslations('en');
    expect(t('projects.title')).toBe('Projects');
  });
  it('returns skills title', () => {
    const t = useTranslations('en');
    expect(t('skills.title')).toBe('Skills');
  });
});
