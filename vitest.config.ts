import { getViteConfig } from 'astro/config';

export default getViteConfig({
  // Vitest supports this Vite extension at runtime; Astro's config type does not expose it.
  // @ts-expect-error Vitest configuration is intentionally embedded in the Astro Vite config.
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./__tests__/setup.ts'],
    exclude: ['e2e/**', 'node_modules/**'],
  },
});
