import { describe, expect, it } from 'vitest';
import { summariseLanguages } from './languageMix';
import { languageColor } from './data/languageColors';
import type { GitHubRepo } from './mergeProjects';

function repo(language: string | null, fork = false): GitHubRepo {
	return {
		name: `r${Math.random()}`,
		language,
		stargazers_count: 0,
		pushed_at: '2026-01-01T00:00:00Z',
		html_url: 'https://example.com',
		description: null,
		homepage: null,
		fork
	};
}

describe('languageColor', () => {
	it('returns the canonical linguist colour', () => {
		expect(languageColor('Rust')).toBe('#dea584');
		expect(languageColor('Go')).toBe('#00ADD8');
	});

	it('falls back to muted ink rather than inventing a hue', () => {
		expect(languageColor('Brainfuck')).toBe('#78716c');
		expect(languageColor(null)).toBe('#78716c');
	});
});

describe('summariseLanguages', () => {
	it('counts repositories by language, commonest first', () => {
		const { languages } = summariseLanguages([
			repo('Rust'),
			repo('TypeScript'),
			repo('TypeScript'),
			repo('TypeScript')
		]);

		expect(languages.map((l) => l.name)).toEqual(['TypeScript', 'Rust']);
		expect(languages[0].count).toBe(3);
	});

	it('excludes forks, which are somebody else’s work', () => {
		const { languages, classified } = summariseLanguages([repo('Go'), repo('Go', true)]);

		expect(classified).toBe(1);
		expect(languages[0].count).toBe(1);
	});

	it('excludes repositories GitHub could not classify', () => {
		const { languages, classified } = summariseLanguages([repo('Go'), repo(null), repo(null)]);

		expect(classified).toBe(1);
		expect(languages).toHaveLength(1);
	});

	it('states shares against the classified total, summing to 100', () => {
		const { languages } = summariseLanguages([repo('Go'), repo('Go'), repo('Rust'), repo(null)]);

		expect(languages[0].share).toBeCloseTo(66.67, 1);
		expect(languages.reduce((t, l) => t + l.share, 0)).toBeCloseTo(100, 6);
	});

	it('breaks ties alphabetically so the order is stable between builds', () => {
		const { languages } = summariseLanguages([repo('Zig'), repo('Ada')]);

		expect(languages.map((l) => l.name)).toEqual(['Ada', 'Zig']);
	});

	it('handles an empty set without dividing by zero', () => {
		expect(summariseLanguages([])).toEqual({ languages: [], classified: 0 });
	});
});
