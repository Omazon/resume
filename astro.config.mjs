import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://omazon.github.io',
  base: '/resume',
  vite: {
    plugins: [tailwindcss()],
  },
});
