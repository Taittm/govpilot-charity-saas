export const DAY_MS = 24 * 60 * 60 * 1000;

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Adds months while clamping to the target month's last day, so e.g. 31 Jan
// + 10 months lands on 30 Nov rather than overflowing into 1 Dec — JS's
// native setMonth() overflows instead of clamping, which matters for any
// month-end anchor date (financial year ends, statutory one-month-from-date
// calculations).
export function addMonths(date: Date, months: number): Date {
  const day = date.getDate();
  const firstOfTargetMonth = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDayOfTargetMonth = new Date(firstOfTargetMonth.getFullYear(), firstOfTargetMonth.getMonth() + 1, 0).getDate();
  firstOfTargetMonth.setDate(Math.min(day, lastDayOfTargetMonth));
  return firstOfTargetMonth;
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}
