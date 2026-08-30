<script lang="ts">
	let theme = $state<'light' | 'dark'>('light');

	$effect(() => {
		theme = (document.documentElement.dataset.theme as 'light' | 'dark') ?? 'light';
	});

	function toggle() {
		theme = theme === 'light' ? 'dark' : 'light';
		document.documentElement.dataset.theme = theme;
		try {
			localStorage.setItem('theme', theme);
		} catch {
			// Storage can be unavailable; the choice simply won't persist.
		}
	}
</script>

<button class="toggle" onclick={toggle} aria-pressed={theme === 'dark'}>
	{theme === 'light' ? 'Dark' : 'Light'}
</button>

<style>
	.toggle {
		background: none;
		border: 1px solid var(--rule);
		color: var(--ink-muted);
		padding: 0.28rem 0.7rem;
		cursor: pointer;
		font: inherit;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		transition:
			border-color 0.2s ease,
			color 0.2s ease;
	}

	.toggle:hover {
		border-color: var(--ink);
		color: var(--ink);
	}
</style>
