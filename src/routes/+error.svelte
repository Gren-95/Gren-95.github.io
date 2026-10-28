<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { profile } from '$lib/data/profile';

	const message = $derived(page.status === 404 ? 'This page does not exist.' : page.error?.message);
</script>

<svelte:head>
	<title>{page.status} | {profile.name}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="shell error">
	<p class="mono code">{page.status}</p>
	<h1>{message}</h1>
	<p class="lead">
		The address you followed is not part of this site. It may have moved, or the link may be
		mistyped.
	</p>
	<p class="links">
		<a href="{base}/">Back to the start</a>
		<span aria-hidden="true">·</span>
		<a href={profile.github} rel="external">GitHub</a>
	</p>
</main>

<style>
	.error {
		min-height: 100svh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 1.1rem;
		padding-block: 4rem;
	}

	.code {
		color: var(--accent);
		font-size: var(--step-2);
		letter-spacing: 0.04em;
	}

	h1 {
		font-size: var(--step-3);
	}

	.lead {
		color: var(--muted);
		max-width: 44ch;
	}

	.links {
		display: flex;
		gap: 0.9rem;
		align-items: baseline;
		margin-top: 0.6rem;
	}

	.links span {
		color: var(--rule-strong);
	}
</style>
