import { describe, expect, it, vi } from 'vitest';
import { fetchActivity, normaliseCalendar } from './activity';

const raw = {
	totalContributions: 7,
	weeks: [
		{
			contributionDays: [
				{ date: '2026-10-25', contributionCount: 0, contributionLevel: 'NONE' },
				{ date: '2026-10-26', contributionCount: 5, contributionLevel: 'FOURTH_QUARTILE' }
			]
		},
		{
			contributionDays: [
				{ date: '2026-11-01', contributionCount: 2, contributionLevel: 'SECOND_QUARTILE' }
			]
		}
	]
};

describe('normaliseCalendar', () => {
	it('keeps the total and turns GitHub quartiles into levels 0 to 4', () => {
		const activity = normaliseCalendar(raw);

		expect(activity.total).toBe(7);
		expect(activity.weeks).toHaveLength(2);
		expect(activity.weeks[0].map((day) => day.level)).toEqual([0, 4]);
		expect(activity.weeks[1][0]).toEqual({ date: '2026-11-01', count: 2, level: 2 });
	});

	it('treats an unknown level as none rather than failing', () => {
		const odd = {
			totalContributions: 1,
			weeks: [
				{
					contributionDays: [{ date: '2026-10-25', contributionCount: 1, contributionLevel: 'NEW' }]
				}
			]
		};

		expect(normaliseCalendar(odd).weeks[0][0].level).toBe(0);
	});
});

describe('fetchActivity', () => {
	it('does not call GitHub without a token', async () => {
		const fetch = vi.fn();

		expect(await fetchActivity(fetch, undefined)).toBeNull();
		expect(fetch).not.toHaveBeenCalled();
	});

	it('returns null instead of throwing when GitHub fails', async () => {
		const failing = vi.fn().mockResolvedValue(new Response('nope', { status: 502 }));
		const throwing = vi.fn().mockRejectedValue(new Error('offline'));

		expect(await fetchActivity(failing, 'token')).toBeNull();
		expect(await fetchActivity(throwing, 'token')).toBeNull();
	});

	it('reads the calendar out of a GraphQL response', async () => {
		const ok = vi.fn().mockResolvedValue(
			Response.json({
				data: { user: { contributionsCollection: { contributionCalendar: raw } } }
			})
		);

		expect((await fetchActivity(ok, 'token'))?.total).toBe(7);
	});
});
