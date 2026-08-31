<script lang="ts">
	import type { LanguageShare } from '$lib/languageMix';
	import { reveal } from '$lib/actions/reveal';

	let { languages, classified }: { languages: LanguageShare[]; classified: number } = $props();

	const widest = $derived(Math.max(...languages.map((l) => l.count), 1));
</script>

<!--
	Sorted bars rather than one stacked bar: with fourteen languages the smallest
	would be a two-percent sliver. Every row is named and counted, so the colour
	reinforces identity without ever having to carry it — which is what the
	linguist palette needs, since several of its hues fail contrast against one
	surface or the other.
-->
<figure class="mix" use:reveal>
	<figcaption>
		Public repositories by primary language
		<span class="note">{classified} classified, forks excluded</span>
	</figcaption>

	<ol class="rows">
		{#each languages as language (language.name)}
			<li class="row">
				<span class="name">
					<span class="swatch" style="--lang: {language.color}" aria-hidden="true"></span>
					{language.name}
				</span>
				<span class="track">
					<span
						class="fill"
						style="--lang: {language.color}; width: {(language.count / widest) * 100}%"
					></span>
				</span>
				<span class="count">{language.count}</span>
			</li>
		{/each}
	</ol>
</figure>

<style>
	.mix {
		margin: 0 0 clamp(1.75rem, 4vw, 2.5rem);
	}

	figcaption {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0 0.6rem;
		color: var(--ink);
		font-weight: 500;
		margin-bottom: 1rem;
	}

	.note {
		color: var(--muted);
		font-weight: 400;
		font-size: var(--step--1);
	}

	.rows {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.45rem 2.5rem;
	}

	.row {
		display: grid;
		grid-template-columns: 8.5rem minmax(0, 1fr) 2rem;
		align-items: center;
		gap: 0.75rem;
	}

	.name {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: var(--step--1);
		color: var(--ink);
		min-width: 0;
	}

	.swatch,
	.fill {
		/* An outline on every mark, because the palette is fixed externally and
		   some of it is near-invisible on one surface or the other: JavaScript's
		   yellow on light, PowerShell's navy on dark. */
		box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--ink) 28%, transparent);
	}

	.swatch {
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 3px;
		background: var(--lang);
		flex: none;
	}

	.track {
		height: 0.6rem;
		background: color-mix(in oklab, var(--ink) 7%, transparent);
		border-radius: 4px;
		overflow: hidden;
	}

	.fill {
		display: block;
		height: 100%;
		background: var(--lang);
		border-radius: 4px;
	}

	.count {
		font-family: var(--mono);
		font-size: var(--step--1);
		color: var(--muted);
		text-align: right;
	}

	@media (min-width: 52rem) {
		.rows {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
