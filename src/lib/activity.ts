/**
 * The GitHub contribution calendar, fetched at build time. It is the same
 * calendar the profile page shows, private contributions included when the
 * profile is set to count them.
 */

export interface ActivityDay {
	date: string;
	count: number;
	/** 0 for none, then GitHub's quartiles 1 to 4. */
	level: 0 | 1 | 2 | 3 | 4;
}

export interface Activity {
	total: number;
	/** Columns of the graph, oldest first. Each holds up to seven days, Sunday first. */
	weeks: ActivityDay[][];
}

interface RawCalendar {
	totalContributions: number;
	weeks: {
		contributionDays: { date: string; contributionCount: number; contributionLevel: string }[];
	}[];
}

const LEVELS: Record<string, ActivityDay['level']> = {
	NONE: 0,
	FIRST_QUARTILE: 1,
	SECOND_QUARTILE: 2,
	THIRD_QUARTILE: 3,
	FOURTH_QUARTILE: 4
};

export function normaliseCalendar(raw: RawCalendar): Activity {
	return {
		total: raw.totalContributions,
		weeks: raw.weeks.map((week) =>
			week.contributionDays.map((day) => ({
				date: day.date,
				count: day.contributionCount,
				level: LEVELS[day.contributionLevel] ?? 0
			}))
		)
	};
}

const QUERY = `query($login: String!) {
	user(login: $login) {
		contributionsCollection {
			contributionCalendar {
				totalContributions
				weeks { contributionDays { date contributionCount contributionLevel } }
			}
		}
	}
}`;

/**
 * GraphQL needs a token, which Actions supplies. Without one, or if GitHub
 * answers with anything unexpected, there is no graph rather than no site.
 */
export async function fetchActivity(
	fetch: typeof globalThis.fetch,
	token: string | undefined,
	login = 'Gren-95'
): Promise<Activity | null> {
	if (!token) return null;

	try {
		const response = await fetch('https://api.github.com/graphql', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
				'User-Agent': 'gren-95.github.io build'
			},
			body: JSON.stringify({ query: QUERY, variables: { login } })
		});
		if (!response.ok) return null;

		const body = await response.json();
		const calendar = body?.data?.user?.contributionsCollection?.contributionCalendar;
		return calendar ? normaliseCalendar(calendar) : null;
	} catch {
		return null;
	}
}
