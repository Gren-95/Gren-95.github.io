<script lang="ts">
	import { profile } from '$lib/data/profile';
	import { work, education, toolkit, languages } from '$lib/data/qualifications';
	import { contributions } from '$lib/data/contributions';
	import { projects } from '$lib/data/projects';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const top = $derived(
		data.languages
			.slice(0, 6)
			.map((l) => l.name)
			.join(', ')
	);
</script>

<svelte:head>
	<title>{profile.name} — CV</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<article class="cv">
	<header>
		<h1>{profile.name}</h1>
		<p class="role">{profile.role} at {profile.employer} · {profile.location}</p>
		<p class="contact">
			<a href="mailto:{profile.email}">{profile.email}</a> ·
			<a href={profile.site}>gren-95.github.io</a> ·
			<a href={profile.github}>github.com/{profile.handle}</a> ·
			<a href={profile.linkedin}>LinkedIn</a>
		</p>
		<p class="intro">{profile.intro}</p>
	</header>

	<section>
		<h2>Experience</h2>
		{#each work as post (post.period + post.title)}
			<div class="row">
				<span class="when">{post.period}</span>
				<div>
					<h3>{post.title} — {post.place}</h3>
					<p>{post.detail}</p>
				</div>
			</div>
		{/each}
	</section>

	<section>
		<h2>Education</h2>
		{#each education as post (post.period + post.title)}
			<div class="row">
				<span class="when">{post.period}</span>
				<div>
					<h3>{post.title} — {post.place}</h3>
					<p>{post.detail}</p>
				</div>
			</div>
		{/each}
	</section>

	<section>
		<h2>Open source</h2>
		{#each contributions as c (c.url)}
			<div class="row">
				<span class="when">{c.state}</span>
				<div>
					<h3>{c.project} {c.reference}</h3>
					<p>{c.summary}</p>
				</div>
			</div>
		{/each}
	</section>

	<section class="tight">
		<h2>Projects</h2>
		<ul class="plain">
			{#each projects as p (p.repo)}
				<li><strong>{p.repo}</strong> — {p.summary}</li>
			{/each}
		</ul>
	</section>

	<section class="tight">
		<h2>Toolkit</h2>
		{#each toolkit as group (group.heading)}
			<p class="tools"><strong>{group.heading}:</strong> {group.tools.join(', ')}</p>
		{/each}
		<p class="tools"><strong>Most used languages:</strong> {top}</p>
		<p class="tools">
			<strong>Spoken languages:</strong>
			{languages.map((l) => `${l.name} (${l.level})`).join(', ')}
		</p>
	</section>
</article>

<style>
	.cv {
		max-width: 46rem;
		margin: 0 auto;
		padding: clamp(1.5rem, 5vw, 3rem);
		font-size: 10.5pt;
		line-height: 1.5;
	}

	h1 {
		font-size: 24pt;
	}

	.role {
		font-size: 12pt;
		margin-top: 0.35rem;
	}

	.contact,
	.intro {
		color: var(--muted);
		margin-top: 0.4rem;
	}

	section {
		margin-top: 1.6rem;
		break-inside: auto;
	}

	h2 {
		font-size: 12pt;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		border-bottom: 1px solid var(--rule-strong);
		padding-bottom: 0.25rem;
		margin-bottom: 0.7rem;
	}

	h3 {
		font-size: 11pt;
	}

	.row {
		display: grid;
		grid-template-columns: 9rem minmax(0, 1fr);
		gap: 0.9rem;
		margin-bottom: 0.75rem;
		break-inside: avoid;
	}

	.when {
		color: var(--muted);
		font-family: var(--mono);
		font-size: 9pt;
		padding-top: 0.15rem;
	}

	.plain {
		margin: 0;
		padding-left: 1.1rem;
	}

	.plain li,
	.tools {
		margin-bottom: 0.35rem;
		break-inside: avoid;
	}

	/* A4 with real margins. The previous CV, produced in Word, was A4 too, and
	   Estonian employers expect it; Chrome's print-to-pdf otherwise defaults to
	   US Letter with no margin at all. */
	@page {
		size: A4;
		margin: 18mm 16mm;
	}

	@media print {
		/* A CV prints on paper. Force the light palette whichever theme the
		   reader is browsing in, or a dark-mode visitor gets an ink-heavy PDF. */
		:global(:root),
		:global(:root[data-theme='dark']) {
			--paper: #ffffff;
			--raised: #ffffff;
			--ink: #111111;
			--muted: #444444;
			--rule: #dddddd;
			--rule-strong: #999999;
			--accent: #0e7490;

			/* Must sit in this block, not on a bare html selector: the canvas
			   behind the page margins follows colour-scheme, and
			   :root[data-theme='dark'] outranks `html` even inside @media
			   print, which left a white sheet in a black A4 margin. */
			color-scheme: light;
			background: #ffffff;
		}

		/* The page-margin area is painted from the canvas, which follows the
		   root's colour-scheme — so overriding body alone left a white sheet
		   floating in a black A4 margin. */
		:global(html),
		:global(body) {
			background: #ffffff;
			color: #111111;
			color-scheme: light;
		}

		:global(.grain) {
			display: none !important;
		}

		.cv {
			padding: 0;
			max-width: none;
		}

		a {
			text-decoration: none;
		}
	}
</style>
