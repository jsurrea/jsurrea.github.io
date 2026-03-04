export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(dateStr: string, locale: string = 'en'): string {
  const date = new Date(dateStr + 'T00:00:00');
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long' }).format(date);
}

export function sortByDate<T extends { startDate: string }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
}

export function calculateDuration(startDate: string, endDate?: string): string {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  if (months < 12) return `${months} mo`;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  return remMonths > 0 ? `${years} yr ${remMonths} mo` : `${years} yr`;
}
