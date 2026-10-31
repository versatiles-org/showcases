import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Page } from 'cheerio_cms';
import { format } from 'prettier';

const TEMPLATE_URL = 'https://versatiles.org/showcases.html';
const PAGE_URL = 'https://versatiles.org/showcases/';
const SOCIAL_IMAGE_ALT = 'a wall of maps built with VersaTiles, with the VersaTiles logo in front';

process.chdir(fileURLToPath(new URL('../', import.meta.url)));

const response = await fetch(TEMPLATE_URL);
if (!response.ok) {
	throw new Error(`Failed to fetch ${TEMPLATE_URL}: ${response.status} ${response.statusText}`);
}

const page = new Page(await response.text());

// Same-page anchors (e.g. the skip link) must stay relative: `setBaseUrl` would
// turn them into links to the home page, away from the current page.
const fragmentLinks = page.$('[href^="#"]').toArray();
const fragments = fragmentLinks.map((element) => page.$(element).attr('href')!);

page.setBaseUrl(PAGE_URL);
fragmentLinks.forEach((element, i) => page.$(element).attr('href', fragments[i]));

page
	.$('meta[property="og:image"], meta[name="twitter:image"]')
	.attr('content', `${PAGE_URL}social.jpg`);
page
	.$('meta[property="og:image:alt"], meta[name="twitter:image:alt"]')
	.attr('content', SOCIAL_IMAGE_ALT);

page
	.$('#github-link a')
	.attr('href', 'https://github.com/versatiles-org/showcases/edit/main/showcases.yaml');
page.$('main').removeClass('markdown-body').addClass('gallery');

page.setContent(
	'<div id="app"><!--app--></div><script type="module" src="/src/entry-client.ts"></script>',
);

writeFileSync(
	'index.html',
	await format(page.render(), { parser: 'html', printWidth: 120, useTabs: true }),
);
