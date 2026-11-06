import { describe, expect, it } from 'vitest';
import { circularOffset, focusHalf } from './carousel';

describe('circularOffset', () => {
	it('is zero for the centre slide and counts either side of it', () => {
		expect(circularOffset(3, 3, 10)).toBe(0);
		expect(circularOffset(4, 3, 10)).toBe(1);
		expect(circularOffset(1, 3, 10)).toBe(-2);
	});

	it('goes the short way round the end, so the row loops', () => {
		expect(circularOffset(0, 9, 10)).toBe(1);
		expect(circularOffset(9, 0, 10)).toBe(-1);
	});

	it('copes with no slides', () => {
		expect(circularOffset(0, 0, 0)).toBe(0);
	});
});

describe('focusHalf', () => {
	it('puts one slide in focus when fewer than three fit', () => {
		expect(focusHalf(500, 512, 14)).toBe(0);
		expect(focusHalf(1100, 512, 14)).toBe(0);
	});

	it('keeps the focus area an odd number of slides, so it stays centred', () => {
		expect(focusHalf(1600, 512, 14)).toBe(1);
		expect(focusHalf(2100, 512, 14)).toBe(1);
		expect(focusHalf(2600, 512, 14)).toBe(2);
	});

	it('never takes in more slides than there are', () => {
		expect(focusHalf(9000, 512, 4)).toBe(1);
	});

	it('copes with nothing to measure', () => {
		expect(focusHalf(1000, 0, 14)).toBe(0);
	});
});
