import type { Department } from './content';

const DEPARTMENT_CODE: Record<Department, string> = {
  builds: 'BLD',
  art: 'ART',
  photography: 'PH',
  writing: 'WRT',
  events: 'EVT',
};

function departmentCode(department: Department): string {
  return DEPARTMENT_CODE[department];
}

export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

function formatDateFull(date: Date, hasDay = true): string {
  if (!hasDay) {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  }
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

export function formatDateRange(date: Date, endDate?: Date, hasDay = true): string {
  if (!endDate) return formatDateFull(date, hasDay);

  const startMonth = date.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
  const startYear = date.getUTCFullYear();
  const endMonth = endDate.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
  const endYear = endDate.getUTCFullYear();

  if (startYear !== endYear) return `${startMonth} ${startYear} – ${endMonth} ${endYear}`;
  if (startMonth !== endMonth) return `${startMonth} – ${endMonth} ${startYear}`;
  return `${startMonth} ${startYear}`;
}

function formatYear(date: Date): string {
  return String(date.getUTCFullYear());
}

export function formatYearRange(date: Date, endDate?: Date): string {
  const startYear = formatYear(date);
  if (!endDate) return startYear;
  const endYear = formatYear(endDate);
  return startYear === endYear ? startYear : `${startYear}–${endYear}`;
}

export function formatWordCount(count: number): string {
  return `${count.toLocaleString('en-US')} WORDS`;
}

export function formatReadingTime(minutes: number): string {
  return `${Math.max(1, Math.round(minutes))} MIN READ`;
}

export function generateArchiveCode(department: Department, index: number): string {
  return `EG—${departmentCode(department)}—${String(index).padStart(3, '0')}`;
}
