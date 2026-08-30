import { describe, expect, it } from 'vitest';
import { mergeProjects, type GitHubRepo } from './mergeProjects';
import { projects } from './data/projects';
import type { CuratedProject } from './types/project';

function repo(overrides: Partial<GitHubRepo> & { name: string }): GitHubRepo {
	return {
		language: 'Rust',
		stargazers_count: 0,
		pushed_at: '2026-01-01T00:00:00Z',
		html_url: `https://github.com/Gren-95/${overrides.name}`,
		description: null,
		...overrides
	};
}

const curated: CuratedProject[] = [
	{ repo: 'wren', period: '2026', summary: 'A file manager.', exposes: ['tabs'] }
];

describe('mergeProjects', () => {
	it('attaches live facts to a curated entry', () => {
		const [merged] = mergeProjects(curated, [repo({ name: 'wren', stargazers_count: 4 })]);

		expect(merged.summary).toBe('A file manager.');
		expect(merged.stars).toBe(4);
		expect(merged.url).toBe('https://github.com/Gren-95/wren');
	});

	it('matches repository names case-insensitively', () => {
		const [merged] = mergeProjects(curated, [repo({ name: 'Wren' })]);

		expect(merged.language).toBe('Rust');
	});

	it('throws when a curated entry has no matching repository', () => {
		expect(() => mergeProjects(curated, [repo({ name: 'finch' })])).toThrow(/"wren" was not found/);
	});

	it('preserves curated order rather than GitHub order', () => {
		const two: CuratedProject[] = [
			...curated,
			{ repo: 'esc2pipe', period: '2024', summary: 'Pipes.', exposes: ['fish'] }
		];
		const merged = mergeProjects(two, [repo({ name: 'esc2pipe' }), repo({ name: 'wren' })]);

		expect(merged.map((entry) => entry.repo)).toEqual(['wren', 'esc2pipe']);
	});
});

describe('curated catalogue', () => {
	it('has no duplicate repositories', () => {
		const names = projects.map((entry) => entry.repo);

		expect(new Set(names).size).toBe(names.length);
	});

	it('gives every entry a summary and at least one exposed capability', () => {
		for (const entry of projects) {
			expect(entry.summary.length, `${entry.repo} summary`).toBeGreaterThan(40);
			expect(entry.exposes.length, `${entry.repo} exposes`).toBeGreaterThan(0);
		}
	});
});
