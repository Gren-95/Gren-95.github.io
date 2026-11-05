import { describe, expect, it } from 'vitest';
import { circularOffset, visibleHalf, wrap } from './carousel';

describe('circularOffset', () => {
	it('is zero for the centre slide and counts either side of it', () => {
		expect(circularOffset(3, 3, 10)).toBe(0);
		expect(circularOffset(4, 3, 10)).toBe(1);
		expect(circularOffset(1, 3, 10)).toBe(-2);
	});

	it('goes the short way round the end, so the row loops', () => {
		expect(circularOffset(0, 9, 10)).toBe(1);
		expect(circularOffset(9, 0, 10)).toBe(-1);
		expect(circularOffset(8, 1, 10)).toBe(-3);
	});

	it('puts the slide opposite the centre at the far edge', () => {
		expect(Math.abs(circularOffset(5, 0, 10))).toBe(5);
	});

	it('copes with no slides', () => {
		expect(circularOffset(0, 0, 0)).toBe(0);
	});
});

describe('wrap', () => {
	it('steps forward and back', () => {
		expect(wrap(3, 1, 10)).toBe(4);
		expect(wrap(3, -1, 10)).toBe(2);
	});

	it('loops at both ends', () => {
		expect(wrap(9, 1, 10)).toBe(0);
		expect(wrap(0, -1, 10)).toBe(9);
	});

	it('stays put with one slide or none', () => {
		expect(wrap(0, 1, 1)).toBe(0);
		expect(wrap(0, -1, 0)).toBe(0);
	});
});

describe('visibleHalf', () => {
	it('shows more on a wide stage and fewer on a narrow one', () => {
		expect(visibleHalf(1100, 150, 14)).toBe(3);
		expect(visibleHalf(900, 150, 14)).toBe(3);
		expect(visibleHalf(500, 150, 14)).toBe(1);
	});

	it('never shows less than one a side, or more than four', () => {
		expect(visibleHalf(200, 150, 14)).toBe(1);
		expect(visibleHalf(4000, 150, 14)).toBe(4);
	});

	it('never shows more than the slides there are', () => {
		expect(visibleHalf(4000, 150, 4)).toBe(2);
	});

	it('copes with nothing to measure', () => {
		expect(visibleHalf(1000, 0, 14)).toBe(1);
	});
});
