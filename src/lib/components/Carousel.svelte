<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import { circularOffset, visibleHalf, wrap } from '$lib/carousel';
	import { reveal } from '$lib/actions/reveal';

	let {
		label,
		items,
		itemLabel,
		slide
	}: {
		label: string;
		items: T[];
		itemLabel: (item: T) => string;
		/** Renders one item; the last argument says whether it is the one in the middle. */
		slide: Snippet<[T, number, boolean]>;
	} = $props();

	/** Time on each slide while it plays by itself, which is what the progress bar counts. */
	const DWELL_MS = 4500;
	/** A sideways drag of at least this many pixels turns the row. */
	const SWIPE_PX = 45;

	const count = $derived(items.length);

	let active = $state(0);
	let stage: HTMLDivElement | undefined = $state();
	let half = $state(2);
	/* Without script the row is a plain scrolling strip; the 3D stage starts once it runs. */
	let live = $state(false);
	let wantsPlay = $state(true);
	let hovered = $state(false);
	let focused = $state(false);
	let dragging = $state(false);
	let onScreen = $state(false);
	let startX = 0;
	let moved = false;

	const playing = $derived(wantsPlay && !hovered && !focused && !dragging && onScreen && count > 1);

	function go(way: -1 | 1) {
		active = wrap(active, way, count);
	}

	function measure() {
		const first = stage?.querySelector<HTMLElement>('.slide');
		if (!stage || !first) return;
		half = visibleHalf(stage.clientWidth, first.offsetWidth * STEP_RATIO, count);
	}

	/** One step sideways, as a share of a slide's width. Keep in step with --step below. */
	const STEP_RATIO = 0.8;

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowRight') {
			event.preventDefault();
			go(1);
		} else if (event.key === 'ArrowLeft') {
			event.preventDefault();
			go(-1);
		}
	}

	function onpointerdown(event: PointerEvent) {
		startX = event.clientX;
		moved = false;
		dragging = true;
	}

	function onpointerup(event: PointerEvent) {
		if (!dragging) return;
		dragging = false;
		const travelled = event.clientX - startX;
		if (Math.abs(travelled) >= SWIPE_PX) {
			moved = true;
			go(travelled < 0 ? 1 : -1);
		}
	}

	function show(index: number) {
		// A drag that ended on a slide is a swipe, not a choice of that slide.
		if (moved) {
			moved = false;
			return;
		}
		active = index;
	}

	$effect(() => {
		const element = stage;
		if (!element) return;
		live = true;
		measure();
		const resize = new ResizeObserver(measure);
		resize.observe(element);
		// Only turn while it can be seen, so it is not moving unseen or wasting the battery.
		const visible = new IntersectionObserver(([entry]) => (onScreen = entry.isIntersecting));
		visible.observe(element);

		return () => {
			resize.disconnect();
			visible.disconnect();
		};
	});
</script>

<section
	class="carousel"
	use:reveal
	aria-roledescription="carousel"
	aria-label={label}
	onmouseenter={() => (hovered = true)}
	onmouseleave={() => (hovered = false)}
	onfocusin={() => (focused = true)}
	onfocusout={() => (focused = false)}
