import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Page } from 'cheerio_cms';
import { format } from 'prettier';

/**
 * versatiles.org publishes a page shell for each subproject that lives on its own. It has
 * none for this one yet, so this borrows the one for Tools and undoes what is specific to
 * it. Once versatiles.org has docs/showcases.md, point this at /showcases.html instead.
 */
const TEMPLATE_URL = 'https://versatiles.org/tools.html';
const PAGE_URL = 'https://versatiles.org/showcases/';
const TITLE = 'VersaTiles - Showcases';
const DESCRIPTION = 'A collection of projects and applications using VersaTiles.';
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
	.$(
		[
			'title',
			'link[rel="canonical"]',
			'meta[name="description"]',
			'meta[property^="og:"]',
			'meta[name^="twitter:"]',
		].join(', '),
	)
	.remove();

page.$('nav li.selected').removeClass('selected');
page
	.$('#github-link a')
	.attr('href', 'https://github.com/versatiles-org/showcases/edit/main/showcases.yaml');
page.$('main').removeClass('markdown-body').addClass('gallery');

page
	.addHead(
		`<title>${TITLE}</title>
		<meta name="description" content="${DESCRIPTION}">
		<link rel="canonical" href="${PAGE_URL}">
		<meta property="og:type" content="website">
		<meta property="og:site_name" content="VersaTiles">
		<meta property="og:url" content="${PAGE_URL}">
		<meta property="og:title" content="${TITLE}">
		<meta property="og:description" content="${DESCRIPTION}">
		<meta property="og:image" content="${PAGE_URL}social.jpg">
		<meta property="og:image:type" content="image/jpeg">
		<meta property="og:image:width" content="1200">
		<meta property="og:image:height" content="675">
		<meta property="og:image:alt" content="${SOCIAL_IMAGE_ALT}">
		<meta name="twitter:card" content="summary_large_image">`,
	)
	.setContent(
		'<div id="app"><!--app--></div><script type="module" src="/src/entry-client.ts"></script>',
	);

writeFileSync(
	'index.html',
	await format(page.render(), { parser: 'html', printWidth: 120, useTabs: true }),
);
