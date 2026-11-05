import { describe, expect, it } from 'vitest';
import { firstVisible, scrollEdges, visibleCount } from './carousel';

describe('scrollEdges', () => {
	it('cannot go back at the start, and can go forward', () => {
		expect(scrollEdges({ scrollLeft: 0, clientWidth: 600, scrollWidth: 1800 })).toEqual({
			canPrev: false,
			canNext: true
		});
	});

	it('can go both ways in the middle', () => {
		expect(scrollEdges({ scrollLeft: 400, clientWidth: 600, scrollWidth: 1800 })).toEqual({
			canPrev: true,
			canNext: true
		});
	});

	it('cannot go forward at the end, even when the position is fractional', () => {
		expect(scrollEdges({ scrollLeft: 1199.4, clientWidth: 600, scrollWidth: 1800 })).toEqual({
			canPrev: true,
			canNext: false
		});
	});

	it('cannot go either way when everything fits', () => {
		expect(scrollEdges({ scrollLeft: 0, clientWidth: 900, scrollWidth: 900 })).toEqual({
			canPrev: false,
			canNext: false
		});
	});
});

describe('firstVisible', () => {
	it('counts from zero and rounds to the nearest slide', () => {
		expect(firstVisible(0, 300, 10)).toBe(0);
		expect(firstVisible(140, 300, 10)).toBe(0);
		expect(firstVisible(160, 300, 10)).toBe(1);
		expect(firstVisible(900, 300, 10)).toBe(3);
	});

	it('stays within the slides', () => {
		expect(firstVisible(99999, 300, 10)).toBe(9);
		expect(firstVisible(-50, 300, 10)).toBe(0);
	});

	it('copes with nothing to measure', () => {
		expect(firstVisible(100, 0, 10)).toBe(0);
		expect(firstVisible(100, 300, 0)).toBe(0);
	});
});

describe('visibleCount', () => {
	it('counts the whole slides that fit', () => {
		expect(visibleCount(1000, 300)).toBe(3);
		expect(visibleCount(850, 300)).toBe(2);
		expect(visibleCount(899.6, 300)).toBe(3);
	});

	it('is never less than one', () => {
		expect(visibleCount(200, 300)).toBe(1);
		expect(visibleCount(500, 0)).toBe(1);
	});
});
