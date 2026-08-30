import { describe, expect, it } from 'vitest';
import { accessibleBrand, readableOn, resolveTool, resolveToolkit } from './resolveToolIcons';
import { toolkit } from './data/qualifications';

describe('readableOn', () => {
	it('puts black on a bright brand colour', () => {
		expect(readableOn('#F7DF1E')).toBe('#111111'); // JavaScript yellow
	});

	it('puts white on a dark brand colour', () => {
		expect(readableOn('#003545')).toBe('#ffffff'); // MariaDB navy
	});
});

describe('accessibleBrand', () => {
	function contrast(a: string, b: string) {
		const lum = (hex: string) => {
			const value = hex.replace('#', '');
			const channels = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16) / 255);
			const linear = channels.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
			return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
		};
		const [light, dark] = [lum(a), lum(b)].sort((x, y) => y - x);
		return (light + 0.05) / (dark + 0.05);
	}

	it('leaves a brand alone when it already clears AA', () => {
		expect(accessibleBrand('#00ADD8').hex).toBe('#00ADD8');
	});

	it('walks a borderline brand until its label is readable', () => {
		const before = '#6C78AF'; // phpMyAdmin, 4.44:1 against white
		const after = accessibleBrand(before);

		expect(after.hex.toLowerCase()).not.toBe(before.toLowerCase());
		expect(contrast(after.fg, after.hex)).toBeGreaterThanOrEqual(4.5);
	});
});

describe('resolveTool', () => {
	it('finds a logo and its brand colour', () => {
		const badge = resolveTool('Go');

		expect(badge.hex.toLowerCase()).toBe('#00add8');
		expect(badge.path).toBeTruthy();
		expect(badge.letter).toBeUndefined();
	});

	it('resolves names that differ from the Simple Icons title', () => {
		expect(resolveTool('Cisco networking').path).toBeTruthy();
		expect(resolveTool('Shell').path).toBeTruthy();
	});

	it('falls back to a letter mark and the README brand colour', () => {
		const badge = resolveTool('Windows');

		expect(badge.path).toBeUndefined();
		expect(badge.letter).toBe('W');
		expect(badge.hex.toLowerCase()).toMatch(/^#0[06-9a-f]/);
	});
});

describe('resolveToolkit', () => {
	const resolved = resolveToolkit(toolkit);

	it('keeps every tool and every group', () => {
		expect(resolved).toHaveLength(toolkit.length);
		expect(resolved.flatMap((g) => g.tools)).toHaveLength(toolkit.flatMap((g) => g.tools).length);
	});

	it('gives every tool a mark and a readable foreground', () => {
		for (const tool of resolved.flatMap((g) => g.tools)) {
			expect(Boolean(tool.path || tool.letter), `${tool.name} mark`).toBe(true);
			expect(tool.hex, `${tool.name} hex`).toMatch(/^#[0-9A-Fa-f]{6}$/);
			expect(['#ffffff', '#111111']).toContain(tool.fg);
		}
	});
});
