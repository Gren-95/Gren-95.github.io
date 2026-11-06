/** How far slide `index` is from the centre one, the short way round, so the row loops. */
export function circularOffset(index: number, active: number, count: number): number {
	if (count <= 0) return 0;
	let offset = (index - active) % count;
	if (offset > count / 2) offset -= count;
	if (offset < -count / 2) offset += count;
	return offset;
}

/**
 * How many slides sit on each side of the centre one inside the focus area. The area is an
 * odd number of whole slides, so the middle one is its exact centre; a slide that would
 * only half fit stays outside it. `step` is the width of one slide with its gap.
 */
export function focusHalf(stageWidth: number, step: number, count: number): number {
	if (step <= 0) return 0;
	const whole = Math.floor(stageWidth / step);
	const half = Math.floor((whole - 1) / 2);
	return Math.max(0, Math.min(half, Math.floor((count - 1) / 2)));
}
