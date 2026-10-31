import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

/**
 * Writes the rendered gallery into dist/index.html, so search engines and link previews
 * see the cards without running any JavaScript. The server bundle is only needed here.
 */
const ROOT = resolve(fileURLToPath(import.meta.url), '../..');
const SERVER_DIR = resolve(ROOT, '.ssr');
const PAGE = resolve(ROOT, 'dist/index.html');

const { render } = (await import(pathToFileURL(resolve(SERVER_DIR, 'entry-server.js')).href)) as {
	render: () => Promise<string>;
};

// The whitespace has to go as well: hydration expects the container's first child to be
// the app, and a text node in that position would make Vue re-render the whole page.
const placeholder = /<div id="app">\s*<!--app-->\s*<\/div>/;
const html = readFileSync(PAGE, 'utf-8');
if (!placeholder.test(html)) throw new Error('No app placeholder found in dist/index.html');

const content = await render();
writeFileSync(
	PAGE,
	html.replace(placeholder, () => `<div id="app">${content}</div>`),
);
rmSync(SERVER_DIR, { recursive: true });

console.log('✓ prerendered dist/index.html');
