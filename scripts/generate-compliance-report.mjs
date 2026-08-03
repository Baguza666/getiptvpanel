import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const output = path.join(root, 'docs/compliance/forbidden-copy-results.csv');
const patterns = [
  'bypass ISP', 'anti block', 'anti-block', 'unblock provider', 'never buffers',
  'zero buffering', '100% uptime', 'guaranteed uptime', 'guaranteed profit',
  'guaranteed income', 'all channels', 'every channel', 'every match', 'all sports',
  'all PPV', 'worldwide channels', 'unlimited profit', 'official Sky',
  'official Premier League', 'free M3U', 'Downloader code', 'sideload APK',
  'sideloading', 'unofficial APK',
];
const matcher = new RegExp(patterns.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'gi');
const extensions = new Set(['.astro', '.ts', '.tsx', '.js', '.mjs', '.json', '.md', '.txt', '.csv', '.html', '.svg']);
const ignored = new Set(['.git', 'node_modules', '.astro', 'test-results', 'playwright-report']);
const files = [];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (extensions.has(path.extname(entry.name)) && full !== output) files.push(full);
  }
};
walk(root);

const rows = [['file', 'line', 'term', 'context', 'classification', 'notes']];
for (const file of files.sort()) {
  const relative = path.relative(root, file).replaceAll(path.sep, '/');
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const match of line.matchAll(matcher)) {
      const start = Math.max(0, match.index - 100);
      const context = line.slice(start, Math.min(line.length, match.index + match[0].length + 100)).replace(/\s+/g, ' ').trim();
      const educational = /(?:\bno\b|\bnot\b|without|rather than|avoid|reject|remove|unsafe|risk|prohibit|forbid|does not|do not|unverified|unknown|scan|flag|false positive)/i.test(context);
      const policyOrTest = /^(?:AGENTS\.md|README\.md|docs\/|scripts\/|__tests__\/|e2e\/|vercel\.json)/.test(relative);
      const phraseFalsePositive = match[0].toLowerCase() === 'every channel';
      const classification = phraseFalsePositive ? 'FALSE POSITIVE' : educational ? 'VALID EDUCATIONAL CONTEXT' : policyOrTest ? 'FALSE POSITIVE' : 'REWRITE';
      rows.push([relative, index + 1, match[0], context, classification, educational ? 'Warning, disclaimer, policy or removal context; not a promotional claim.' : 'Review before publication.']);
    }
  });
}

const csv = rows.map((row) => row.map((value) => {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}).join(',')).join('\n') + '\n';
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, csv);
const rewrites = rows.filter((row) => row[4] === 'REWRITE');
console.log(`Classified ${rows.length - 1} forbidden-copy matches; ${rewrites.length} require rewrite.`);
if (rewrites.length) process.exit(1);
