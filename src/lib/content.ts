import { getCollection, render, type CollectionEntry } from 'astro:content';
import { generateArchiveCode } from './format';
import { getEntryImages } from './image';

export type Department = 'builds' | 'art' | 'photography' | 'writing' | 'events';
export type CollectionDepartment = Exclude<Department, 'photography'>;

export const DEPARTMENT_LABEL: Record<Department, string> = {
  builds: 'Builds',
  art: 'Art',
  photography: 'Photography',
  writing: 'Writing',
  events: 'Events',
};

export const DEPARTMENT_LABEL_SINGULAR: Record<Department, string> = {
  builds: 'Build',
  art: 'Art',
  photography: 'Photograph',
  writing: 'Writing',
  events: 'Event',
};

export interface NormalizedEntry<D extends Department = Department> {
  id: string;
  slug: string;
  department: D;
  title: string;
  date: Date;
  dateHasDay: boolean;
  endDate?: Date;
  description: string;
  coverImage?: string;
  images: string[];
  featured: boolean;
  featuredOrder?: number;
  tags: string[];
  status?: string;
  recognition?: string;
  archiveCode: string;
  href: string;
  rawEntry: D extends CollectionDepartment ? CollectionEntry<D> : { data: Record<string, unknown> };
}

export function entryData(entry: NormalizedEntry): Record<string, unknown> {
  return entry.rawEntry.data as Record<string, unknown>;
}

export interface ExternalLink {
  label: string;
  href: string;
}

function normalizeEntry<D extends CollectionDepartment>(
  entry: CollectionEntry<D>,
  department: D,
  archiveIndex: number
): NormalizedEntry<D> {
  const slug = entry.data.slugOverride ?? entry.id;
  const { coverImage, images } = getEntryImages(department, slug);
  return {
    id: entry.id,
    slug,
    department,
    title: entry.data.title,
    date: entry.data.date.date,
    dateHasDay: entry.data.date.hasDay,
    endDate: entry.data.endDate?.date,
    description: entry.data.description,
    coverImage,
    images,
    featured: entry.data.featured,
    featuredOrder: entry.data.featuredOrder,
    tags: entry.data.tags,
    status: entry.data.status,
    recognition: entry.data.recognition,
    archiveCode: entry.data.archiveCode ?? generateArchiveCode(department, archiveIndex),
    href: `/${department}/${slug}`,
    rawEntry: entry as NormalizedEntry<D>['rawEntry'],
  };
}

export async function getPublishedCollection<D extends CollectionDepartment>(
  department: D
): Promise<NormalizedEntry<D>[]> {
  const entries = await getCollection(department, ({ data }) => !data.draft);
  const chronological = [...entries].sort((a, b) => a.data.date.date.getTime() - b.data.date.date.getTime());
  return chronological.map((entry, i) => normalizeEntry(entry, department, i + 1));
}

export async function getDepartmentStaticPaths<D extends CollectionDepartment>(department: D) {
  const entries = await getPublishedCollection(department);
  return entries.map((entry) => ({ params: { slug: entry.slug }, props: { entry } }));
}

export function sortByDate<D extends Department>(entries: NormalizedEntry<D>[]): NormalizedEntry<D>[] {
  return [...entries].sort((a, b) => {
    const dateDiff = b.date.getTime() - a.date.getTime();
    if (dateDiff !== 0) return dateDiff;
    return a.title.localeCompare(b.title);
  });
}

export async function getEntryDetail<D extends CollectionDepartment>(entry: NormalizedEntry<D>) {
  const { Content } = await render(entry.rawEntry);
  return { Content };
}
