import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    '/art/photography': '/photography',
    '/art/photography/[slug]': '/photography/[slug]',
  },
});
