<script lang="ts">
	import type { Project } from '$lib/types/project';
	import { reveal } from '$lib/actions/reveal';

	let { project, index }: { project: Project; index: number } = $props();

	const updated = $derived(
		new Date(project.pushedAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
	);
</script>

<article class="card" use:reveal={Math.min(index, 3) * 60}>
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
		{#if project.language}<span>{project.language}</span>{/if}
		{#if project.stars > 0}<span>{project.stars} ★</span>{/if}
		<span>Updated {updated}</span>
	</footer>
</article>

<style>
	.card {
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

	.card:hover {
		border-color: var(--accent);
		transform: translateY(-2px);
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
