/**
 * Reveals an element once it scrolls into view. Elements start hidden only
 * when this action is attached, so a reader without JavaScript still sees
 * everything.
 */
export function reveal(node: HTMLElement, delay = 0) {
	const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (reduced) return {};

	node.style.opacity = '0';
	node.style.transform = 'translateY(14px)';
	node.style.transition = `opacity .7s ease ${delay}ms, transform .7s cubic-bezier(.2,.7,.3,1) ${delay}ms`;

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				node.style.opacity = '1';
				node.style.transform = 'none';
				observer.unobserve(node);
			}
		},
		{ rootMargin: '0px 0px -8% 0px' }
	);

	observer.observe(node);

	return {
		destroy: () => observer.disconnect()
	};
}
