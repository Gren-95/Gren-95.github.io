/**
 * Tracks the pointer within an element and publishes its position as CSS
 * custom properties, so a highlight can follow the cursor without a
 * re-render. Does nothing when reduced motion is requested, or for input
 * that isn't a pointer hovering (touch, keyboard).
 */
export function spotlight(node: HTMLElement) {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return {};

	let frame = 0;

	function track(event: PointerEvent) {
		if (frame) return;
		frame = requestAnimationFrame(() => {
			frame = 0;
			const box = node.getBoundingClientRect();
			node.style.setProperty('--px', `${event.clientX - box.left}px`);
			node.style.setProperty('--py', `${event.clientY - box.top}px`);
		});
	}

	node.addEventListener('pointermove', track);

	return {
		destroy() {
			cancelAnimationFrame(frame);
			node.removeEventListener('pointermove', track);
		}
	};
}
