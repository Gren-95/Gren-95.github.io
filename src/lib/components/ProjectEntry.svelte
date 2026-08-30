<script lang="ts">
	import type { Project } from '$lib/types/project';
	import { reveal } from '$lib/actions/reveal';

	let { project, index }: { project: Project; index: number } = $props();

	const lastPush = $derived(
		new Date(project.pushedAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
	);
</script>

<article class="entry" use:reveal={Math.min(index, 3) * 70}>
	<div class="rail mono">
		<span class="period">{project.period}</span>
		{#if project.language}<span class="lang">{project.language}</span>{/if}
	</div>

	<div class="body">
		<h3 class="title">
			<a href={project.url} rel="noopener">{project.repo}</a>
		</h3>

		<p class="summary">{project.summary}</p>

		<dl class="spec mono">
			<dt>exposes</dt>
			<dd class="exposes">
				{#each project.exposes as capability, i (capability)}<span class="capability"
						>{capability}</span
					>{#if i < project.exposes.length - 1}<span class="sep" aria-hidden="true">·</span
						>{/if}{/each}
			</dd>

			<dt>touched</dt>
			<dd>
				{lastPush}{#if project.stars > 0}<span class="stars">, {project.stars} starred</span>{/if}
			</dd>

			<dt>source</dt>
			<dd><a href={project.url} rel="noopener">github.com/Gren-95/{project.repo}</a></dd>
		</dl>
	</div>
</article>

<style>
	.entry {
		display: grid;
		grid-template-columns: var(--rail) minmax(0, 1fr);
		gap: 0 clamp(1rem, 3vw, 2.5rem);
		padding: clamp(1.75rem, 4vw, 2.9rem) 0;
		border-bottom: 1px solid var(--rule);
	}

	.rail {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		color: var(--ink-muted);
		padding-top: 0.55rem;
	}

	.period {
		color: var(--ink);
		white-space: nowrap;
	}

	.lang {
		font-size: 0.92em;
	}

	.title {
		font-size: var(--step-2);
		margin-bottom: 0.5rem;
	}

	.title a {
		text-decoration: none;
	}

	.title a:hover {
		color: var(--accent);
	}

	.summary {
		max-width: 54ch;
		color: var(--ink);
		margin-bottom: 1.35rem;
	}

	.spec {
		display: grid;
		grid-template-columns: 5.5rem minmax(0, 1fr);
		gap: 0.4rem 1rem;
		margin: 0;
		color: var(--ink-muted);
	}

	.spec dt {
		text-transform: uppercase;
		letter-spacing: 0.14em;
		font-size: 0.86em;
		padding-top: 0.12em;
	}

	.spec dd {
		margin: 0;
		min-width: 0;
	}

	/* The accent lives here and nowhere else, so the capabilities read as one
	   continuous thread down the catalogue. */
	.capability {
		color: var(--accent);
	}

	.sep {
		color: var(--rule);
		padding: 0 0.45em;
	}

	.stars {
		color: var(--ink-muted);
	}

	@media (max-width: 42rem) {
		.entry {
			grid-template-columns: 1fr;
			gap: 0.75rem;
		}

		.rail {
			flex-direction: row;
			gap: 0.9rem;
			padding-top: 0;
		}

		.spec {
			grid-template-columns: 1fr;
			gap: 0.15rem;
		}

		.spec dt {
			padding-top: 0.7rem;
		}
	}
</style>
