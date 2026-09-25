import { describe, expect, it } from 'vitest';
import { MAX_PULL, isSettled, stepBand, type BandState } from './rubberBand';

const rest: BandState = { offset: 0, velocity: 0 };

function run(state: BandState, delta: number, frames: number) {
	let next = state;
	for (let i = 0; i < frames; i++) next = stepBand(next, delta);
	return next;
}

describe('stepBand', () => {
	it('pulls down while scrolling down', () => {
		expect(run(rest, 20, 10).offset).toBeGreaterThan(0);
	});

	it('pulls up while scrolling up', () => {
		expect(run(rest, -20, 10).offset).toBeLessThan(0);
	});

	it('never stretches past the maximum pull', () => {
		const pulled = run(rest, 10_000, 200);
		expect(pulled.offset).toBeLessThanOrEqual(MAX_PULL);
		expect(run(rest, -10_000, 200).offset).toBeGreaterThanOrEqual(-MAX_PULL);
	});

	it('returns to rest once scrolling stops', () => {
		const pulled = run(rest, 30, 20);
		expect(pulled.offset).toBeGreaterThan(10);
		expect(isSettled(run(pulled, 0, 200))).toBe(true);
	});

	it('overshoots past rest on the way back', () => {
		const pulled = run(rest, 30, 20);
		let state = pulled;
		let crossed = false;
		for (let i = 0; i < 60; i++) {
			state = stepBand(state, 0);
			if (state.offset < 0) crossed = true;
		}
		expect(crossed).toBe(true);
	});

	it('stays at rest when the page is not scrolling', () => {
		expect(isSettled(run(rest, 0, 5))).toBe(true);
	});
});
