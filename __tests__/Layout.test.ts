import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Layout from '../src/layouts/Layout.astro';

test('Layout renders child content and fr language', async () => {
  const container = await AstroContainer.create();
  
  // Render the layout with a mock slot
  const result = await container.renderToString(Layout, {
    slots: {
      default: '<main data-testid="main-content">Hello Vitest</main>'
    }
  });

  expect(result).toMatch(/<html[^>]*lang="fr"([^>]*)>/i);
  expect(result).toContain('data-testid="main-content"');
  expect(result).toContain('Hello Vitest');
  
  // check for design tokens
  expect(result).toContain('bg-obsidian');
  expect(result).toContain('text-white');
});

