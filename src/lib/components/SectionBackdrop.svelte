<script lang="ts">
	import { activeSection } from '$lib/state/activeSection.svelte';

	/**
	 * A fixed layer behind the page whose pattern changes as each section takes
	 * the middle of the viewport. Sections register through the watchSection
	 * action; this component only renders what is registered.
	 *
	 * The patterns encode their section rather than decorating it:
	 *
	 *   work       ruled lines, like a ledger — a career is a list of dates
	 *   projects   a lattice of nodes — discrete things built
	 *   upstream   rings radiating outward — work leaving for other people
	 *   education  evenly spaced verticals — the patch panel cabled at Rakvere
	 *   toolkit    a dense field of points — many small tools
	 *
	 * Only opacity and transform animate, and the whole layer is inert to
	 * assistive technology.
	 */
	const patterns = ['hero', 'work', 'projects', 'upstream', 'education', 'toolkit'];

	let reduced = $state(false);

	$effect(() => {
		reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	});
</script>

<div class="backdrop" class:still={reduced} aria-hidden="true">
	{#each patterns as pattern (pattern)}
		<div class="layer" data-pattern={pattern} class:on={activeSection.current === pattern}></div>
	{/each}
</div>

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: -1;
		pointer-events: none;
		overflow: hidden;

		/* Full strength out in the page margins, damped across the content
		   column so the pattern never costs the text its contrast.

		   The fade finishes 3.5rem inside the column — the page gutter — so it
		   has already reached the damped level by the time any text starts.
		   --damp is set from a measurement, not by eye: at this line strength
		   the column has to stay at 0.182 effective alpha to keep muted text
		   above 4.5:1 on the dark theme, which is the binding case. On
		   a narrow viewport `50% - 34rem` goes negative, the whole strip falls
		   inside the damped band, and mobile is safe with no media query. */
		--edge: 34rem;
		--damp: 0.285;
		--mask: linear-gradient(
			to right,
			#000 0,
			#000 calc(50% - var(--edge) - 1rem),
			rgb(0 0 0 / var(--damp)) calc(50% - var(--edge) + 3.5rem),
			rgb(0 0 0 / var(--damp)) calc(50% + var(--edge) - 3.5rem),
			#000 calc(50% + var(--edge) + 1rem),
			#000 100%
		);
		-webkit-mask-image: var(--mask);
		mask-image: var(--mask);
		/* Drifts against the page as you scroll. --read is written on :root by
		   the same scroll listener that drives the reading progress bar. */
		transform: translate3d(0, calc(var(--read, 0) * -4rem), 0);
	}

	.layer {
		position: absolute;
		inset: -20%;
		opacity: 0;
		/* Only opacity transitions; the drift below owns transform, so the two
		   never fight over the same property. */
		transition: opacity 0.9s ease;
		--line: color-mix(in oklab, var(--accent) 75%, transparent);
	}

	.layer.on {
		animation: drift 26s ease-in-out infinite alternate;
	}

	@keyframes drift {
		from {
			transform: translate3d(-1.5%, -1%, 0) scale(1.04);
		}
		to {
			transform: translate3d(1.5%, 1%, 0) scale(1.1);
		}
	}

	/* hero: nothing, so the name lands on clean ground */
	.layer[data-pattern='hero'] {
		background: none;
	}

	/* work: ruled lines, like a ledger — a career is a list of dates */
	.layer[data-pattern='work'] {
		background: repeating-linear-gradient(to bottom, var(--line) 0 1px, transparent 1px 2.6rem);
	}

	.layer[data-pattern='work'].on {
		opacity: 0.76;
	}

	/* projects: a lattice of nodes — discrete things built */
	.layer[data-pattern='projects'] {
		background-image:
			radial-gradient(var(--line) 1.9px, transparent 2px),
			radial-gradient(var(--line) 1.9px, transparent 2px);
		background-size:
			4.5rem 4.5rem,
			4.5rem 4.5rem;
		background-position:
			0 0,
			2.25rem 2.25rem;
	}

	.layer[data-pattern='projects'].on {
		opacity: 0.85;
	}

	/* upstream: rings radiating outward — work leaving for other people */
	.layer[data-pattern='upstream'] {
		background: repeating-radial-gradient(
			circle at 76% 32%,
			transparent 0 3.6rem,
			var(--line) 3.6rem calc(3.6rem + 1.5px)
		);
	}

	.layer[data-pattern='upstream'].on {
		opacity: 0.81;
	}

	/* education: evenly spaced verticals — the patch panel he cabled at Rakvere */
	.layer[data-pattern='education'] {
		background: repeating-linear-gradient(to right, var(--line) 0 1px, transparent 1px 1.6rem);
	}

	.layer[data-pattern='education'].on {
		opacity: 0.68;
	}

	/* toolkit: a dense field of points — many small tools */
	.layer[data-pattern='toolkit'] {
		background-image: radial-gradient(var(--line) 1.4px, transparent 1.5px);
		background-size: 1.9rem 1.9rem;
	}

	.layer[data-pattern='toolkit'].on {
		opacity: 0.81;
	}

	/* The patterns are static; only the change between them and the slow drift
	   move. Under reduced motion both stop and the swap is instant. */
	.backdrop.still {
		transform: none;
	}

	.backdrop.still .layer {
		transition: none;
	}

	.backdrop.still .layer.on {
		animation: none;
		transform: none;
	}
</style>
