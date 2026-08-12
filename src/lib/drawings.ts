import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { NormalizedEntry } from './content';
import { generateArchiveCode } from './format';

const DIR = join(process.cwd(), 'public', 'images', 'art', 'drawings');

// Sketches are filed by date alone: "YYYY-MM[-DD][_n].webp", where the optional
// _n only separates several drawings made in the same month. Drop a new file in
// public/images/art/drawings/ and it shows up in the gallery.
const FILE_PATTERN = /^(\d{4}-\d{2}(?:-\d{2})?)(?:_(\d+))?\.webp$/i;

interface ParsedDrawing {
  slug: string;
  file: string;
  date: Date;
  dateHasDay: boolean;
  index: number;
}

function parseDrawing(file: string): ParsedDrawing | null {
  const match = FILE_PATTERN.exec(file);
  if (!match) return null;

  const [, dateRaw, indexRaw] = match;
  const date = new Date(dateRaw);
  if (Number.isNaN(date.getTime())) return null;

  return {
    slug: file.replace(/\.webp$/i, ''),
    file,
    date,
    dateHasDay: dateRaw.length > 7,
    index: indexRaw ? Number(indexRaw) : 0,
  };
}

export function getDrawingEntries(): NormalizedEntry[] {
  let files: string[];
  try {
    files = readdirSync(DIR);
  } catch {
    files = [];
  }

  const drawings = files
    .map(parseDrawing)
    .filter((drawing): drawing is ParsedDrawing => drawing !== null)
    .sort((a, b) => b.date.getTime() - a.date.getTime() || a.index - b.index);

  return drawings.map((drawing, i) => ({
    id: drawing.slug,
    slug: drawing.slug,
    department: 'art',
    title: '',
    date: drawing.date,
    dateHasDay: drawing.dateHasDay,
    description: '',
    coverImage: `/images/art/drawings/${drawing.file}`,
    images: [`/images/art/drawings/${drawing.file}`],
    featured: false,
    featuredOrder: undefined,
    tags: [],
    status: undefined,
    recognition: undefined,
    archiveCode: generateArchiveCode('art', i + 1),
    href: `/art#${drawing.slug}`,
    rawEntry: { data: {} },
  }));
}
