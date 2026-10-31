import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as loadYaml } from 'js-yaml';

export interface Showcase {
	title: string;
	url: string;
	source: string;
	country: string;
	description: string;
	image: string;
	slug: string;
	tags: string[];
}

export interface ShowcasesData {
	showcases: Showcase[];
	countries: string[];
	tags: string[];
}

/** Reads showcases.yaml. Runs in Node at build time; the page gets the result as `virtual:showcases`. */
export function loadShowcases(): ShowcasesData {
	const path = resolve(fileURLToPath(import.meta.url), '../../showcases.yaml');
	const showcases = loadYaml(readFileSync(path, 'utf-8')) as Showcase[];

	showcases.forEach((s) => {
		s.slug = s.image.replace(/\.(png|jpe?g|webp)$/i, '');
		s.image = `/showcases/${s.slug}.webp`;
	});

	showcases.sort((a, b) => a.source.localeCompare(b.source, 'en', { sensitivity: 'base' }));

	const countries = [...new Set(showcases.map((s) => s.country))].sort();
	const tags = [...new Set(showcases.flatMap((s) => s.tags))].sort();

	return { showcases, countries, tags };
}
