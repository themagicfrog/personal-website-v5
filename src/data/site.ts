export interface Portal {
  label: string;
  href: string;
  accent: string;
  description: string;
  tagline: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface ContactLink {
  label: string;
  href: string;
}

export interface SiteData {
  title: string;
  description: string;
  email: string;
  navigation: NavItem[];
  portals: Portal[];
  contact: ContactLink[];
  defaultOgImage: string;
}

export function accentForDepartment(department: string): string {
  return site.portals.find((portal) => portal.href === `/${department}`)?.accent ?? 'var(--ink)';
}

export function descriptionForDepartment(department: string): string {
  return site.portals.find((portal) => portal.href === `/${department}`)?.description ?? '';
}

export function taglineForDepartment(department: string): string {
  return site.portals.find((portal) => portal.href === `/${department}`)?.tagline ?? '';
}

export const site: SiteData = {
  title: 'Estella Gu',
  description:
    'Portfolio of Estella Gu — a writer, artist, programmer, photographer, and organizer based in Massachusetts, making games, stories, photographs, objects, websites, and experiments.',
  email: 'estella.tianxing@gmail.com',

  navigation: [
    { label: 'Builds', href: '/builds' },
    { label: 'Art', href: '/art' },
    { label: 'Photography', href: '/photography' },
    { label: 'Writing', href: '/writing' },
    { label: 'Events', href: '/events' },
  ],

  portals: [
    {
      label: 'Builds',
      href: '/builds',
      accent: 'var(--builds)',
      description: 'I build games, websites, tools, and experiments.',
      tagline: 'games, websites, tools & experiments',
    },
    {
      label: 'Photography',
      href: '/photography',
      accent: 'var(--photography)',
      description:
        'I take photographs to document where I go and to pay closer attention to the details, people, and moments I might otherwise pass.',
      tagline: 'street scenes, journeys & visual collections',
    },
    {
      label: 'Writing',
      href: '/writing',
      accent: 'var(--writing)',
      description: 'I write fiction, journalism, essays, and experimental pieces.',
      tagline: 'fiction, journalism, essays & strange ideas',
    },
    {
      label: 'Art',
      href: '/art',
      accent: 'var(--art)',
      description: 'I make drawings, digital work, books, objects, and mixed-media projects.',
      tagline: 'drawings, books, objects & mixed media',
    },
    {
      label: 'Events',
      href: '/events',
      accent: 'var(--events)',
      description: 'I organize and take part in programs, workshops, and creative communities.',
      tagline: 'programs, workshops & creative collaborations',
    },
  ],

  contact: [
    { label: 'GitHub', href: 'https://github.com/themagicfrog' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/estellagu/' },
    { label: 'Instagram', href: 'https://www.instagram.com/estella.gu_/' },
  ],

  defaultOgImage: '/textures/background-texture.png',
};
