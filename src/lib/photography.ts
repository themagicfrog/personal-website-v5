import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { NormalizedEntry } from './content';
import { generateArchiveCode } from './format';

const DIR = join(process.cwd(), 'public', 'images', 'photography');

const FEATURED_MARKER = '~';
const COLLECTION_FILE = new RegExp(`^(\\d+)(${FEATURED_MARKER})?\\.webp$`, 'i');

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
  featuredImages: string[];
}

function parseSoloPhoto(file: string): ParsedEntry | null {
  const name = file.replace(/\.webp$/i, '');
  const isFeatured = name.endsWith(FEATURED_MARKER);
  const base = isFeatured ? name.slice(0, -FEATURED_MARKER.length) : name;

  const descriptor = parseDescriptor(base);
  if (!descriptor) return null;

  const src = `/images/photography/${file}`;
  return { ...descriptor, slug: base, images: [src], featuredImages: isFeatured ? [src] : [] };
}

function parseCollection(folder: string): ParsedEntry | null {
  const descriptor = parseDescriptor(folder);
  if (!descriptor) return null;

  const numbered = readdirSync(join(DIR, folder))
    .map((file) => {
      const match = COLLECTION_FILE.exec(file);
      return { n: Number(match?.[1]), featured: Boolean(match?.[2]), file };
    })
    .filter((entry): entry is { n: number; featured: boolean; file: string } => !Number.isNaN(entry.n))
    .sort((a, b) => a.n - b.n);
  if (numbered.length === 0) return null;

  const src = (file: string) => `/images/photography/${folder}/${file}`;
  return {
    ...descriptor,
    slug: folder,
    images: numbered.map(({ file }) => src(file)),
    featuredImages: numbered.filter(({ featured }) => featured).map(({ file }) => src(file)),
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
    rawEntry: { data: { location: entry.location, featuredImages: entry.featuredImages } },
  }));
}
