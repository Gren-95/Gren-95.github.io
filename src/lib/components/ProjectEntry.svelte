<script lang="ts">
	import type { Project } from '$lib/types/project';
	import { reveal } from '$lib/actions/reveal';
	import { spotlight } from '$lib/actions/spotlight';

	let { project, index }: { project: Project; index: number } = $props();

	const updated = $derived(
		new Date(project.pushedAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
	);
</script>

<article class="card" use:reveal={Math.min(index, 3) * 60} use:spotlight>
	<header class="head">
		<h3 class="name">
			<a href={project.url} rel="noopener">{project.repo}</a>
		</h3>
		<span class="period mono">{project.period}</span>
	</header>

	<p class="summary">{project.summary}</p>

	<ul class="stack">
		{#each project.exposes as tool (tool)}
			<li>{tool}</li>
		{/each}
	</ul>

	<footer class="meta mono">
		{#if project.homepage}
			<a class="live" href={project.homepage} rel="noopener">
				<span class="pulse" aria-hidden="true"></span>Live
			</a>
		{/if}
		{#if project.language}<span>{project.language}</span>{/if}
		{#if project.stars > 0}<span>{project.stars} ★</span>{/if}
		<span>Updated {updated}</span>
	</footer>
</article>

<style>
	.card {
		position: relative;
		isolation: isolate;
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		background: var(--raised);
		border: 1px solid var(--rule);
		border-radius: 10px;
		padding: clamp(1.25rem, 3vw, 1.75rem);
		transition:
			border-color 0.15s ease,
			transform 0.15s ease;
	}

	/* A highlight that tracks the cursor across the card. --px/--py are written
	   by the spotlight action; they start off-card so nothing shows until the
	   pointer actually arrives. */
	.card::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 0;
		border-radius: inherit;
		background: radial-gradient(
			13rem circle at var(--px, -100%) var(--py, -100%),
			color-mix(in oklab, var(--accent) 26%, transparent),
			transparent 66%
		);
		opacity: 0;
		transition: opacity 0.35s ease;
		pointer-events: none;
	}

	.card > * {
		position: relative;
		z-index: 1;
	}

	.card:hover {
		border-color: var(--accent);
		transform: translateY(-3px);
	}

	.card:hover::before {
		opacity: 1;
	}

	.card:hover .name {
		color: var(--accent);
	}

	.live {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		color: var(--accent);
		font-weight: 500;
		text-decoration: none;
	}

	.live:hover {
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	.pulse {
		width: 0.4rem;
		height: 0.4rem;
		border-radius: 50%;
		background: currentColor;
		animation: beat 2s ease-in-out infinite;
	}

	@keyframes beat {
		50% {
			opacity: 0.25;
		}
	}

	.name {
		transition: color 0.2s ease;
	}

	@media (prefers-reduced-motion: reduce) {
		.pulse {
			animation: none;
		}

		.card,
		.card::before {
			transition: none;
		}

		.card:hover {
			transform: none;
		}
	}

	.head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
	}

	.name {
		font-size: var(--step-1);
	}

	.name a {
		text-decoration: none;
	}

	.period {
		color: var(--muted);
		white-space: nowrap;
	}

	.summary {
		color: var(--ink);
		flex: 1;
	}

	.stack {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.stack li {
		font-family: var(--mono);
		font-size: var(--step--1);
		color: var(--accent);
		background: var(--accent-wash);
		border-radius: 999px;
		padding: 0.15rem 0.65rem;
	}

	/* Separators are gaps, not pseudo-element dots: a wrapped row must never
	   start a line with a dangling middot. */
	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.1rem 1.15rem;
		color: var(--muted);
		padding-top: 0.55rem;
		border-top: 1px solid var(--rule);
		margin-top: auto;
	}
</style>
