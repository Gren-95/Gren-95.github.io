/** How far slide `index` is from the centre one, the short way round, so the row loops. */
export function circularOffset(index: number, active: number, count: number): number {
	if (count <= 0) return 0;
	let offset = (index - active) % count;
	if (offset > count / 2) offset -= count;
	if (offset < -count / 2) offset += count;
	return offset;
}

/** The slide after `active`, going round to the first after the last. */
export function wrap(active: number, direction: -1 | 1, count: number): number {
	if (count <= 0) return 0;
	return (((active + direction) % count) + count) % count;
}

/**
 * How many slides to show on each side of the centre one. Each step sideways moves a slide
 * `step` pixels, and a slide is shown while its centre is still inside the stage.
 */
export function visibleHalf(stageWidth: number, step: number, count: number): number {
	if (step <= 0) return 1;
	const fits = Math.floor(stageWidth / 2 / step);
	return Math.max(1, Math.min(fits, Math.floor(count / 2), MAX_HALF));
}

/** More than this many on a side stops adding anything the eye can tell apart. */
const MAX_HALF = 4;
