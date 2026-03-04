import { describe, it, expect } from 'vitest';
import { cn, formatDate, sortByDate, calculateDuration } from '../../src/lib/utils';

describe('cn', () => {
  it('joins classes', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });
  it('filters falsy values', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b');
  });
  it('returns empty string for no truthy values', () => {
    expect(cn(false, null, undefined)).toBe('');
  });
  it('returns single class', () => {
    expect(cn('only')).toBe('only');
  });
});

describe('formatDate', () => {
  it('formats date in English', () => {
    const result = formatDate('2024-01-15', 'en');
    expect(result).toContain('January');
    expect(result).toContain('2024');
  });
  it('formats date in Spanish', () => {
    const result = formatDate('2024-01-15', 'es');
    expect(result).toContain('2024');
  });
  it('uses English as default locale', () => {
    const result = formatDate('2024-06-01');
    expect(result).toContain('June');
  });
  it('handles year-month date', () => {
    const result = formatDate('2023-08-01', 'en');
    expect(result).toContain('August');
    expect(result).toContain('2023');
  });
});

describe('sortByDate', () => {
  it('sorts items by startDate descending', () => {
    const items = [
      { startDate: '2020-01-01', name: 'first' },
      { startDate: '2024-01-01', name: 'third' },
      { startDate: '2022-06-01', name: 'second' },
    ];
    const sorted = sortByDate(items);
    expect(sorted[0]?.name).toBe('third');
    expect(sorted[1]?.name).toBe('second');
    expect(sorted[2]?.name).toBe('first');
  });
  it('returns a new array (does not mutate)', () => {
    const items = [
      { startDate: '2020-01-01' },
      { startDate: '2024-01-01' },
    ];
    const sorted = sortByDate(items);
    expect(sorted).not.toBe(items);
  });
  it('handles empty array', () => {
    expect(sortByDate([])).toEqual([]);
  });
  it('handles single item', () => {
    const items = [{ startDate: '2024-01-01' }];
    expect(sortByDate(items)).toEqual(items);
  });
});

describe('calculateDuration', () => {
  it('returns months for short duration', () => {
    const result = calculateDuration('2024-01-01', '2024-06-01');
    expect(result).toBe('5 mo');
  });
  it('returns years for 12+ months', () => {
    const result = calculateDuration('2022-01-01', '2024-01-01');
    expect(result).toBe('2 yr');
  });
  it('returns years and months', () => {
    const result = calculateDuration('2022-01-01', '2023-07-01');
    expect(result).toBe('1 yr 6 mo');
  });
  it('uses current date when no endDate provided', () => {
    const result = calculateDuration('2020-01-01');
    expect(result).toMatch(/yr/);
  });
});
