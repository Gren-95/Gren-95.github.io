import { languageColor } from '$lib/data/languageColors';
import type { GitHubRepo } from '$lib/mergeProjects';

export interface LanguageShare {
	name: string;
	count: number;
	/** Percentage of repositories with a detected language, 0-100. */
	share: number;
	color: string;
}

/**
 * Counts public repositories by their primary language.
 *
 * Forks are somebody else's work and are excluded. Repositories GitHub could
 * not classify are excluded too, so the percentages are of a stated
 * denominator rather than of a total that includes blanks.
 */
export function summariseLanguages(repos: GitHubRepo[]): {
	languages: LanguageShare[];
	classified: number;
} {
	const counts = new Map<string, number>();

	for (const repo of repos) {
		if (repo.fork || !repo.language) continue;
		counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
	}

	const classified = [...counts.values()].reduce((total, n) => total + n, 0);

	const languages = [...counts.entries()]
		.map(([name, count]) => ({
			name,
			count,
			share: classified ? (count / classified) * 100 : 0,
			color: languageColor(name)
		}))
		// Ties resolve alphabetically so the order cannot shift between builds.
		.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

	return { languages, classified };
}
