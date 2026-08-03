import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Layout from '../src/layouts/Layout.astro';

test('Layout renders en-GB landmarks, skip link and supplied content', async () => {
  const container = await AstroContainer.create();
  const result = await container.renderToString(Layout, {
    props: { title: 'Test page', description: 'Test description for the layout.' },
    slots: { default: '<section><h1>Test content</h1></section>' },
  });

  expect(result).toMatch(/<html[^>]*lang="en-GB"/i);
  expect(result).toContain('href="#main-content"');
  expect(result).toContain('<main id="main-content">');
  expect(result).toContain('Test content');
  expect(result).toContain('Request Pricing');
});
