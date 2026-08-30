/** A curated catalogue entry, written by hand. */
export interface CuratedProject {
	/** GitHub repository name, also the catalogue entry's title. */
	repo: string;
	/** Year or year range the work belongs to, used as the left rail marker. */
	period: string;
	/** One sentence, in plain terms, about what the thing does for its user. */
	summary: string;
	/** What the project offers, borrowing the vocabulary of a device definition. */
	exposes: string[];
}

/** The live fields fetched from the GitHub API at build time. */
export interface RepoFacts {
	language: string | null;
	stars: number;
	pushedAt: string;
	url: string;
	description: string | null;
}

/** A curated entry merged with its live facts, ready to render. */
export type Project = CuratedProject & RepoFacts;

/** An upstream contribution to somebody else's project. */
export interface Contribution {
	project: string;
	reference: string;
	url: string;
	state: 'merged' | 'open';
	summary: string;
}
