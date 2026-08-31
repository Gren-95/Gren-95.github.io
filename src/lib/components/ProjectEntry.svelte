<script lang="ts">
	import type { Project } from '$lib/types/project';
	import { reveal } from '$lib/actions/reveal';
	import { base } from '$app/paths';
	import { languageColor } from '$lib/data/languageColors';

	let { project, index }: { project: Project; index: number } = $props();

	const lang = $derived(languageColor(project.language));

	const updated = $derived(
		new Date(project.pushedAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
	);
</script>

<article class="card" style="--lang: {lang}" use:reveal={Math.min(index, 3) * 60}>
	{#if project.shot}
		<!-- Fixed aspect with object-fit, so screenshots of different shapes do
		     not make the grid ragged. -->
		<img
			class="shot"
			src="{base}/{project.shot.src}"
			alt="{project.repo} in use"
			width={project.shot.width}
			height={project.shot.height}
			loading="lazy"
			decoding="async"
		/>
	{/if}

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
		{#if project.language}
			<span class="lang"><span class="dot" aria-hidden="true"></span>{project.language}</span>
		{/if}
		{#if project.stars > 0}<span>{project.stars} ★</span>{/if}
		<span>Updated {updated}</span>
	</footer>
</article>

<style>
	.card {
		position: relative;
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

	/* A hairline of the language's own colour along the top edge. Identity is
	   still carried by the name in the meta row; this only reinforces it. */
	.card::before {
		content: '';
		position: absolute;
		inset: -1px -1px auto;
		height: 3px;
		background: var(--lang);
		border-radius: 10px 10px 0 0;
	}

	.card:hover {
		border-color: var(--accent);
		transform: translateY(-3px);
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

		.card {
			transition: none;
		}

		.card:hover {
			transform: none;
		}
	}

	.shot {
		display: block;
		width: calc(100% + 2 * clamp(1.25rem, 3vw, 1.75rem));
		margin: calc(-1 * clamp(1.25rem, 3vw, 1.75rem)) calc(-1 * clamp(1.25rem, 3vw, 1.75rem)) 0.15rem;
		/* Natural aspect, no forced ratio. The two screenshots are very
		   different shapes; cropping to a common ratio magnified the square one
		   until it was unreadable, and letterboxing it left half the panel
		   empty. Uneven image heights are the honest trade. */
		height: auto;
		border-bottom: 1px solid var(--rule);
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
	.lang {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.dot {
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 50%;
		background: var(--lang);
		box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--ink) 28%, transparent);
		flex: none;
	}

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
