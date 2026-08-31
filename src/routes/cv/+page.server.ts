import { summariseLanguages } from '$lib/languageMix';
import type { GitHubRepo } from '$lib/mergeProjects';
import type { PageServerLoad } from './$types';

const API = 'https://api.github.com/users/Gren-95/repos?per_page=100&type=owner';

/** The CV shares the site's live figures so the two cannot disagree. */
export const load: PageServerLoad = async ({ fetch }) => {
	const headers: HeadersInit = { Accept: 'application/vnd.github+json', 'User-Agent': 'cv build' };
	const { env } = await import('$env/dynamic/private');
	if (env.GITHUB_TOKEN) headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;

	const response = await fetch(API, { headers });
	if (!response.ok) throw new Error(`GitHub API returned ${response.status} building the CV.`);

	return summariseLanguages((await response.json()) as GitHubRepo[]);
};
