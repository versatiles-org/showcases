import vue from '@vitejs/plugin-vue';
import { defineConfig, type Plugin } from 'vite';
import { loadShowcases } from './src/data.ts';

/** Exposes showcases.yaml to the page as the module `virtual:showcases`. */
function showcasesData(): Plugin {
	const id = 'virtual:showcases';
	return {
		name: 'showcases-data',
		resolveId: (source) => (source === id ? `\0${id}` : undefined),
		load(resolved) {
			if (resolved !== `\0${id}`) return;
			this.addWatchFile('showcases.yaml');
			return `export default ${JSON.stringify(loadShowcases())};`;
		},
	};
}

export default defineConfig({
	base: '/showcases/',
	plugins: [vue(), showcasesData()],
	build: { target: 'esnext' },
});
