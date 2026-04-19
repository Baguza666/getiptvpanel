import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://getiptvpanel.com',
  // Enable React for your ROI Calculator Island
  integrations: [
    react(),
    sitemap()
  ],
  vite: {
    plugins: [
      // Enable the new Tailwind v4 Vite compiler
      tailwindcss(),
    ],
  },
});