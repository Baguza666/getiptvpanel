import { expect, test } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

test('Homepage injects valid JSON-LD structured data into the DOM', async () => {
    const htmlPath = path.resolve(__dirname, '../dist/index.html');
    if (!fs.existsSync(htmlPath)) {
        console.warn('dist/index.html not found, skipping validation. Run build first.');
        return;
    }
    const html = fs.readFileSync(htmlPath, 'utf-8');

    // Assert that the script tags exist
    expect(html).toContain('type="application/ld+json"');

    // Extract JSON payload from script tags (primitive approach without DOMParser)
    const jsonMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
    expect(jsonMatches).not.toBeNull();
    // At least 3 objects should be present: Organization, FAQPage, SoftwareApplication
    expect(jsonMatches!.length).toBeGreaterThanOrEqual(3);

    const jsonList = jsonMatches!.map(match => {
        const content = match.replace(/<script type="application\/ld\+json">|<\/script>/g, '');
        return JSON.parse(content);
    });

    const types = jsonList.map(j => j['@type']);

    // Assert required schema types
    expect(types).toContain('Organization');
    expect(types).toContain('FAQPage');
    expect(types).toContain('SoftwareApplication');

    // Assert Organization rules
    const org = jsonList.find(j => j['@type'] === 'Organization');
    expect(org.name).toBe('getiptvpanel');
    expect(org.url).toBe('https://getiptvpanel.com');

    // Assert FAQ rules
    const faq = jsonList.find(j => j['@type'] === 'FAQPage');
    expect(faq.mainEntity.length).toBeGreaterThanOrEqual(2);
    expect(faq.mainEntity[0]['@type']).toBe('Question');

    // Assert Pricing rules
    const app = jsonList.find(j => j['@type'] === 'SoftwareApplication');
    expect(app.offers.length).toBe(3);
    const prices = app.offers.map((o: any) => o.price);
    expect(prices).toContain('140');
    expect(prices).toContain('600');
    expect(prices).toContain('1000');
    expect(app.offers[0].priceCurrency).toBe('EUR');
});
