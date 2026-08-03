import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://getiptvpanel.com',
  trailingSlash: 'never',
  // React is used only for the interactive profit-calculator island.
  integrations: [
    react()
  ],
  vite: {
    plugins: [
      // Enable the new Tailwind v4 Vite compiler
      tailwindcss(),
    ],
  },
});
