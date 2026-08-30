import type { CuratedProject, Project } from '$lib/types/project';

/** The subset of the GitHub repository payload this site reads. */
export interface GitHubRepo {
	name: string;
	language: string | null;
	stargazers_count: number;
	pushed_at: string;
	html_url: string;
	description: string | null;
}

/**
 * Attaches live GitHub facts to each curated entry.
 *
 * A curated entry with no matching repository is a mistake worth failing the
 * build over: it means a repo was renamed or made private, and shipping the
 * page without it would quietly drop work from the catalogue.
 */
export function mergeProjects(curated: CuratedProject[], repos: GitHubRepo[]): Project[] {
	const byName = new Map(repos.map((repo) => [repo.name.toLowerCase(), repo]));

	return curated.map((entry) => {
		const repo = byName.get(entry.repo.toLowerCase());

		if (!repo) {
			throw new Error(
				`Curated project "${entry.repo}" was not found among ${repos.length} GitHub repositories. ` +
					`Rename or remove it in src/lib/data/projects.ts.`
			);
		}

		return {
			...entry,
			language: repo.language,
			stars: repo.stargazers_count,
			pushedAt: repo.pushed_at,
			url: repo.html_url,
			description: repo.description
		};
	});
}
