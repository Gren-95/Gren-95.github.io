<script lang="ts">
	/**
	 * A fixed layer behind the page that changes pattern as each section takes
	 * the middle of the viewport.
	 *
	 * The patterns are not decoration for its own sake — each encodes something
	 * about its section:
	 *
	 *   work       ruled lines, like a ledger — a career is a list of dates
	 *   projects   a scattered lattice of nodes — discrete things built
	 *   upstream   rings radiating outward — work leaving for other people
	 *   education  evenly spaced verticals — the patch panel he cabled at Rakvere
	 *   toolkit    a dense field of points — many small tools
	 *
	 * Only opacity and transform animate, both compositor-friendly, and the
	 * whole thing is inert to assistive technology.
	 */
	const patterns = ['hero', 'work', 'projects', 'upstream', 'education', 'toolkit'];

	let active = $state('hero');
	let reduced = $state(false);

	$effect(() => {
		reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		const sections = [...document.querySelectorAll<HTMLElement>('[data-backdrop]')];
		if (!sections.length) return;

		// Only the section crossing the middle band of the viewport intersects,
		// so there is exactly one candidate at a time and no tie to break.
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					active = (entry.target as HTMLElement).dataset.backdrop ?? 'hero';
				}
			},
			{ rootMargin: '-40% 0px -40% 0px' }
		);

		for (const section of sections) observer.observe(section);

		return () => observer.disconnect();
	});
</script>

<div class="backdrop" class:still={reduced} aria-hidden="true">
	{#each patterns as pattern (pattern)}
		<div class="layer" data-pattern={pattern} class:on={active === pattern}></div>
	{/each}
</div>

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: -1;
		pointer-events: none;
		overflow: hidden;

		/* Full strength out in the page margins, damped to 42% across the
		   content column, so the pattern never costs the text contrast. On a
		   narrow viewport `50% - 34rem` goes negative, the whole strip falls
		   inside the damped band, and mobile is safe without a media query.
		   Measured rather than assumed: see the contrast note in the README. */
		--edge: 34rem;
		--mask: linear-gradient(
			to right,
			#000 0,
			#000 calc(50% - var(--edge) - 4rem),
			rgb(0 0 0 / 0.42) calc(50% - var(--edge)),
			rgb(0 0 0 / 0.42) calc(50% + var(--edge)),
			#000 calc(50% + var(--edge) + 4rem),
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
		--line: color-mix(in oklab, var(--accent) 62%, transparent);
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
		opacity: 0.52;
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
		opacity: 0.58;
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
		opacity: 0.55;
	}

	/* education: evenly spaced verticals — the patch panel he cabled at Rakvere */
	.layer[data-pattern='education'] {
		background: repeating-linear-gradient(to right, var(--line) 0 1px, transparent 1px 1.6rem);
	}

	.layer[data-pattern='education'].on {
		opacity: 0.46;
	}

	/* toolkit: a dense field of points — many small tools */
	.layer[data-pattern='toolkit'] {
		background-image: radial-gradient(var(--line) 1.4px, transparent 1.5px);
		background-size: 1.9rem 1.9rem;
	}

	.layer[data-pattern='toolkit'].on {
		opacity: 0.55;
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
