<script lang="ts">
	import { tick } from 'svelte';
	import type { ProjectCard } from '$lib/types/project';
	import { base } from '$app/paths';
	import { languageColor } from '$lib/data/languageColors';
	import ToolIcon from '$lib/components/ToolIcon.svelte';

	let {
		project,
		current = true
	}: {
		project: ProjectCard;
		/** Whether this card is in focus in the carousel. */
		current?: boolean;
	} = $props();

	const lang = $derived(languageColor(project.language));
	const name = $derived(project.title ?? project.repo);

	const updated = $derived(
		new Date(project.pushedAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
	);

	let flipped = $state(false);
	let toBack: HTMLButtonElement | undefined = $state();
	let toFront: HTMLButtonElement | undefined = $state();

	/** Turns the card over, and moves focus to the button on the side that is now showing. */
	async function flip(over: boolean) {
		flipped = over;
		await tick();
		(over ? toFront : toBack)?.focus();
	}

	// A card that leaves the middle turns back, so it is the front that comes round again.
	$effect(() => {
		if (!current) flipped = false;
	});

	let stack: HTMLUListElement | undefined = $state();

	/** Rows of tags the front has room for. */
	const TAG_ROWS = 2;

	/* The tags wrap onto at most two rows. The ones that would need a third are left out,
	   and a +N chip says how many; one more is left out if the chip itself needs the room. */
	$effect(() => {
		const row = stack;
		if (!row) return;

		const layout = () => {
			const chips = [...row.querySelectorAll<HTMLElement>('[data-chip]')];
			const more = row.querySelector<HTMLElement>('[data-more]');
			if (!chips.length || !more) return;
			chips.forEach((chip) => (chip.hidden = false));
			more.hidden = true;

			const top = chips[0].offsetTop;
			const gap = parseFloat(getComputedStyle(row).rowGap) || 0;
			const step = chips[0].offsetHeight + gap;
			const rowOf = (element: HTMLElement) => Math.round((element.offsetTop - top) / step);

			let shown = chips.length;
			const overflows = () =>
				chips.slice(0, shown).some((chip) => rowOf(chip) >= TAG_ROWS) ||
				(shown < chips.length && rowOf(more) >= TAG_ROWS);
			while (shown > 1 && overflows()) {
				shown -= 1;
				chips[shown].hidden = true;
				more.textContent = `+${chips.length - shown}`;
				more.hidden = false;
			}
		};

		layout();
		const observer = new ResizeObserver(layout);
		observer.observe(row);
		document.fonts.ready.then(layout);
		return () => observer.disconnect();
	});
</script>

<!--
	A card with two faces. The front is a poster: the screenshot, the name and the one
	line. Turning it over shows the story, what it is built with and where to find it.
	The text of both faces is in the page whichever is showing, so it can be searched and
	read by a crawler, and the face that is turned away is inert so the keyboard and a
	screen reader never land on it.
-->
<article class="card" style="--lang: {lang}">
	<div class="turner" class:flipped>
		<section class="face front" inert={flipped} aria-label={name}>
			<div class="shot">
				{#if project.shot}
					<img
						src="{base}/{project.shot.src}"
						alt={project.shot.alt ?? `${project.repo} in use`}
						width={project.shot.width}
						height={project.shot.height}
						loading="lazy"
						decoding="async"
					/>
				{:else}
					<span class="no-shot mono" aria-hidden="true">{name}</span>
				{/if}
				<span class="pill period mono">{project.period}</span>
				{#if project.language}
					<span class="pill language mono">
						{#if project.languageBadge}<ToolIcon badge={project.languageBadge} />{/if}
						{project.language}
					</span>
				{/if}
			</div>

			<div class="body">
				<h3 class="title"><a href={project.url} rel="noopener">{name}</a></h3>
				<p class="tagline">{project.tagline}</p>

				<ul class="stack" bind:this={stack} aria-label="Built with">
					{#each project.tools as tool (tool.name)}
						<li data-chip style:--tag={tool.hex}><ToolIcon badge={tool} />{tool.name}</li>
					{/each}
					<li class="more-tags mono" data-more hidden aria-hidden="true"></li>
				</ul>

				<button
					class="turn mono"
					type="button"
					bind:this={toBack}
					aria-label="Turn {name} over for the story and the details"
					onclick={() => flip(true)}
				>
					The story
					<svg viewBox="0 0 24 24" aria-hidden="true"
						><path
							d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"
						/></svg
					>
				</button>
			</div>
		</section>

		<section class="face back" inert={!flipped} aria-label="{name}, the story">
			<header class="back-head">
				<h3 class="back-title">{name}</h3>
				<button
					class="turn round"
					type="button"
					bind:this={toFront}
					aria-label="Turn {name} back"
					onclick={() => flip(false)}
				>
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
				</button>
			</header>

			<p class="summary">{project.summary}</p>

			<ul class="built" aria-label="Built with">
				{#each project.tools as tool (tool.name)}
					<li style:--tag={tool.hex}><ToolIcon badge={tool} />{tool.name}</li>
				{/each}
			</ul>

			<p class="facts mono">
				<span>{project.period}</span>
				<span>Updated {updated}</span>
				{#if project.language}
					<span class="lang">
						{#if project.languageBadge}<ToolIcon badge={project.languageBadge} />{/if}
						{project.language}
					</span>
				{/if}
				{#if project.stars > 0}<span>{project.stars} ★</span>{/if}
			</p>

			<div class="actions">
				<a class="action primary" href={project.url} rel="noopener">Repository</a>
				{#if project.homepage}
					<a class="action" href={project.homepage} rel="noopener">
						<span class="pulse" aria-hidden="true"></span>Live
					</a>
				{/if}
			</div>
		</section>
	</div>
</article>

<style>
	/* A wide card: the picture on the left and the words on the right. In a narrow space
	   (a phone) it stands up instead, picture over words. */
	.card {
		/* The room the turn needs to look like a turn rather than a squash. */
		perspective: 1100px;
		container-type: inline-size;
	}

	.turner {
		position: relative;
		display: grid;
		height: 18rem;
		transform-style: preserve-3d;
		/* Symmetric, so the card is edge-on at exactly half the time, when the faces swap. */
		transition: transform 0.75s cubic-bezier(0.42, 0, 0.58, 1);
	}

	.turner.flipped {
		transform: rotateY(180deg);
	}

	.face {
		grid-area: 1 / 1;
		position: relative;
		display: flex;
		flex-direction: column;
		min-height: 0;
		overflow: hidden;
		background: var(--raised);
		border: 1px solid var(--rule);
		border-radius: 14px;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		box-shadow: 0 1px 0 color-mix(in oklab, var(--lang) 40%, transparent) inset;
	}

	/* The face that is turned away is also hidden, at the moment the card is edge-on, since
	   hiding the back alone is not reliable for everything drawn on a face. */
	.face {
		transition: visibility 0s linear 0.375s;
	}

	.turner.flipped .front,
	.turner:not(.flipped) .back {
		visibility: hidden;
	}

	/* The story: the words on the left, what it is built with and where to find it on the
	   right. */
	.back {
		display: grid;
		grid-template-columns: 1.3fr 1fr;
		grid-template-areas:
			'head head'
			'summary built'
			'summary facts'
			'summary actions';
		grid-template-rows: auto minmax(0, 1fr) auto auto;
		column-gap: 1.4rem;
		row-gap: 0.8rem;
		transform: rotateY(180deg);
		padding: 1.1rem 1.2rem;
		background: linear-gradient(
			180deg,
			color-mix(in oklab, var(--lang) 16%, var(--raised)),
			var(--raised) 45%
		);
	}

	/* The language's own colour, along the bottom of the front: the mark of the card. */
	.front::after {
		content: '';
		position: absolute;
		inset: auto 0 0;
		height: 4px;
		background: var(--lang);
	}

	/* ---- front ---- */

	.front {
		flex-direction: row;
	}

	.shot {
		position: relative;
		flex: 0 0 44%;
		background: color-mix(in oklab, var(--lang) 14%, var(--paper));
	}

	.shot img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top;
	}

	/* The picture dissolves into the card instead of ending on a hard edge. */
	.shot::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(to left, var(--raised), transparent 45%);
		pointer-events: none;
	}

	.no-shot {
		display: grid;
		place-items: center;
		height: 100%;
		color: var(--muted);
		font-size: var(--step-1);
	}

	.pill {
		position: absolute;
		top: 0.65rem;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.15rem 0.6rem;
		border-radius: 999px;
		font-size: var(--step--1);
		color: var(--ink);
		background: color-mix(in oklab, var(--paper) 88%, transparent);
		/* No backdrop blur: it stops a face from hiding its back when it is turned away. */
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		box-shadow: 0 0 0 1px var(--rule);
	}

	.period {
		left: 0.65rem;
	}

	.language {
		right: 0.65rem;
	}

	.body {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 0.6rem;
		min-width: 0;
		min-height: 0;
		padding: 1rem 1.2rem 1.15rem 0.4rem;
	}

	.title {
		margin: 0;
		font-family: var(--display);
		font-size: 1.4rem;
		line-height: 1.1;
		letter-spacing: -0.03em;
	}

	.title a {
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.title a:hover {
		color: var(--accent);
	}

	.tagline {
		margin: 0;
		color: var(--muted);
		font-size: 0.93rem;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* At most two rows, then a +N chip. The chip height is fixed so the rows can be counted. */
	.stack {
		--chip: 1.6rem;
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
		gap: 0.35rem;
		margin: 0;
		padding: 0;
		list-style: none;
		max-height: calc(var(--chip) * 2 + 0.35rem);
		overflow: hidden;
	}

	.stack [hidden] {
		display: none;
	}

	.stack li {
		display: inline-flex;
		align-items: center;
		height: var(--chip);
	}

	/* A tag: the logo in its brand colour, the name in ink, and a faint wash and ring of
	   the same brand, so each reads at a glance and colour is never the only cue. */
	.stack li,
	.built li {
		flex: none;
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		line-height: 1.2;
		font-family: var(--mono);
		font-size: var(--step--1);
		color: var(--ink);
		background: color-mix(in oklab, var(--tag) 12%, var(--raised));
		box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--tag) 38%, transparent);
		border-radius: 999px;
		padding: 0.15rem 0.7rem 0.15rem 0.5rem;
	}

	.stack .more-tags {
		color: var(--muted);
		background: none;
		border: 1px solid var(--rule-strong);
	}

	/* ---- the button that turns the card ---- */

	.turn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.5rem 0.9rem;
		font-size: var(--step--1);
		color: var(--accent);
		background: transparent;
		border: 1px solid color-mix(in oklab, var(--accent) 45%, transparent);
		border-radius: 999px;
		cursor: pointer;
		transition:
			background 0.2s ease,
			color 0.2s ease;
	}

	/* The button on the front sits at the foot of the card, whatever room the text leaves. */
	.body .turn {
		margin-top: auto;
	}

	.turn:hover {
		color: var(--paper);
		background: var(--accent);
	}

	.turn:focus-visible,
	.action:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
	}

	.turn svg {
		width: 1rem;
		height: 1rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
		transition: transform 0.5s ease;
	}

	.turn:hover svg {
		transform: rotate(180deg);
	}

	.turn.round {
		flex: none;
		width: 2.1rem;
		height: 2.1rem;
		padding: 0;
	}

	.turn.round svg {
		transform: none;
	}

	/* ---- back ---- */

	.back-head {
		grid-area: head;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.back-title {
		margin: 0;
		font-family: var(--display);
		font-size: 1.15rem;
		line-height: 1.15;
		letter-spacing: -0.02em;
	}

	.summary {
		grid-area: summary;
		flex: 1;
		min-height: 0;
		margin: 0;
		overflow-y: auto;
		/* The last line fades out, so a longer text reads as one that scrolls. */
		mask-image: linear-gradient(to bottom, black calc(100% - 1.5rem), transparent);
		padding-bottom: 1.25rem;
		font-size: 0.9rem;
		line-height: 1.6;
		scrollbar-width: thin;
		scrollbar-color: var(--rule-strong) transparent;
	}

	.built {
		grid-area: built;
		align-content: flex-start;
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.facts {
		grid-area: facts;
		display: flex;
		flex-wrap: wrap;
		gap: 0.2rem 0.9rem;
		margin: 0;
		padding-top: 0.65rem;
		border-top: 1px solid var(--rule);
		color: var(--muted);
		font-size: var(--step--1);
	}

	.lang {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.actions {
		grid-area: actions;
		display: flex;
		gap: 0.5rem;
	}

	.action {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		flex: 1;
		padding: 0.5rem 0.75rem;
		font-size: var(--step--1);
		font-weight: 500;
		text-decoration: none;
		color: var(--ink);
		border: 1px solid var(--rule-strong);
		border-radius: 999px;
		transition:
			border-color 0.2s ease,
			color 0.2s ease;
	}

	.action:hover {
		color: var(--accent);
		border-color: var(--accent);
	}

	.action.primary {
		color: var(--paper);
		background: var(--accent);
		border-color: var(--accent);
	}

	.action.primary:hover {
		color: var(--paper);
		filter: brightness(1.1);
	}

	.pulse {
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 50%;
		background: currentColor;
		animation: beat 2s ease-in-out infinite;
	}

	@keyframes beat {
		50% {
			opacity: 0.25;
		}
	}

	/* In a narrow space the card stands up: picture over words, the story in one column. Last,
	   so it wins over the wide layout above. */
	@container (max-width: 30rem) {
		.turner {
			height: 31rem;
		}

		.front {
			flex-direction: column;
		}

		.shot {
			flex: none;
			height: 11.5rem;
		}

		.shot::after {
			background: linear-gradient(to top, var(--raised), transparent 42%);
		}

		.back {
			grid-template-columns: 1fr;
			grid-template-areas: 'head' 'summary' 'built' 'facts' 'actions';
			grid-template-rows: auto minmax(0, 1fr) auto auto auto;
		}
	}
</style>
