<script lang="ts">
	import { base } from '$app/paths';
	import type { Post } from '$lib/data/qualifications';
	import { reveal } from '$lib/actions/reveal';

	let { posts }: { posts: Post[] } = $props();
</script>

<ol class="posts">
	{#each posts as post, index (post.period + post.title)}
		<li class="post" use:reveal={index * 60}>
			<span class="period mono">{post.period}</span>
			<div>
				{#if post.logo}
					<!-- The marks are brand colours on transparency: TalTech's magenta
					     disappears on the dark theme and Rakvere's pale blue on the
					     light one, so both sit on a fixed light tile instead of the
					     page ground. -->
					<span class="crest">
						<img
							src="{base}/{post.logo.src}"
							alt="{post.place} logo"
							width={post.logo.width}
							height={post.logo.height}
							loading="lazy"
							decoding="async"
						/>
					</span>
				{/if}
				<h3 class="title">{post.title}</h3>
				<p class="place">
					{#if post.placeUrl}
						<a href={post.placeUrl} rel="noopener">{post.place}</a>
					{:else}
						{post.place}
					{/if}
				</p>
				<p class="detail">{post.detail}</p>
			</div>
		</li>
	{/each}
</ol>

<style>
	.posts {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 1.75rem;
	}

	.post {
		display: grid;
		grid-template-columns: 11rem minmax(0, 1fr);
		gap: 0.35rem 1.5rem;
		padding-bottom: 1.75rem;
		border-bottom: 1px solid var(--rule);
	}

	.post:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.period {
		color: var(--muted);
		padding-top: 0.35rem;
	}

	.crest {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: #ffffff;
		border: 1px solid var(--rule-strong);
		border-radius: 8px;
		padding: 0.4rem 0.6rem;
		margin-bottom: 0.7rem;
		height: 2.9rem;
	}

	.crest img {
		height: 100%;
		width: auto;
		max-width: 11rem;
		object-fit: contain;
		display: block;
	}

	.title {
		font-size: var(--step-1);
		margin-bottom: 0.2rem;
	}

	.place {
		color: var(--accent);
		font-weight: 500;
		margin-bottom: 0.45rem;
	}

	.detail {
		color: var(--muted);
		max-width: 58ch;
	}

	@media (max-width: 44rem) {
		.post {
			grid-template-columns: 1fr;
		}

		.period {
			padding-top: 0;
		}
	}
</style>
