import { readFileSync } from 'node:fs';
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