>
	<!-- A moving region has to be reachable by keyboard, so it takes focus and answers the
	     arrow keys. It is a named group rather than a widget, hence the exceptions. -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="viewport"
		class:live
		bind:this={stage}
		{onkeydown}
		{onpointerdown}
		{onpointerup}
		onpointercancel={() => (dragging = false)}
		tabindex="0"
		role="group"
		aria-label="{label}, use the arrow keys to move"
		style="--half: {half}"
	>
		{#each items as item, index (index)}
			{@const offset = circularOffset(index, active, count)}
			{@const away = Math.abs(offset)}
			{@const staging = away === half + 1}
			{@const gone = away > half + 1}
			<div
				class="slide"
				class:current={offset === 0}
				class:staging
				class:gone
				style="--d: {offset}; --abs: {Math.abs(offset)}"
			>
				<div class="content" inert={live && offset !== 0}>
					{@render slide(item, index, offset === 0)}
				</div>
				{#if live && offset !== 0 && !gone && !staging}
					<button
						class="peek"
						type="button"
						tabindex="-1"
						aria-label="Show {itemLabel(item)}"
						onclick={() => show(index)}
					></button>
				{/if}
			</div>
		{/each}
	</div>

	<!-- The time until it moves on by itself. The bar is the clock: when it fills, the row
	     turns, and it stands still whenever the row does. It starts again after any move. -->
	{#if live && count > 1}
		<div class="progress" class:idle={!wantsPlay} style="--dwell: {DWELL_MS}ms" aria-hidden="true">
			{#key active}
				<span
					class="fill"
					style:animation-play-state={playing ? 'running' : 'paused'}
					onanimationend={() => go(1)}
				></span>
			{/key}
		</div>
	{/if}

	{#if live}
		<div class="controls">
			<button type="button" aria-label="Previous project" onclick={() => go(-1)}>
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
			</button>
			<button
				type="button"
				aria-label={wantsPlay ? 'Pause moving' : 'Start moving'}
				aria-pressed={!wantsPlay}
				onclick={() => (wantsPlay = !wantsPlay)}
			>
				{#if wantsPlay}
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14" /></svg>
				{:else}
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7z" /></svg>
				{/if}
			</button>
			<button type="button" aria-label="Next project" onclick={() => go(1)}>
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
			</button>
			<!-- Read out only when it is not already changing by itself. -->
			<p class="position mono" aria-live={playing ? 'off' : 'polite'}>
				{active + 1} of {count}
			</p>
		</div>
	{/if}
</section>

<style>
	.carousel {
		display: grid;
		gap: 0.75rem;
		/* The width of a card, and how far one step sideways moves the next. */
		--slide: 15.5rem;
		--step: calc(var(--slide) * 0.8);
	}

	/* Without script: an ordinary strip that scrolls and snaps. */
	.viewport {
		display: flex;
		gap: 1rem;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		padding-block: 0.4rem 0.9rem;
		scrollbar-width: thin;
		scrollbar-color: var(--rule-strong) transparent;
	}

	.viewport:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 4px;
		border-radius: 10px;
	}

	.slide {
		position: relative;
		flex: 0 0 var(--slide);
		scroll-snap-align: start;
	}

	.content {
		height: 100%;
	}

	.content > :global(*) {
		height: 100%;
	}

	/* With script: a stage in perspective. Every slide sits in the same cell and is moved
	   out from the centre by its offset d, tilted towards the middle, pushed back and
	   dimmed in proportion to how far it is. */
	.viewport.live {
		display: grid;
		justify-items: center;
		overflow: hidden;
		scroll-snap-type: none;
		perspective: 1200px;
		perspective-origin: 50% 40%;
		/* Room for the tilted slides and the centre one's shadow. */
		padding: 1.5rem 0 2.25rem;
		touch-action: pan-y;
		user-select: none;
		cursor: grab;
	}

	.viewport.live:active {
		cursor: grabbing;
	}

	.live .slide {
		grid-area: 1 / 1;
		width: var(--slide);
		flex: none;
		z-index: calc(10 - var(--abs));
		transform: translateX(calc(var(--d) * var(--step))) translateZ(calc(var(--abs) * -130px))
			rotateY(clamp(-48deg, calc(var(--d) * -30deg), 48deg)) scale(calc(1 - var(--abs) * 0.04));
		opacity: calc(1 - var(--abs) * 0.16);
		filter: drop-shadow(0 0 0 transparent);
		/* A little overshoot, and the further a card is from the middle the later it sets
		   off, so a move runs through the row like a wave. The shadow grows and fades with
		   it rather than appearing. */
		transition:
			transform 0.85s cubic-bezier(0.3, 1.18, 0.4, 1) calc(var(--abs) * 35ms),
			opacity 0.7s ease calc(var(--abs) * 35ms),
			filter 0.7s ease;
		will-change: transform;
	}

	/* The card waiting just outside the row. It is there but not seen, so when the row
	   moves it glides in and fades up instead of appearing. */
	.live .slide.staging {
		opacity: 0;
		pointer-events: none;
	}

	/* A slide further out waits out of sight and jumps to its place at once, so one going
	   round the back of the loop is never seen crossing the stage. */
	.live .slide.gone {
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
		transition: none;
	}

	/* The shade that makes a far slide sit behind a near one. */
	.live .slide::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 10px;
		background: var(--paper);
		opacity: calc(var(--abs) * 0.2);
		pointer-events: none;
		transition: opacity 0.7s ease;
	}

	.live .slide.current {
		filter: drop-shadow(0 22px 26px color-mix(in oklab, var(--ink) 22%, transparent));
	}

	.peek {
		position: absolute;
		inset: 0;
		z-index: 2;
		padding: 0;
		border: 0;
		border-radius: 10px;
		background: transparent;
		cursor: pointer;
	}

	.progress {
		justify-self: center;
		width: min(15.5rem, 70%);
		height: 3px;
		overflow: hidden;
		background: var(--rule-strong);
		border-radius: 999px;
		transition: opacity 0.3s ease;
	}

	.progress.idle {
		opacity: 0.4;
	}

	.fill {
		display: block;
		width: 100%;
		height: 100%;
		background: var(--accent);
		transform-origin: 0 50%;
		animation: fill var(--dwell) linear forwards;
	}

	@keyframes fill {
		from {
			transform: scaleX(0);
		}
		to {
			transform: scaleX(1);
		}
	}

	.controls {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.6rem;
	}

	.controls button {
		display: grid;
		place-items: center;
		width: 2.5rem;
		height: 2.5rem;
		padding: 0;
		color: var(--ink);
		background: var(--raised);
		border: 1px solid var(--rule-strong);
		border-radius: 50%;
		cursor: pointer;
		transition:
			border-color 0.15s ease,
			color 0.15s ease;
	}

	.controls button:hover {
		color: var(--accent);
		border-color: var(--accent);
	}

	.controls svg {
		width: 1.1rem;
		height: 1.1rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.position {
		margin: 0 0 0 0.6rem;
		color: var(--muted);
		font-size: var(--step--1);
		min-width: 4.5rem;
	}
</style>
