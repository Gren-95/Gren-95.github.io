<script lang="ts">
	import type { Post } from '$lib/data/qualifications';
	import { reveal } from '$lib/actions/reveal';

	let { posts }: { posts: Post[] } = $props();
</script>

<ol class="posts">
	{#each posts as post, index (post.period + post.title)}
		<li class="post" use:reveal={index * 60}>
			<span class="period mono">{post.period}</span>
			<div>
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
