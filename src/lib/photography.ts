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

interface ParsedDescriptor {
  title: string;
  date: Date;
  dateHasDay: boolean;
  location?: string;
  recognition?: string;
}

// Parses "[title]_YYYY-MM[-DD][_location][_recognition]" — used both for a solo photo's
// filename and a collection's folder name. Title, location, and recognition are all optional;
// only the date is required.
function parseDescriptor(base: string): ParsedDescriptor | null {
  const parts = base.split('_');

  const isDate = (part: string) => /^\d{4}-\d{2}(-\d{2})?$/.test(part);
  const dateIdx = parts.findIndex(isDate);
  if (dateIdx === -1 || dateIdx > 1) return null;

  const titleSlug = dateIdx === 1 ? parts[0] : undefined;
  const dateRaw = parts[dateIdx];
  const rest = parts.slice(dateIdx + 1);
  if (rest.length > 2) return null;
  const [locationSlug, recognitionSlug] = rest;

  const { date, hasDay } = parseDate(dateRaw);
  return {
    title: titleSlug ? decode(titleSlug) : '',
    date,
    dateHasDay: hasDay,
    location: locationSlug ? decode(locationSlug) : undefined,
    recognition: recognitionSlug ? decode(recognitionSlug) : undefined,
  };
}

interface ParsedEntry extends ParsedDescriptor {
  slug: string;
  images: string[];
}

function parseSoloPhoto(file: string): ParsedEntry | null {
  const base = file.replace(/\.webp$/i, '');
  const descriptor = parseDescriptor(base);
  if (!descriptor) return null;
  return { ...descriptor, slug: base, images: [`/images/photography/${file}`] };
}

function parseCollection(folder: string): ParsedEntry | null {
  const descriptor = parseDescriptor(folder);
  if (!descriptor) return null;

  const numbered = readdirSync(join(DIR, folder))
    .map((file) => ({ n: Number(/^(\d+)\.webp$/i.exec(file)?.[1]), file }))
    .filter((entry): entry is { n: number; file: string } => !Number.isNaN(entry.n))
    .sort((a, b) => a.n - b.n);
  if (numbered.length === 0) return null;

  return {
    ...descriptor,
    slug: folder,
    images: numbered.map(({ file }) => `/images/photography/${folder}/${file}`),
  };
}

export function getPhotographyEntries(): NormalizedEntry<'photography'>[] {
  let dirents: import('node:fs').Dirent[];
  try {
    dirents = readdirSync(DIR, { withFileTypes: true });
  } catch {
    dirents = [];
  }

  const entries: ParsedEntry[] = [];
  for (const dirent of dirents) {
    if (dirent.isDirectory()) {
      const parsed = parseCollection(dirent.name);
      if (parsed) entries.push(parsed);
    } else if (dirent.isFile() && dirent.name.toLowerCase().endsWith('.webp')) {
      const parsed = parseSoloPhoto(dirent.name);
      if (parsed) entries.push(parsed);
    }
  }

  entries.sort((a, b) => b.date.getTime() - a.date.getTime());

  return entries.map((entry, i) => ({
    id: entry.slug,
    slug: entry.slug,
    department: 'photography',
    title: entry.title,
    date: entry.date,
    dateHasDay: entry.dateHasDay,
    description: '',
    coverImage: entry.images[0],
    images: entry.images,
    featured: true,
    featuredOrder: undefined,
    tags: [],
    status: undefined,
    recognition: entry.recognition,
    archiveCode: generateArchiveCode('photography', i + 1),
    href: `/photography#${entry.slug}`,
    rawEntry: { data: { location: entry.location } },
  }));
}
