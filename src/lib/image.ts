import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { imageSize } from 'image-size';

const cache = new Map<string, string>();

export function getImageAspectRatio(src: string | undefined, fallback = '4 / 3'): string {
  if (!src) return fallback;
  if (cache.has(src)) return cache.get(src)!;

  try {
    const filePath = join(process.cwd(), 'public', src);
    const { width, height } = imageSize(readFileSync(filePath));
    const ratio = `${width} / ${height}`;
    cache.set(src, ratio);
    return ratio;
  } catch {
    return fallback;
  }
}

interface EntryImages {
  coverImage?: string;
  images: string[];
}

export function getEntryImages(department: string, slug: string): EntryImages {
  const dir = join(process.cwd(), 'public', 'images', department, slug);

  let files: string[];
  try {
    files = readdirSync(dir);
  } catch {
    return { coverImage: undefined, images: [] };
  }

  let coverImage: string | undefined;
  const numbered: { n: number; file: string }[] = [];

  for (const file of files) {
    if (/^cover\.\w+$/i.test(file)) {
      coverImage = `/images/${department}/${slug}/${file}`;
      continue;
    }
    const match = /^(\d+)\.\w+$/.exec(file);
    if (match) {
      numbered.push({ n: Number(match[1]), file });
    }
  }

  numbered.sort((a, b) => a.n - b.n);

  return {
    coverImage,
    images: numbered.map(({ file }) => `/images/${department}/${slug}/${file}`),
  };
}
