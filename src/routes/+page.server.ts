import { env } from '$env/dynamic/private';
import { mergeProjects, type GitHubRepo } from '$lib/mergeProjects';
import { projects } from '$lib/data/projects';
import type { PageServerLoad } from './$types';

const API = 'https://api.github.com/users/Gren-95/repos?per_page=100&type=owner';

/**
 * Runs once, at build time, because the page is prerendered. One request keeps
 * the catalogue's languages, stars and last-push dates as fresh as the last
 * deploy without anybody editing a data file.
 */
export const load: PageServerLoad = async ({ fetch }) => {
	const headers: HeadersInit = {
		Accept: 'application/vnd.github+json',
		'User-Agent': 'gren-95.github.io build'
	};

	// Actions supplies a token, which lifts the rate limit from 60 to 5000/hour.
	const token = env.GITHUB_TOKEN;
	if (token) headers.Authorization = `Bearer ${token}`;

	const response = await fetch(API, { headers });

	if (!response.ok) {
		throw new Error(
			`GitHub API returned ${response.status} ${response.statusText} for ${API}. ` +
				`The catalogue cannot be built without it.`
		);
	}

	const repos = (await response.json()) as GitHubRepo[];

	return {
		projects: mergeProjects(projects, repos),
		builtAt: new Date().toISOString()
	};
};
