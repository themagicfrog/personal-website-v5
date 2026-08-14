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
      description: 'i love to build! i find it amazing that with the current tools, it is really possible for anyone to turn the inventions that they can imagine into a reality.\n\ni have experience with web design, game development, app creation, AI, hardware, and more. i enjoy including elements of art and design into my builds.',
      tagline: 'tools, experiments, games & websites',
    },
    {
      label: 'Photography',
      href: '/photography',
      accent: 'var(--photography)',
      description:
        'i enjoy photography because it encourages me to explore the world intentionally and allows me to experience places in a more thoughtful way. i capture and share photos of people, places, and moments that are interesting, meaningful, and beautiful to me.\n\ni am especially drawn to street photography and photographing people, because i find it incredible how much uniqueness of every person\'s life experiences and identity can be shown through a single, honest shot.',
      tagline: 'street scenes, journeys & visual collections',
    },
    {
      label: 'Writing',
      href: '/writing',
      accent: 'var(--writing)',
      description: 'i love writing because it gives me a way to explore my ideas, people, and experiences more deeply.\n\ni write fiction, news, essays, and experimental pieces. i especially enjoy science fiction and mystery.',
      tagline: 'fiction, journalism, essays & strange ideas',
    },
    {
      label: 'Art',
      href: '/art',
      accent: 'var(--art)',
      description: 'i make art because it is fun! i enjoy being able to take an idea and give it a visual form with my own interpretation. i like experimenting with different materials and finding new ways to combine them.\n\ni work across drawing, digital art, 3D modeling, mixed media and i am constantly trying new things. a lot of my work is inspired by people, everyday life, nature, and the small details or ideas that catch my attention.',
      tagline: 'drawings, books, objects & mixed media',
    },
    {
      label: 'Events',
      href: '/events',
      accent: 'var(--events)',
      description: 'i am a leader at <a href="https://hackclub.com/" target="_blank" rel="noreferrer">Hack Club</a>, a community of 100k+ teen makers across the world. i organize and participate in various programs, workshops, and events.',
      tagline: 'programs, workshops, communities & shared making',
    },
  ],

  contact: [
    { label: 'GitHub', href: 'https://github.com/themagicfrog' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/estellagu/' },
    { label: 'Instagram', href: 'https://www.instagram.com/estella.gu_/' },
  ],

  defaultOgImage: '/textures/background-texture.png',
};
