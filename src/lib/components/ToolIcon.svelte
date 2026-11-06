<script lang="ts">
	import type { ToolBadge } from '$lib/resolveToolIcons';

	let { badge }: { badge: ToolBadge } = $props();
</script>

<!-- The logo in its brand colour, pulled a little towards the page's ink so a near-black
     brand does not vanish on the dark theme. A tool without a logo gets its first letter. -->
{#if badge.path}
	<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" style:--brand={badge.hex}>
		<path d={badge.path} />
	</svg>
{:else}
	<span class="icon letter" aria-hidden="true" style:--brand={badge.hex}>{badge.letter}</span>
{/if}

<style>
	.icon {
		flex: none;
		width: 1em;
		height: 1em;
		fill: color-mix(in oklab, var(--brand) 80%, var(--ink));
	}

	.letter {
		display: inline-grid;
		place-items: center;
		font-family: var(--mono);
		font-size: 0.7em;
		font-weight: 700;
		line-height: 1;
		color: var(--paper);
		background: color-mix(in oklab, var(--brand) 80%, var(--ink));
		border-radius: 50%;
		width: 1.4em;
		height: 1.4em;
	}
</style>
