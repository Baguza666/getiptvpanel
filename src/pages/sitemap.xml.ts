import type { APIRoute } from 'astro';
import { indexableRoutes, site } from '../config/site';
import { features } from '../config/features';

const escapeXml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

export const GET: APIRoute = () => {
  const routes = [...indexableRoutes];
  // A trial page is not implemented. The launch validator keeps the feature
  // disabled; never advertise a route that the static build cannot serve.
  if (features.trialEnabled) throw new Error('Trial publication is enabled but /iptv-trial is not implemented.');
  const urls = routes
    .map((path) => `  <url><loc>${escapeXml(new URL(path, site.url).toString())}</loc></url>`)
    .join('\n');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
};
