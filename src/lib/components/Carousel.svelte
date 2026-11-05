<script lang="ts">
	import type { Snippet } from 'svelte';
	import { firstVisible, scrollEdges, visibleCount } from '$lib/carousel';

	let { label, count, children }: { label: string; count: number; children: Snippet } = $props();

	let track: HTMLDivElement | undefined = $state();
	let canPrev = $state(false);
	let canNext = $state(false);
	let first = $state(0);
	let shown = $state(1);
	/* The buttons need script; without it the track still scrolls and snaps. */
	let ready = $state(false);

	/** Distance from one slide's left edge to the next, gap included. */
	function step(): number {
		const slides = track?.children;
		if (!slides || slides.length < 2) return track?.clientWidth ?? 0;
		return (slides[1] as HTMLElement).offsetLeft - (slides[0] as HTMLElement).offsetLeft;
	}

	function measure() {
		if (!track) return;
		({ canPrev, canNext } = scrollEdges(track));
		first = firstVisible(track.scrollLeft, step(), count);
		shown = visibleCount(track.clientWidth, step());
	}

	function go(direction: -1 | 1) {
		if (!track) return;
		const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
		// One page at a time, so a wide screen is not moved a single card.
		track.scrollBy({
			left: direction * step() * visibleCount(track.clientWidth, step()),
			behavior: smooth ? 'smooth' : 'auto'
		});
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowRight') {
			event.preventDefault();
			go(1);
		} else if (event.key === 'ArrowLeft') {
			event.preventDefault();
			go(-1);
		}
	}

	$effect(() => {
		const element = track;
		if (!element) return;
		ready = true;
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(element);
		return () => observer.disconnect();
	});

	const last = $derived(Math.min(count, first + shown));
</script>

<section class="carousel" aria-roledescription="carousel" aria-label={label}>
	{#if ready}
		<div class="controls">
			<p class="position mono" aria-live="polite">
				{first + 1}{last > first + 1 ? `-${last}` : ''} of {count}
			</p>
			<div class="buttons">
				<button
					type="button"
					aria-label="Previous projects"
					disabled={!canPrev}
					onclick={() => go(-1)}
				>
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
				</button>
				<button type="button" aria-label="Next projects" disabled={!canNext} onclick={() => go(1)}>
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
				</button>
			</div>
		</div>
	{/if}

	<!-- A scrollable region has to be reachable by keyboard, so it takes focus and answers
	     the arrow keys. It is a named group rather than a widget, hence the exceptions. -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="track"
		bind:this={track}
		onscroll={measure}
		{onkeydown}
		tabindex="0"
		role="group"
		aria-label="{label}, scroll sideways"
	>
		{@render children()}
	</div>
</section>

<style>
	.carousel {
		display: grid;
		gap: 0.9rem;
	}

	.controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.position {
		margin: 0;
		color: var(--muted);
		font-size: var(--step--1);
	}

	.buttons {
		display: flex;
		gap: 0.5rem;
	}

	button {
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

	button:hover:not(:disabled) {
		color: var(--accent);
		border-color: var(--accent);
	}

	button:disabled {
		opacity: 0.35;
		cursor: default;
	}

	button svg {
		width: 1.15rem;
		height: 1.15rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.track {
		display: flex;
		gap: 1.1rem;
		overflow-x: auto;
		overscroll-behavior-x: contain;
		scroll-snap-type: x mandatory;
		/* Room for the cards' hover lift and their top hairline. */
		padding-block: 0.4rem 0.9rem;
		scrollbar-width: thin;
		scrollbar-color: var(--rule-strong) transparent;
	}

	.track:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 4px;
		border-radius: 10px;
	}

	/* Every card is as tall as the tallest, so the row never looks ragged. */
	.track > :global(*) {
		flex: 0 0 min(21rem, 84%);
		scroll-snap-align: start;
	}

	@media (min-width: 40rem) {
		.track > :global(*) {
			flex-basis: 21rem;
		}
	}
</style>
