<script lang="ts">
	import { base } from '$app/paths';
	import type { Model } from '$lib/data/models';
	import { reveal } from '$lib/actions/reveal';

	let { models }: { models: Model[] } = $props();

	type Viewing = 'loading' | 'ready' | 'failed';

	/** Which models have been switched from the still to the 3D view, by title. */
	let viewing = $state<Record<string, Viewing>>({});

	/** The viewer is a large library, so it is fetched only when somebody asks for a model. */
	async function open3d(model: Model) {
		viewing[model.title] = 'loading';
		try {
			await import('@google/model-viewer');
			viewing[model.title] = 'ready';
		} catch {
			viewing[model.title] = 'failed';
		}
	}

	const megabytes = (bytes: number) => (bytes / 1e6).toFixed(bytes < 1e6 ? 2 : 1);
</script>

<div class="grid">
	{#each models as model, index (model.title)}
		{@const state = viewing[model.title]}
		<figure class="model" use:reveal={Math.min(index, 3) * 60}>
			<div class="stage">
				{#if model.glb && state === 'ready'}
					<model-viewer
						src="{base}/{model.glb.src}"
						poster="{base}/{model.image.src}"
						alt="{model.title}, a 3D model you can turn around"
						camera-controls
						auto-rotate
						shadow-intensity="1"
						environment-image="neutral"
						exposure="0.7"
						camera-orbit="35deg 72deg {model.glb.distance}"
						interaction-prompt="none"
					></model-viewer>
				{:else}
					<img
						src="{base}/{model.image.src}"
						alt="{model.title}, modelled in {model.tool}"
						width={model.image.width}
						height={model.image.height}
						loading="lazy"
						decoding="async"
					/>
					{#if model.glb}
						<button
							class="open3d mono"
							type="button"
							disabled={state === 'loading'}
							onclick={() => open3d(model)}
						>
							{#if state === 'loading'}
								Loading 3D…
							{:else if state === 'failed'}
								Could not load, try again
							{:else}
								Turn it in 3D · {megabytes(model.glb.bytes)} MB
							{/if}
						</button>
					{/if}
				{/if}
			</div>
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

	.stage {
		position: relative;
		aspect-ratio: 900 / 506;
		/* The renders carry their own pale backdrop, so a rule keeps the image
		   from bleeding into the card on the light theme. */
		border-bottom: 1px solid var(--rule);
	}

	img,
	model-viewer {
		display: block;
		width: 100%;
		height: 100%;
	}

	img {
		object-fit: cover;
	}

	model-viewer {
		--poster-color: transparent;
		background: color-mix(in oklab, var(--ink) 12%, var(--paper));
	}

	.open3d {
		position: absolute;
		right: 0.65rem;
		bottom: 0.65rem;
		padding: 0.35rem 0.8rem;
		font-size: var(--step--1);
		color: var(--ink);
		background: color-mix(in oklab, var(--paper) 90%, transparent);
		border: 1px solid var(--rule-strong);
		border-radius: 999px;
		cursor: pointer;
		transition:
			border-color 0.15s ease,
			color 0.15s ease;
	}

	.open3d:hover:not(:disabled) {
		color: var(--accent);
		border-color: var(--accent);
	}

	.open3d:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
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
</style>
