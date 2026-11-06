// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare namespace svelteHTML {
	interface IntrinsicElements {
		/** Google's <model-viewer> web component, loaded on demand. */
		'model-viewer': {
			src: string;
			poster?: string;
			alt: string;
			'camera-controls'?: boolean;
			'auto-rotate'?: boolean;
			'shadow-intensity'?: string;
			'environment-image'?: string;
			exposure?: string;
			'camera-orbit'?: string;
			'interaction-prompt'?: 'auto' | 'none';
			loading?: 'auto' | 'lazy' | 'eager';
			class?: string;
		};
	}
}

export {};
