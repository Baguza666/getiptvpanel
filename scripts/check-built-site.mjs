import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const productionOrigin = 'https://getiptvpanel.com';
const requestedArea = process.argv[2] || 'all';
const validAreas = new Set(['all', 'routes', 'sitemap', 'metadata', 'canonicals', 'schema', 'links', 'compliance']);
if (!validAreas.has(requestedArea)) throw new Error(`Unknown built-site check area: ${requestedArea}`);
if (!fs.existsSync(dist)) throw new Error('dist/ is missing. Run npm run build first.');

const files = [];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name === 'index.html') files.push(full);
  }
};
walk(dist);

const routeFor = (file) => {
  const relative = path.relative(dist, file).replaceAll(path.sep, '/');
  return relative === 'index.html' ? '/' : `/${relative.replace(/\/index\.html$/, '')}`;
};
const routeUrl = (route) => new URL(route, productionOrigin).toString();
const htmlByRoute = new Map(files.map((file) => [routeFor(file), fs.readFileSync(file, 'utf8')]));
const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const sitemapRoutes = new Set(sitemapUrls.map((url) => new URL(url).pathname.replace(/\/$/, '') || '/'));
const robots = fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8');
const titles = new Map();
const descriptions = new Map();
const internalLinksIn = new Map([...htmlByRoute.keys()].map((route) => [route, 0]));
const errors = [];
const run = (area) => requestedArea === 'all' || requestedArea === area;
const promotionalForbidden = /(?:bypass\s+ISP|anti[- ]?block(?:ing)?|unblock\s+provider|never\s+buffers?|zero\s+buffering|100%\s+uptime|guaranteed\s+(?:uptime|profit|income)|all\s+(?:channels|sports|PPV)|every\s+match|worldwide\s+channels|unlimited\s+profit|official\s+(?:Sky|Premier League)|free\s+M3U)/i;

for (const [route, html] of htmlByRoute) {
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const robotsMeta = html.match(/<meta name="robots" content="([^"]+)"/)?.[1] || 'index, follow';
  const noindex = /noindex/i.test(robotsMeta);
  const h1Count = (html.match(/<h1(?:\s|>)/g) || []).length;

  if (run('routes')) {
    if (!html.includes('<html lang="en-GB"')) errors.push(`${route}: missing en-GB language`);
    if (h1Count !== 1) errors.push(`${route}: expected one H1, found ${h1Count}`);
    if (/\b(?:localhost|127\.0\.0\.1|VERCEL_URL|staging\.)\b/i.test(html)) errors.push(`${route}: production output contains a local or staging hostname`);
  }
  if (run('metadata')) {
    if (!title) errors.push(`${route}: missing title`);
    if (!description) errors.push(`${route}: missing description`);
    if (!noindex && title) {
      if (titles.has(title)) errors.push(`${route}: duplicate indexable title with ${titles.get(title)}`);
      titles.set(title, route);
    }
    if (!noindex && description) {
      if (descriptions.has(description)) errors.push(`${route}: duplicate indexable description with ${descriptions.get(description)}`);
      descriptions.set(description, route);
    }
  }
  if (run('canonicals')) {
    if (canonical !== routeUrl(route)) errors.push(`${route}: incorrect canonical ${canonical}`);
    if (canonical && (!canonical.startsWith(`${productionOrigin}/`) && canonical !== `${productionOrigin}/`)) errors.push(`${route}: canonical uses the wrong origin`);
  }
  if (run('sitemap')) {
    if (noindex && sitemapRoutes.has(route)) errors.push(`${route}: noindex route appears in sitemap`);
    if (!noindex && !sitemapRoutes.has(route)) errors.push(`${route}: indexable route missing from sitemap`);
  }
  if (run('compliance')) {
    if (promotionalForbidden.test(html)) errors.push(`${route}: prohibited promotional claim found`);
    if (html.includes('447000000000')) errors.push(`${route}: contains placeholder phone number 447000000000`);
    if (/\bNo added taxes\b/i.test(html)) errors.push(`${route}: contains unverified claim 'No added taxes'`);
    if (/href="(?:null|#|undefined)"/i.test(html)) errors.push(`${route}: contains null or placeholder href link`);
  }

  if (run('schema')) {
    const schemaBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    if (noindex && schemaBlocks.length) errors.push(`${route}: noindex page emits structured data without a documented exception`);
    for (const match of schemaBlocks) {
      try {
        const schema = JSON.parse(match[1]);
        if (schema['@context'] !== 'https://schema.org' || !Array.isArray(schema['@graph'])) errors.push(`${route}: JSON-LD is not a coherent @graph`);
        if (/"@type":"(?:Product|Offer|Review|AggregateRating|FAQPage)"/.test(JSON.stringify(schema))) errors.push(`${route}: gated or ineligible schema found`);
        if (/\b(?:localhost|127\.0\.0\.1|staging\.)\b/i.test(JSON.stringify(schema))) errors.push(`${route}: schema contains a local or staging hostname`);
      } catch {
        errors.push(`${route}: invalid JSON-LD`);
      }
    }
  }

  if (run('links')) {
    for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
      const href = match[1];
      if (!href.startsWith('/') || href.startsWith('//')) continue;
      const target = href.split(/[?#]/)[0].replace(/\/$/, '') || '/';
      if (!htmlByRoute.has(target)) errors.push(`${route}: broken internal link ${href}`);
      else if (target !== route) internalLinksIn.set(target, (internalLinksIn.get(target) || 0) + 1);
    }
  }
}

if (run('compliance')) {
  const whatsAppNumbers = new Set();
  for (const [, html] of htmlByRoute) {
    for (const match of html.matchAll(/https:\/\/wa\.me\/(\d+)/g)) {
      whatsAppNumbers.add(match[1]);
    }
  }
  if (whatsAppNumbers.size > 1) {
    errors.push(`compliance: multiple WhatsApp numbers found: ${[...whatsAppNumbers].join(', ')}`);
  }
}

if (run('links')) {
  for (const route of sitemapRoutes) {
    if (route !== '/' && (internalLinksIn.get(route) || 0) === 0) errors.push(`${route}: indexable orphan route`);
  }
}

if (run('sitemap')) {
  if (!sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) errors.push('sitemap: invalid or missing XML declaration');
  if (new Set(sitemapUrls).size !== sitemapUrls.length) errors.push('sitemap: duplicate URL');
  for (const url of sitemapUrls) {
    const parsed = new URL(url);
    const route = parsed.pathname.replace(/\/$/, '') || '/';
    if (parsed.origin !== productionOrigin) errors.push(`sitemap: wrong origin ${url}`);
    if (!htmlByRoute.has(route)) errors.push(`sitemap: route does not exist ${route}`);
  }
  if (/Disallow:\s*\/\s*$/m.test(robots)) errors.push('robots.txt: blocks the entire site');
  if (!robots.includes(`Sitemap: ${productionOrigin}/sitemap.xml`)) errors.push('robots.txt: production sitemap reference missing');
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Built-site ${requestedArea} checks passed for ${htmlByRoute.size} public HTML routes (${sitemapRoutes.size} indexable, ${htmlByRoute.size - sitemapRoutes.size} noindex).`);
