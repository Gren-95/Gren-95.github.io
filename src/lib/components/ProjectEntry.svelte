<script lang="ts">
	import type { Project } from '$lib/types/project';
	import { reveal } from '$lib/actions/reveal';
	import { base } from '$app/paths';
	import { languageColor } from '$lib/data/languageColors';

	let {
		project,
		index,
		graphLanguages = []
	}: { project: Project; index: number; graphLanguages?: string[] } = $props();

	/** The colour of a tag that names a language in the graph, or nothing for any other tag. */
	function tagColor(tag: string): string | undefined {
		return graphLanguages.includes(tag) ? languageColor(tag) : undefined;
	}

	const lang = $derived(languageColor(project.language));

	const updated = $derived(
		new Date(project.pushedAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
	);

	let details: HTMLDetailsElement | undefined = $state();
	let stack: HTMLUListElement | undefined = $state();
	let hiddenTags = $state(0);

	/* Tags stay on one line while the card is collapsed, so they never change
	   its height. Count the ones the line cuts off, for the +N chip. */
	$effect(() => {
		const row = stack;
		if (!row) return;

		const measure = () => {
			const edge = row.getBoundingClientRect().right;
			hiddenTags = [...row.children].filter(
				(tag) => tag.getBoundingClientRect().right > edge + 0.5
			).length;
		};

		const observer = new ResizeObserver(measure);
		observer.observe(row);
		document.fonts.ready.then(measure);
		return () => observer.disconnect();
	});
</script>

<article class="card" style="--lang: {lang}" use:reveal={Math.min(index, 3) * 60}>
	{#if project.shot}
		<!-- Fixed aspect with object-fit, so screenshots of different shapes do
		     not make the grid ragged. -->
		<div class="shot">
			<img
				src="{base}/{project.shot.src}"
				alt={project.shot.alt ?? `${project.repo} in use`}
				width={project.shot.width}
				height={project.shot.height}
				loading="lazy"
				decoding="async"
			/>
			<span class="period pill mono">{project.period}</span>
		</div>
	{/if}

	<header class="head">
		<h3 class="name">
			<a href={project.url} rel="noopener">{project.title ?? project.repo}</a>
		</h3>
		{#if !project.shot}
			<span class="period mono">{project.period}</span>
		{/if}
	</header>

	<p class="tagline">{project.tagline}</p>

	<!-- Native details: works without JavaScript, is keyboard operable, and
	     keeps the full text in the page for search engines. Open, it covers
	     the card rather than growing it, so no other card moves. -->
	<details class="more" bind:this={details}>
		<summary class="mono">
			<span class="when-closed">Read more</span><span class="when-open">Show less</span>
		</summary>
		<div class="overlay">
			<p class="overlay-name" aria-hidden="true">{project.title ?? project.repo}</p>
			<p class="summary">{project.summary}</p>
			<ul class="overlay-tags" aria-hidden="true">
				{#each project.exposes as tool (tool)}
					<li class:tagged={tagColor(tool)} style:--tag={tagColor(tool)}>{tool}</li>
				{/each}
			</ul>
		</div>
	</details>

	<div class="tags">
		<ul class="stack" bind:this={stack}>
			{#each project.exposes as tool, i (tool)}
				<li
					class:cut={i >= project.exposes.length - hiddenTags}
					class:tagged={tagColor(tool)}
					style:--tag={tagColor(tool)}
				>
					{tool}
				</li>
			{/each}
		</ul>
		{#if hiddenTags > 0}
			<button
				class="more-tags mono"
				type="button"
				aria-label="Show all {project.exposes.length} tags"
				onclick={() => details && (details.open = true)}>+{hiddenTags}</button
			>
		{/if}
	</div>

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
		--pad: 1.1rem;
		padding: var(--pad);
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
		/* Above the screenshot and the Read more overlay. */
		z-index: 2;
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

	.shot {
		position: relative;
		width: calc(100% + 2 * var(--pad));
		margin: calc(-1 * var(--pad)) calc(-1 * var(--pad)) 0.15rem;
		border-bottom: 1px solid var(--rule);
		border-radius: 10px 10px 0 0;
		overflow: hidden;
	}

	/* One shared ratio, cropped to fill, so every card's image is the same
	   height. Anchored to the top, where the interesting part of a
	   screenshot usually is. */
	.shot img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 16 / 10;
		object-fit: cover;
		object-position: top;
	}

	.shot .pill {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		padding: 0.2rem 0.65rem;
		border-radius: 999px;
		font-size: var(--step--1);
		color: var(--ink);
		background: color-mix(in oklab, var(--paper) 82%, transparent);
		backdrop-filter: blur(6px);
		box-shadow: 0 0 0 1px var(--rule);
	}

	.head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
	}

	.name {
		font-size: 1.2rem;
	}

	.name a {
		text-decoration: none;
	}

	.period {
		color: var(--muted);
		white-space: nowrap;
	}

	/* Four lines reserved whatever the tagline's length, so every card in a
	   row is the same height. */
	.tagline {
		color: var(--ink);
		min-height: calc(4 * 1.65em);
		min-height: 4lh;
	}

	/* The toggle leaves the flow when it moves to the corner; keep its line
	   so the open card's content, and so its row, does not get shorter. */
	.more {
		min-height: 1.65em;
		min-height: 1lh;
	}

	/* The open card shows its full text over itself, image included, and
	   keeps its size. The toggle moves to the bottom corner, above it. */
	.overlay {
		position: absolute;
		inset: 0;
		z-index: 1;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		padding: var(--pad) var(--pad) calc(var(--pad) + 3rem);
		background: var(--raised);
		border-radius: 10px;
		overflow-y: auto;
		animation: overlay-in 0.2s ease;
	}

	@keyframes overlay-in {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}

	.overlay-name {
		font-family: var(--display);
		font-weight: 600;
		letter-spacing: -0.02em;
		font-size: var(--step-1);
		line-height: 1.1;
	}

	.overlay-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	/* Open, the toggle is an opaque full-width bar pinned to the card's bottom
	   edge, so the overlay's text and tags scroll cleanly behind it instead of
	   colliding with it. */
	.more[open] summary {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 3;
		padding: 0.6rem var(--pad);
		background: var(--raised);
		border-top: 1px solid var(--rule);
		border-radius: 0 0 10px 10px;
	}

	.more summary {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		width: fit-content;
		list-style: none;
		cursor: pointer;
		color: var(--accent);
		font-size: var(--step--1);
		border-radius: 3px;
	}

	.more summary::-webkit-details-marker {
		display: none;
	}

	.more summary::after {
		content: '';
		width: 0.4em;
		height: 0.4em;
		border-right: 1.5px solid currentColor;
		border-bottom: 1.5px solid currentColor;
		transform: translateY(-0.15em) rotate(45deg);
		transition: transform 0.2s ease;
	}

	.more[open] summary::after {
		transform: translateY(0.1em) rotate(-135deg);
	}

	.more summary:hover {
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	.more summary:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
	}

	.more[open] .when-closed,
	.more:not([open]) .when-open {
		display: none;
	}

	.summary {
		color: var(--ink);
		font-size: 0.94em;
		line-height: 1.6;
	}

	.tags {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	/* One line, so the tags never change the card's height. The Read more
	   overlay lists them all. */
	.stack {
		display: flex;
		flex: 1;
		min-width: 0;
		flex-wrap: nowrap;
		overflow: hidden;
		gap: 0.4rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	/* A tag the line would cut mid-word is hidden whole; the +N chip counts it. */
	.stack .cut {
		visibility: hidden;
	}

	.stack li,
	.overlay-tags li {
		flex: none;
		white-space: nowrap;
		font-family: var(--mono);
		font-size: var(--step--1);
		color: var(--accent);
		background: var(--accent-wash);
		border-radius: 999px;
		padding: 0.15rem 0.65rem;
	}

	/* A tag that names a language in the graph wears that language's colour: a dot,
	   a ring and a wash of it. The name is still written, so colour is never the only cue. */
	.tagged {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		color: var(--ink);
		background: color-mix(in oklab, var(--tag) 16%, var(--raised));
		box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--tag) 55%, transparent);
	}

	.tagged::before {
		content: '';
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: var(--tag);
		box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--ink) 28%, transparent);
		flex: none;
	}

	.more-tags {
		flex: none;
		font-size: var(--step--1);
		color: var(--muted);
		background: none;
		border: 1px solid var(--rule-strong);
		border-radius: 999px;
		padding: 0.1rem 0.55rem;
		cursor: pointer;
	}

	.more-tags:hover {
		color: var(--accent);
		border-color: var(--accent);
	}

	.more-tags:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
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
