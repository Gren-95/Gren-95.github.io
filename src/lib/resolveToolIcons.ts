import * as simpleIcons from 'simple-icons';
import { brandFallbacks, iconAliases } from '$lib/data/toolBrands';
import type { ToolGroup } from '$lib/data/qualifications';

export interface ToolBadge {
	name: string;
	/** Brand colour, used as the chip's background. */
	hex: string;
	/** Black or white, whichever reads better on the brand colour. */
	fg: string;
	/** Simple Icons path data, when the mark exists. */
	path?: string;
	/** Letter mark, used when it doesn't. */
	letter?: string;
}

export interface ResolvedToolGroup {
	heading: string;
	tools: ToolBadge[];
}

interface Icon {
	title: string;
	slug: string;
	hex: string;
	path: string;
}

const icons = Object.values(simpleIcons as Record<string, unknown>).filter(
	(icon): icon is Icon =>
		typeof icon === 'object' && icon !== null && 'title' in icon && 'path' in icon
);

const byTitle = new Map(icons.map((icon) => [icon.title.toLowerCase(), icon]));
const bySlug = new Map(icons.map((icon) => [icon.slug, icon]));

/** Relative luminance, per WCAG. */
export function luminance(hex: string): number {
	const value = hex.replace('#', '');
	const channels = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16) / 255);
	const linear = channels.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
	return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrast(a: string, b: string): number {
	const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (light + 0.05) / (dark + 0.05);
}

/** Picks whichever of black or white is more readable on the given background. */
export function readableOn(hex: string): string {
	return contrast('#ffffff', hex) >= contrast('#111111', hex) ? '#ffffff' : '#111111';
}

function mix(hex: string, towards: string, amount: number): string {
	const read = (value: string, i: number) => parseInt(value.replace('#', '').slice(i, i + 2), 16);
	const channels = [0, 2, 4].map((i) =>
		Math.round(read(hex, i) + (read(towards, i) - read(hex, i)) * amount)
	);
	return '#' + channels.map((c) => c.toString(16).padStart(2, '0')).join('');
}

/**
 * A few brand colours sit at a mid tone where neither black nor white quite
 * clears AA at chip size — phpMyAdmin's periwinkle, for one. Those get walked
 * a few percent further from their text colour until the label is readable;
 * every other brand is returned untouched.
 */
export function accessibleBrand(hex: string): { hex: string; fg: string } {
	const fg = readableOn(hex);
	let background = hex;

	for (let step = 0; step < 24 && contrast(fg, background) < 4.5; step++) {
		background = mix(background, fg === '#ffffff' ? '#000000' : '#ffffff', 0.06);
	}

	return { hex: background, fg };
}

export function resolveTool(name: string): ToolBadge {
	const lookup = (iconAliases[name] ?? name).toLowerCase();
	const icon = byTitle.get(lookup) ?? bySlug.get(lookup.replace(/[^a-z0-9]/g, ''));

	// A pure-black or near-black mark disappears on a dark page, so lift it to
	// the ink of whichever theme it sits on via a neutral chip instead.
	const brand = icon ? `#${icon.hex}` : (brandFallbacks[name] ?? '#57534E');
	const { hex, fg } = accessibleBrand(brand);

	return icon
		? { name, hex, fg, path: icon.path }
		: { name, hex, fg, letter: name.charAt(0).toUpperCase() };
}

export function resolveToolkit(groups: ToolGroup[]): ResolvedToolGroup[] {
	return groups.map((group) => ({
		heading: group.heading,
		tools: group.tools.map(resolveTool)
	}));
}
