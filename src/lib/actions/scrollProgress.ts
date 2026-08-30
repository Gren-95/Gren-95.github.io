/**
 * Publishes how far the page has been scrolled, 0 to 1, as a CSS custom
 * property on the document root, so any element can read it — the reading
 * progress bar and the section backdrop both do.
 *
 * This is deliberately JavaScript rather than `animation-timeline: scroll()`:
 * Firefox 154 still reports `CSS.supports('animation-timeline', 'scroll(root
 * block)') === false`, so the pure-CSS version renders nothing at all there.
 *
 * The bar tracks the scroll position one-to-one rather than animating on its
 * own, so it is kept under `prefers-reduced-motion` — it is an indicator, not
 * a flourish.
 */
export function scrollProgress(_node: HTMLElement) {
	let frame = 0;

	function update() {
		frame = 0;
		const scrollable = document.documentElement.scrollHeight - window.innerHeight;
		document.documentElement.style.setProperty(
			'--read',
			scrollable > 0 ? String(window.scrollY / scrollable) : '0'
		);
	}

	function schedule() {
		if (!frame) frame = requestAnimationFrame(update);
	}

	update();
	window.addEventListener('scroll', schedule, { passive: true });
	window.addEventListener('resize', schedule);

	return {
		destroy() {
			cancelAnimationFrame(frame);
			window.removeEventListener('scroll', schedule);
			window.removeEventListener('resize', schedule);
		}
	};
}
