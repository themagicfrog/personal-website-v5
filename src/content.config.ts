import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

function flexibleDate() {
  return z.union([z.date(), z.string()]).transform((value, ctx) => {
    if (value instanceof Date) return { date: value, hasDay: true };

    if (/^\d{4}-\d{2}$/.test(value)) return { date: new Date(value), hasDay: false };

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      ctx.addIssue({ code: 'custom', message: `Invalid date "${value}" — use YYYY-MM-DD or YYYY-MM.` });
      return z.NEVER;
    }
    return { date, hasDay: true };
  });
}

const externalLink = z.object({
  label: z.string(),
  href: z.string().url(),
});

const base = {
  title: z.string(),
  date: flexibleDate(),
  endDate: flexibleDate().optional(),
  description: z.string(),
  aspectRatio: z.string().optional(),
  links: z.array(externalLink).default([]),
  featured: z.boolean().default(false),
  featuredOrder: z.number().optional(),
  draft: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  status: z.string().optional(),
  recognition: z.string().optional(),
  role: z.string().optional(),
  tools: z.array(z.string()).default([]),
  medium: z.string().optional(),
  location: z.string().optional(),
  slugOverride: z.string().optional(),
  archiveCode: z.string().optional(),
};

const builds = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/builds' }),
  schema: z.object({
    ...base,
    projectType: z.string().optional(),
  }),
});

const art = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/art' }),
  schema: z.object({
    ...base,
    dimensions: z.string().optional(),
    materials: z.array(z.string()).default([]),
    exhibition: z.string().optional(),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    ...base,
    genre: z.string().optional(),
    publication: z.string().optional(),
    wordCount: z.number().optional(),
    readingTime: z.number().optional(),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/events' }),
  schema: z.object({
    ...base,
    attendance: z.number().optional(),
    eventType: z.string().optional(),
  }),
});

export const collections = { builds, art, writing, events };
