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
  it('returns English translation for nav experience', () => {
    const t = useTranslations('en');
    expect(t('nav.experience')).toBe('Experience');
  });
  it('returns English translation for nav projects', () => {
    const t = useTranslations('en');
    expect(t('nav.projects')).toBe('Projects');
  });
  it('returns key for completely unknown key', () => {
    const t = useTranslations('en');
    expect(t('nonexistent.key')).toBe('nonexistent.key');
  });
  it('returns key for partially unknown path', () => {
    const t = useTranslations('en');
    expect(t('nav.nonexistent')).toBe('nav.nonexistent');
  });
  it('handles hero viewWork key', () => {
    const t = useTranslations('en');
    expect(t('hero.viewWork')).toBe('View My Work');
  });
  it('handles hero downloadCV key', () => {
    const t = useTranslations('en');
    expect(t('hero.downloadCV')).toBe('Download CV');
  });
  it('returns experience present in English', () => {
    const t = useTranslations('en');
    expect(t('experience.present')).toBe('Present');
  });
  it('returns projects viewCode in English', () => {
    const t = useTranslations('en');
    expect(t('projects.viewCode')).toBe('View Code');
  });
  it('returns projects liveDemo in English', () => {
    const t = useTranslations('en');
    expect(t('projects.liveDemo')).toBe('Live Demo');
  });
  it('returns footer madeWith', () => {
    const t = useTranslations('en');
    expect(t('footer.madeWith')).toBe('Made with');
  });
  it('returns key when path does not exist (removed section)', () => {
    const t = useTranslations('en');
    expect(t('highlights.title')).toBe('highlights.title');
  });
  it('returns key when parent object does not exist', () => {
    const t = useTranslations('en');
    expect(t('skills.title')).toBe('skills.title');
  });
  it('handles hero greeting key', () => {
    const t = useTranslations('en');
    expect(t('hero.greeting')).toBe("Hi, I'm");
  });
});
