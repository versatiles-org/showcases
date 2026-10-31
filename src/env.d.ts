declare module '*.vue' {
	import type { DefineComponent } from 'vue';
	const component: DefineComponent;
	export default component;
}

declare module 'virtual:showcases' {
	const data: import('./data').ShowcasesData;
	export default data;
}
