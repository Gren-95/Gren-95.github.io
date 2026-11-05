/** The measurements of a horizontally scrolling track. */
export interface TrackMetrics {
	scrollLeft: number;
	clientWidth: number;
	scrollWidth: number;
}

/** Pixels of slack, since scroll positions are fractional on high-density screens. */
const EDGE_TOLERANCE = 2;

/** Whether the track can still scroll back, and forward. */
export function scrollEdges({ scrollLeft, clientWidth, scrollWidth }: TrackMetrics) {
	return {
		canPrev: scrollLeft > EDGE_TOLERANCE,
		canNext: scrollLeft + clientWidth < scrollWidth - EDGE_TOLERANCE
	};
}

/**
 * The slide whose left edge is nearest to the track's left edge, counting from 0.
 * `step` is the distance from one slide's left edge to the next.
 */
export function firstVisible(scrollLeft: number, step: number, count: number): number {
	if (step <= 0 || count <= 0) return 0;
	return Math.min(count - 1, Math.max(0, Math.round(scrollLeft / step)));
}

/** How many whole slides fit in view at once, at least one. */
export function visibleCount(clientWidth: number, step: number): number {
	if (step <= 0) return 1;
	return Math.max(1, Math.floor((clientWidth + 1) / step));
}
