import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { NormalizedEntry } from './content';
import { generateArchiveCode } from './format';

const DIR = join(process.cwd(), 'public', 'images', 'photography');

function decode(slug: string): string {
  return slug
    .split('--')
    .map((clause) => clause.replace(/-/g, ' '))
    .join(', ');
}

function parseDate(raw: string): { date: Date; hasDay: boolean } {
  if (/^\d{4}-\d{2}$/.test(raw)) return { date: new Date(raw), hasDay: false };
  return { date: new Date(raw), hasDay: true };
}

interface ParsedPhoto {
  file: string;
  slug: string;
  title: string;
  date: Date;
  dateHasDay: boolean;
  location: string;
  recognition?: string;
}

function parseFilename(file: string): ParsedPhoto | null {
  const base = file.replace(/\.webp$/i, '');
  const parts = base.split('_');

  // A trailing part that's purely digits (e.g. "_1", "_2") is just a disambiguator to keep
  // filenames unique when multiple photos share the same title/date/location — not real data.
  if (parts.length > 0 && /^\d+$/.test(parts[parts.length - 1])) {
    parts.pop();
  }

  const isDate = (part: string) => /^\d{4}-\d{2}(-\d{2})?$/.test(part);
  const dateIdx = parts.findIndex(isDate);
  if (dateIdx === -1 || dateIdx > 1) return null;

  // Title is optional — if the filename starts straight with the date, there's no title.
  const titleSlug = dateIdx === 1 ? parts[0] : undefined;
  const dateRaw = parts[dateIdx];
  const locationSlug = parts[dateIdx + 1];
  const recognitionSlug = parts[dateIdx + 2];
  if (!locationSlug) return null;

  const { date, hasDay } = parseDate(dateRaw);
  return {
    file,
    slug: titleSlug ?? base,
    title: titleSlug ? decode(titleSlug) : '',
    date,
    dateHasDay: hasDay,
    location: decode(locationSlug),
    recognition: recognitionSlug ? decode(recognitionSlug) : undefined,
  };
}

export function getPhotographyEntries(): NormalizedEntry<'photography'>[] {
  let files: string[];
  try {
    files = readdirSync(DIR).filter((file) => file.toLowerCase().endsWith('.webp'));
  } catch {
    files = [];
  }

  const photos = files
    .map(parseFilename)
    .filter((photo): photo is ParsedPhoto => photo !== null)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  return photos.map((photo, i) => ({
    id: photo.slug,
    slug: photo.slug,
    department: 'photography',
    title: photo.title,
    date: photo.date,
    dateHasDay: photo.dateHasDay,
    description: '',
    coverImage: `/images/photography/${photo.file}`,
    images: [],
    featured: true,
    featuredOrder: undefined,
    tags: [],
    status: undefined,
    recognition: photo.recognition,
    archiveCode: generateArchiveCode('photography', i + 1),
    href: `/photography#${photo.slug}`,
    rawEntry: { data: { location: photo.location } },
  }));
}
