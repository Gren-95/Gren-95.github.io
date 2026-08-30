<script lang="ts">
	type Theme = 'light' | 'dark';

	let theme = $state<Theme>('light');

	$effect(() => {
		theme = (document.documentElement.dataset.theme as Theme) ?? 'light';
	});

	function apply(next: Theme) {
		theme = next;
		document.documentElement.dataset.theme = next;
		try {
			localStorage.setItem('theme', next);
		} catch {
			// Storage can be unavailable; the choice simply won't persist.
		}
	}

	/**
	 * Swaps the theme behind a circular wipe that grows from the button itself.
	 * Browsers without the View Transitions API, and anyone who asked for
	 * reduced motion, get the same instant swap without the flourish.
	 */
	function toggle(event: MouseEvent) {
		const next: Theme = theme === 'light' ? 'dark' : 'light';
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (reduced || !document.startViewTransition) {
			apply(next);
			return;
		}

		const button = event.currentTarget as HTMLElement;
		const box = button.getBoundingClientRect();
		const x = box.left + box.width / 2;
		const y = box.top + box.height / 2;
		// Radius that still covers the furthest corner of the viewport.
		const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

		const transition = document.startViewTransition(() => apply(next));

		transition.ready.then(() => {
			document.documentElement.animate(
				{
					clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`]
				},
				{
					duration: 620,
					easing: 'cubic-bezier(.45,.05,.25,1)',
					pseudoElement: '::view-transition-new(root)'
				}
			);
		});
	}
</script>

<button
	class="toggle"
	onclick={toggle}
	aria-label="Switch to {theme === 'light' ? 'dark' : 'light'} theme"
	aria-pressed={theme === 'dark'}
	data-theme={theme}
>
	<svg class="orb" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
		<mask id="crescent">
			<rect x="0" y="0" width="24" height="24" fill="white" />
			<circle class="bite" cx="26" cy="6" r="7" fill="black" />
		</mask>
		<circle class="disc" cx="12" cy="12" r="5.2" fill="currentColor" mask="url(#crescent)" />
		<g class="rays" stroke="currentColor" stroke-width="1.7" stroke-linecap="round">
			<line x1="12" y1="1.4" x2="12" y2="3.4" />
			<line x1="12" y1="20.6" x2="12" y2="22.6" />
			<line x1="1.4" y1="12" x2="3.4" y2="12" />
			<line x1="20.6" y1="12" x2="22.6" y2="12" />
			<line x1="4.5" y1="4.5" x2="5.9" y2="5.9" />
			<line x1="18.1" y1="18.1" x2="19.5" y2="19.5" />
			<line x1="4.5" y1="19.5" x2="5.9" y2="18.1" />
			<line x1="18.1" y1="5.9" x2="19.5" y2="4.5" />
		</g>
	</svg>
	<span class="label">{theme === 'light' ? 'Dark' : 'Light'}</span>
</button>

<style>
	.toggle {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		background: none;
		border: 1px solid var(--rule-strong);
		border-radius: 999px;
		color: var(--muted);
		padding: 0.4rem 0.95rem 0.4rem 0.75rem;
		cursor: pointer;
		font-family: var(--body);
		font-size: var(--step--1);
		font-weight: 500;
		position: relative;
		overflow: hidden;
		transition:
			border-color 0.2s ease,
			color 0.2s ease;
	}

	/* A wash that sweeps across the button on hover, clipped by the pill. */
	.toggle::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(110deg, transparent 20%, var(--accent-wash) 50%, transparent 80%);
		transform: translateX(-100%);
		transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.toggle:hover {
		border-color: var(--accent);
		color: var(--accent);
	}

	.toggle:hover::before {
		transform: translateX(100%);
	}

	.orb,
	.label {
		position: relative;
	}

	.orb {
		overflow: visible;
	}

	.disc,
	.bite,
	.rays {
		transition:
			cx 0.5s cubic-bezier(0.4, 0, 0.2, 1),
			cy 0.5s cubic-bezier(0.4, 0, 0.2, 1),
			r 0.5s cubic-bezier(0.4, 0, 0.2, 1),
			opacity 0.35s ease,
			transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.rays {
		transform-origin: 12px 12px;
	}

	/* Dark: the rays retract and a bite is taken out of the disc. */
	.toggle[data-theme='dark'] .bite {
		cx: 17px;
		cy: 7px;
	}

	.toggle[data-theme='dark'] .disc {
		r: 7.4px;
	}

	.toggle[data-theme='dark'] .rays {
		opacity: 0;
		transform: rotate(-45deg) scale(0.4);
	}

	@media (prefers-reduced-motion: reduce) {
		.toggle::before {
			display: none;
		}

		.disc,
		.bite,
		.rays {
			transition: none;
		}
	}
</style>
