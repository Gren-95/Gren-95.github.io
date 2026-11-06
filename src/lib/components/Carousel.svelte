<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import EmblaCarousel, { type EmblaCarouselType, type EmblaOptionsType } from 'embla-carousel';
	import { circularOffset, focusHalf } from '$lib/carousel';
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
	const DWELL_MS = 9000;

	const options: EmblaOptionsType = { loop: true, align: 'center', skipSnaps: false };

	const count = $derived(items.length);

	let api: EmblaCarouselType | undefined = $state();
	let active = $state(0);
	/* Slides on each side of the centre one that are in focus with it. */
	let half = $state(0);
	/* The width of the page without its scrollbar, which the row stretches to. */
	let bleed = $state(0);
	let wantsPlay = $state(true);
	let focused = $state(false);
	let dragging = $state(false);
	let onScreen = $state(false);
	let stage: HTMLDivElement | undefined = $state();

	/* Without script the row is a plain scrolling strip; Embla takes over once it runs. */
	const live = $derived(api !== undefined);
	const playing = $derived(wantsPlay && !focused && !dragging && onScreen && count > 1);

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowRight') {
			event.preventDefault();
			api?.scrollNext();
		} else if (event.key === 'ArrowLeft') {
			event.preventDefault();
			api?.scrollPrev();
		}
	}

	/* Embla swallows the click that ends a drag, so this only runs for a real choice. */
	function show(index: number) {
		api?.scrollTo(index);
	}

	function measure() {
		const first = stage?.querySelector<HTMLElement>('.slide');
		if (!stage || !first) return;
		bleed = document.documentElement.clientWidth;
		half = focusHalf(bleed, first.offsetWidth, count);
	}

	$effect(() => {
		const element = stage;
		if (!element) return;

		const embla = EmblaCarousel(element, options);
		active = embla.selectedScrollSnap();
		embla.on('select', () => (active = embla.selectedScrollSnap()));
		embla.on('pointerDown', () => (dragging = true));
		embla.on('pointerUp', () => (dragging = false));
		api = embla;

		measure();
		const resize = new ResizeObserver(measure);
		resize.observe(document.documentElement);
		// Only move while it can be seen, so it is not moving unseen or wasting the battery.
		const visible = new IntersectionObserver(([entry]) => (onScreen = entry.isIntersecting));
		visible.observe(element);
		return () => {
			resize.disconnect();
			visible.disconnect();
			embla.destroy();
			api = undefined;
		};
	});
</script>

<section
	class="carousel"
	use:reveal
	aria-roledescription="carousel"
	aria-label={label}
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
		style:width={live && bleed ? `${bleed}px` : undefined}
		style:margin-left={live && bleed ? `calc(50% - ${bleed / 2}px)` : undefined}
		{onkeydown}
		tabindex="0"
		role="group"
		aria-label="{label}, use the arrow keys to move"
	>
		<div class="container">
			{#each items as item, index (index)}
				{@const current = Math.abs(circularOffset(index, active, count)) <= half}
				<div class="slide" class:current>
					<div class="content" inert={live && !current}>
						{@render slide(item, index, current)}
					</div>
					{#if live && !current}
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
	</div>

	<!-- The time until it moves on by itself. The bar is the clock: when it fills, the row
	     turns, and it stands still whenever the row does. It starts again after any move. -->
	{#if live && count > 1}
		<div class="progress" class:idle={!wantsPlay} style="--dwell: {DWELL_MS}ms" aria-hidden="true">
			{#key active}
				<span
					class="fill"
					style:animation-play-state={playing ? 'running' : 'paused'}
					onanimationend={() => api?.scrollNext()}
				></span>
			{/key}
		</div>
	{/if}

	{#if live}
		<div class="controls">
			<button type="button" aria-label="Previous project" onclick={() => api?.scrollPrev()}>
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
			<button type="button" aria-label="Next project" onclick={() => api?.scrollNext()}>
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
		/* The width of a card, and the space between two cards. */
		--slide: min(38rem, 88vw);
		--gap: 1rem;
	}

	/* Without script: an ordinary strip that scrolls and snaps. */
	.viewport {
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

	.container {
		display: flex;
	}

	.slide {
		position: relative;
		flex: 0 0 calc(var(--slide) + var(--gap));
		/* Half the gap each side, so the card sits in the exact middle of its slide. */
		padding-inline: calc(var(--gap) / 2);
		scroll-snap-align: start;
	}

	.content {
		height: 100%;
	}

	.content > :global(*) {
		height: 100%;
	}

	/* With script: Embla moves the container, so the strip stops scrolling by itself. The
	   middle card is full size; the others sit a little back and dimmer. */
	.viewport.live {
		/* Clipped, not hidden: a hidden box can still be scrolled sideways by the script or by
		   focus, and a row that has slid off its middle is no longer centred. */
		overflow: clip;
		scroll-snap-type: none;
		touch-action: pan-y pinch-zoom;
		user-select: none;
		cursor: grab;
		/* Room for the centre card's shadow. */
		padding: 1.5rem 0 2.25rem;
	}

	.viewport.live:active {
		cursor: grabbing;
	}

	.live .content {
		transform: scale(0.9);
		opacity: 0.6;
		transition:
			transform 0.5s cubic-bezier(0.3, 1.18, 0.4, 1),
			opacity 0.4s ease;
		will-change: transform, opacity;
	}

	.live .slide.current .content {
		transform: none;
		opacity: 1;
	}

	/* The shadow under the cards in focus. It is a layer of its own that only fades, because
	   animating a blurred filter on a card this large is what made the row stutter. */
	.live .slide {
		isolation: isolate;
	}

	.live .slide::before {
		content: '';
		position: absolute;
		inset: 0 calc(var(--gap) / 2);
		z-index: -1;
		border-radius: 14px;
		box-shadow: 0 22px 26px color-mix(in oklab, var(--ink) 22%, transparent);
		opacity: 0;
		transition: opacity 0.4s ease;
	}

	.live .slide.current::before {
		opacity: 1;
	}

	.peek {
		position: absolute;
		inset: 0 calc(var(--gap) / 2);
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
