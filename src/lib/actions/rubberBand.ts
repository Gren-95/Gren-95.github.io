/** Furthest the background is dragged from rest, in pixels. */
export const MAX_PULL = 36;

/** How many pixels of pull one pixel-per-frame of scroll speed asks for. */
const PULL_PER_SPEED = 1;
const STIFFNESS = 0.12;
const DAMPING = 0.78;
const SETTLED = 0.05;

/** Pixels of pull that add one whole unit of vertical stretch. */
const STRETCH_PER_PIXEL = 3000;

export interface BandState {
	offset: number;
	velocity: number;
}

/**
 * Advances the band by one frame.
 *
 * The scroll speed sets a target offset in the direction of travel, and the
 * offset chases it as a damped spring. When scrolling stops the target falls
 * to zero, so the band snaps back and overshoots slightly before it settles.
 */
export function stepBand(state: BandState, scrollDelta: number): BandState {
	const target = Math.max(-MAX_PULL, Math.min(MAX_PULL, scrollDelta * PULL_PER_SPEED));
	const velocity = (state.velocity + (target - state.offset) * STIFFNESS) * DAMPING;
	const offset = Math.max(-MAX_PULL, Math.min(MAX_PULL, state.offset + velocity));
	return { offset, velocity };
}

export function isSettled(state: BandState): boolean {
	return Math.abs(state.offset) < SETTLED && Math.abs(state.velocity) < SETTLED;
}

/**
 * Drags an element with the scroll like a rubber band: down while scrolling
 * down, up while scrolling up, and back to rest when the scrolling stops. The
 * element stretches away from the edge it is pulled from.
 *
 * Skipped under `prefers-reduced-motion`, since the whole effect is motion.
 */
export function rubberBand(node: HTMLElement | SVGElement) {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return {};

	let state: BandState = { offset: 0, velocity: 0 };
	let lastScroll = window.scrollY;
	let frame = 0;

	function tick() {
		const scroll = window.scrollY;
		state = stepBand(state, scroll - lastScroll);
		lastScroll = scroll;

		if (isSettled(state)) {
			state = { offset: 0, velocity: 0 };
			node.style.transform = '';
			frame = 0;
			return;
		}

		const stretch = 1 + Math.abs(state.offset) / STRETCH_PER_PIXEL;
		node.style.transformOrigin = state.offset >= 0 ? '50% 0' : '50% 100%';
		node.style.transform = `translate3d(0, ${state.offset}px, 0) scaleY(${stretch})`;
		frame = requestAnimationFrame(tick);
	}

	function start() {
		if (!frame) frame = requestAnimationFrame(tick);
	}

	window.addEventListener('scroll', start, { passive: true });

	return {
		destroy() {
			cancelAnimationFrame(frame);
			window.removeEventListener('scroll', start);
			node.style.transform = '';
		}
	};
}
