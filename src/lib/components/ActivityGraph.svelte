<script lang="ts">
	import type { Activity } from '$lib/activity';
	import { reveal } from '$lib/actions/reveal';

	let { activity }: { activity: Activity } = $props();

	// SVG units. The graph scales with its container and scrolls below a
	// minimum width, so the cells never shrink past legibility on a phone.
	const STEP = 14;
	const CELL = 11;
	const LEFT = 30;
	const TOP = 18;

	const width = $derived(LEFT + activity.weeks.length * STEP);
	const height = TOP + 7 * STEP;

	const longDate = new Intl.DateTimeFormat('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC'
	});
	const monthName = new Intl.DateTimeFormat('en-GB', { month: 'short', timeZone: 'UTC' });

	const days = $derived(
		activity.weeks.flatMap((week, column) =>
			week.map((day) => {
				const date = new Date(`${day.date}T00:00:00Z`);
				return {
					...day,
					x: LEFT + column * STEP,
					y: TOP + date.getUTCDay() * STEP,
					label:
						day.count === 0
							? `No contributions on ${longDate.format(date)}`
							: `${day.count} contribution${day.count === 1 ? '' : 's'} on ${longDate.format(date)}`
				};
			})
		)
	);

	// A label where a new month starts, skipped when it would crowd the one
	// before it (the first, partial month usually).
	const months = $derived.by(() => {
		const labels: { x: number; text: string }[] = [];
		let previous = -1;
		activity.weeks.forEach((week, column) => {
			if (!week.length) return;
			const month = new Date(`${week[0].date}T00:00:00Z`).getUTCMonth();
			if (month === previous) return;
			previous = month;
			const x = LEFT + column * STEP;
			if (labels.length && x - labels[labels.length - 1].x < 3 * STEP) labels.pop();
			labels.push({ x, text: monthName.format(new Date(`${week[0].date}T00:00:00Z`)) });
		});
		return labels;
	});

	const weekdays = [
		{ row: 1, text: 'Mon' },
		{ row: 3, text: 'Wed' },
		{ row: 5, text: 'Fri' }
	];

	/** Start scrolled to the newest weeks when the graph is wider than the screen. */
	function scrollToEnd(node: HTMLElement) {
		node.scrollLeft = node.scrollWidth;
	}
</script>

<figure class="graph" use:reveal>
	<div class="scroll" use:scrollToEnd>
		<svg
			viewBox="0 0 {width} {height}"
			role="img"
			aria-label="{activity.total.toLocaleString('en-GB')} contributions in the last year"
		>
			{#each months as month (month.x)}
				<text class="axis" x={month.x} y={TOP - 7}>{month.text}</text>
			{/each}
			{#each weekdays as day (day.row)}
				<text class="axis" x="0" y={TOP + day.row * STEP + CELL - 2}>{day.text}</text>
			{/each}
			{#each days as day (day.date)}
				<rect class="level-{day.level}" x={day.x} y={day.y} width={CELL} height={CELL} rx="2">
					<title>{day.label}</title>
				</rect>
			{/each}
		</svg>
	</div>

	<figcaption class="legend mono">
		<span>Less</span>
		{#each [0, 1, 2, 3, 4] as level (level)}
			<svg class="swatch" viewBox="0 0 {CELL} {CELL}" aria-hidden="true">
				<rect class="level-{level}" width={CELL} height={CELL} rx="2" />
			</svg>
		{/each}
		<span>More</span>
	</figcaption>
</figure>

<style>
	.graph {
		margin: 0;
	}

	.scroll {
		overflow-x: auto;
		padding-bottom: 0.25rem;
	}

	svg {
		display: block;
		width: 100%;
		min-width: 40rem;
		height: auto;
	}

	.axis {
		font-family: var(--mono);
		font-size: 9px;
		fill: var(--muted);
	}

	/* The site's accent at four strengths over the card surface, so the graph
	   follows the light and dark themes like everything else. */
	.level-0 {
		fill: var(--rule);
	}

	.level-1 {
		fill: color-mix(in oklab, var(--accent) 35%, var(--raised));
	}

	.level-2 {
		fill: color-mix(in oklab, var(--accent) 58%, var(--raised));
	}

	.level-3 {
		fill: color-mix(in oklab, var(--accent) 80%, var(--raised));
	}

	.level-4 {
		fill: var(--accent);
	}

	.legend {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.3rem;
		margin-top: 0.6rem;
		font-size: var(--step--1);
		color: var(--muted);
	}

	.swatch {
		width: 0.75rem;
		min-width: 0;
		height: 0.75rem;
	}

	.legend span:first-child {
		margin-right: 0.2rem;
	}

	.legend span:last-child {
		margin-left: 0.2rem;
	}
</style>
