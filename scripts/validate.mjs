import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const html = readFileSync(join(root, 'dist', 'index.html'), 'utf8');
const css = readFileSync(join(root, 'dist', 'styles.css'), 'utf8');
const js = readFileSync(join(root, 'dist', 'main.js'), 'utf8');
const errors = [];

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicateIds.length) errors.push(`Duplicate IDs: ${[...new Set(duplicateIds)].join(', ')}`);

for (const match of html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)) {
  if (!existsSync(join(root, 'dist', match[1]))) errors.push(`Missing asset: ${match[1]}`);
}

for (const match of html.matchAll(/href="#([^"]+)"/g)) {
  if (!ids.includes(match[1])) errors.push(`Missing anchor target: #${match[1]}`);
}

for (const required of ['<header', '<main', '<footer', '<h1', 'meta name="description"', 'prefers-reduced-motion']) {
  if (!(html + css).includes(required)) errors.push(`Required pattern missing: ${required}`);
}

for (const required of ['data-brand-intro', 'neaseIntroPlayed', 'intro-pending', 'intro-running']) {
  if (!(html + css + js).includes(required)) errors.push(`Brand intro pattern missing: ${required}`);
}

for (const forbidden of ['AttivoONE', 'PROJECT 40', 'まだまだ、いける。', '40代', '社長', 'BUSINESS DESIGN / YAMAGATA']) {
  if ((html + css + js).includes(forbidden)) errors.push(`Forbidden copy found: ${forbidden}`);
}

if (!html.includes('width="456" height="278"')) errors.push('Logo dimensions are missing.');
if (!html.includes('fetchpriority="high"')) errors.push('Hero preload priority is missing.');
if (!css.includes('.name-meaning')) errors.push('Acronym presentation is missing.');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(process.argv.includes('--build') ? 'Static build verified: dist/' : 'Lint passed: HTML, CSS, JS, assets, anchors, and content rules');
