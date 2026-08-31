/**
 * Which section currently holds the middle of the viewport.
 *
 * Sections register themselves through the `watchSection` action rather than
 * being discovered with a DOM query. The query approach failed silently: the
 * backdrop renders before <main>, so it found nothing, returned early, and no
 * observer was ever created — the first pattern stayed active forever.
 */
export const activeSection = $state({ current: 'hero' });

const names = new WeakMap<Element, string>();
let observer: IntersectionObserver | undefined;

function shared(): IntersectionObserver {
	// Only the section crossing the middle band intersects, so there is exactly
	// one candidate at a time and no tie to break.
	observer ??= new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				const name = names.get(entry.target);
				if (name) activeSection.current = name;
			}
		},
		{ rootMargin: '-40% 0px -40% 0px' }
	);
	return observer;
}

export function watchSection(node: HTMLElement, name: string) {
	names.set(node, name);
	shared().observe(node);

	return {
		destroy() {
			observer?.unobserve(node);
			names.delete(node);
		}
	};
}
