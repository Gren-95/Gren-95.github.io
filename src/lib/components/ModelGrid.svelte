<script lang="ts">
	import { base } from '$app/paths';
	import type { Model } from '$lib/data/models';
	import { reveal } from '$lib/actions/reveal';

	let { models }: { models: Model[] } = $props();
</script>

<div class="grid">
	{#each models as model, index (model.title)}
		<figure class="model" use:reveal={Math.min(index, 3) * 60}>
			<img
				src="{base}/{model.image.src}"
				alt="{model.title}, modelled in {model.tool}"
				width={model.image.width}
				height={model.image.height}
				loading="lazy"
				decoding="async"
			/>
			<figcaption>
				<h3>
					{model.title}
					<span class="tool">{model.tool}</span>
				</h3>
				<p>{model.summary}</p>
			</figcaption>
		</figure>
	{/each}
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(19rem, 1fr));
		gap: 1.1rem;
	}

	.model {
		margin: 0;
		background: var(--raised);
		border: 1px solid var(--rule);
		border-radius: 10px;
		overflow: hidden;
		transition:
			border-color 0.15s ease,
			transform 0.15s ease;
	}

	.model:hover {
		border-color: var(--accent);
		transform: translateY(-3px);
	}

	img {
		display: block;
		width: 100%;
		height: auto;
		/* The renders carry their own pale backdrop, so a rule keeps the image
		   from bleeding into the card on the light theme. */
		border-bottom: 1px solid var(--rule);
	}

	figcaption {
		padding: clamp(1rem, 2.5vw, 1.4rem);
	}

	h3 {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		font-size: var(--step-1);
		margin-bottom: 0.5rem;
	}

	.tool {
		font-family: var(--mono);
		font-size: var(--step--1);
		font-weight: 400;
		color: var(--muted);
		white-space: nowrap;
	}

	@media (prefers-reduced-motion: reduce) {
		.model {
			transition: none;
		}

		.model:hover {
			transform: none;
		}
	}
</style>
