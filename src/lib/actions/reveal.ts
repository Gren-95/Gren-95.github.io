/**
 * Reveals an element once it scrolls into view. Elements start hidden only
 * when this action is attached, so a reader without JavaScript still sees
 * everything.
 */
export function reveal(node: HTMLElement, delay = 0) {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return {};

	node.style.opacity = '0';
	node.style.transform = 'translateY(22px)';
	node.style.transition = `opacity .7s ease ${delay}ms, transform .7s cubic-bezier(.2,.7,.3,1) ${delay}ms`;
	node.style.willChange = 'opacity, transform';

	let observer: IntersectionObserver | undefined;

	function show(entries: IntersectionObserverEntry[]) {
		for (const entry of entries) {
			if (!entry.isIntersecting) continue;
			node.style.opacity = '1';
			node.style.transform = 'none';
			node.addEventListener('transitionend', () => (node.style.willChange = 'auto'), {
				once: true
			});
			observer?.unobserve(node);
		}
	}

	// Two frames, so the hidden state is painted before the observer can fire.
	// Without this, anything already inside the viewport on load has its start
	// and end styles applied in the same frame and snaps in with no transition.
	const queued = requestAnimationFrame(() =>
		requestAnimationFrame(() => {
			observer = new IntersectionObserver(show, { rootMargin: '0px 0px -6% 0px' });
			observer.observe(node);
		})
	);

	return {
		destroy() {
			cancelAnimationFrame(queued);
			observer?.disconnect();
		}
	};
}
