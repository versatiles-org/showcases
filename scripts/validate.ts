import { existsSync, readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { load as loadYaml } from 'js-yaml';

interface Showcase {
	title: string;
	url: string;
	image: string;
	tags: string[];
}

const ROOT = resolve(fileURLToPath(import.meta.url), '../..');
const SCREENSHOTS_DIR = resolve(ROOT, 'screenshots');
const README_PATH = resolve(ROOT, 'README.md');
const IMAGE_EXTS = /\.(png|jpe?g|webp)$/i;
/** The README advertises how many projects are listed; it has to match the gallery. */
const README_COUNT =
	/\[(\d+) projects using VersaTiles\]\(https:\/\/versatiles\.org\/showcases\/\)/;

const raw = readFileSync(resolve(ROOT, 'showcases.yaml'), 'utf-8');
const showcases = loadYaml(raw) as Showcase[];

let hasError = false;

/** Suggests a screenshot filename for an entry, e.g. "Montreux Noël" -> "montreux-noel.png" */
function suggestImageName(title: string): string {
	const slug = title
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
	return `${slug}.png`;
}

const missingImages = showcases.filter((s) => !s.image);
if (missingImages.length) {
	console.error(
		`[showcases] ${missingImages.length} entr${missingImages.length === 1 ? 'y is' : 'ies are'} missing an "image" field.`,
	);
	console.error('Screenshot each URL below, save it under screenshots/ as the given file name,');
	console.error('then add "image: <file name>" to the entry.\n');
	for (const s of missingImages) {
		console.error(`  ${suggestImageName(s.title)}`);
		console.error(`    title: ${s.title}`);
		console.error(`    url:   ${s.url}\n`);
	}
	hasError = true;
}

const tagCounts = new Map<string, number>();
showcases.forEach((s) => s.tags.forEach((t) => tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1)));

const singletons = [...tagCounts.entries()]
	.filter(([, n]) => n === 1)
	.map(([t]) => t)
	.sort();

if (singletons.length) {
	console.error(`[showcases] tags used only once (possible typos): ${singletons.join(', ')}`);
	hasError = true;
}

const duplicateTags = showcases.filter((s) => new Set(s.tags).size !== s.tags.length);
if (duplicateTags.length) {
	console.error(
		`[showcases] entries listing the same tag twice: ${duplicateTags.map((s) => s.title).join(', ')}`,
	);
	hasError = true;
}

const readmeMatch = readFileSync(README_PATH, 'utf-8').match(README_COUNT);
if (!readmeMatch) {
	console.error(`[showcases] no "[N projects using VersaTiles](…)" link found in README.md`);
	hasError = true;
} else if (Number(readmeMatch[1]) !== showcases.length) {
	console.error(
		`[showcases] README.md advertises ${readmeMatch[1]} projects, but showcases.yaml has ${showcases.length}.`,
	);
	console.error(`Change the link text to "[${showcases.length} projects using VersaTiles]".`);
	hasError = true;
}

if (hasError) {
	process.exit(1);
}

// Warnings below never fail validation: a missing screenshot only degrades the card.
const imageSlugs = new Set(
	(existsSync(SCREENSHOTS_DIR) ? readdirSync(SCREENSHOTS_DIR) : [])
		.filter((f) => IMAGE_EXTS.test(f))
		.map((f) => f.replace(IMAGE_EXTS, '')),
);
const yamlSlugs = new Set(showcases.map((s) => s.image.replace(IMAGE_EXTS, '')));

for (const slug of imageSlugs) {
	if (!yamlSlugs.has(slug)) {
		console.warn(`⚠ Unused image: screenshots/${slug}.* (no YAML entry with image: ${slug}.*)`);
	}
}

const missingScreenshots = showcases.filter(
	(s) => !imageSlugs.has(s.image.replace(IMAGE_EXTS, '')),
);
for (const s of missingScreenshots) {
	console.warn(`⚠ Missing screenshot: screenshots/${s.image}\n    capture ${s.url}`);
}
if (missingScreenshots.length) {
	console.warn(
		`⚠ ${missingScreenshots.length} screenshot(s) missing — those cards render without an image.`,
	);
}

console.log(`[showcases] ${showcases.length} entries valid`);
