<script lang="ts">
	import ProjectEntry from '$lib/components/ProjectEntry.svelte';
	import LanguageMix from '$lib/components/LanguageMix.svelte';
	import ModelGrid from '$lib/components/ModelGrid.svelte';
	import PostList from '$lib/components/PostList.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { base } from '$app/paths';
	import { scrollProgress } from '$lib/actions/scrollProgress';
	import { profile } from '$lib/data/profile';
	import { contributions } from '$lib/data/contributions';
	import { models } from '$lib/data/models';
	import { work, education, languages } from '$lib/data/qualifications';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const personSchema = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: profile.name,
		alternateName: profile.handle,
		url: profile.site,
		image: `${profile.site}og.png`,
		email: `mailto:${profile.email}`,
		jobTitle: profile.role,
		worksFor: { '@type': 'Organization', name: profile.employer, url: profile.employerUrl },
		address: { '@type': 'PostalAddress', addressLocality: 'Rakvere', addressCountry: 'EE' },
		alumniOf: education.map((school) => ({
			'@type': 'EducationalOrganization',
			name: school.place,
			...(school.placeUrl ? { url: school.placeUrl } : {})
		})),
		knowsLanguage: languages.map((l) => l.name),
		sameAs: [profile.github, profile.linkedin]
	};

	// Small numbers read better spelled out in prose than as numerals.
	const spelled = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
	const contributionCount = spelled[contributions.length] ?? String(contributions.length);

	// Non-breaking spaces keep the stagger's inline-block letters from collapsing.
	const letters = profile.name.split('').map((letter) => (letter === ' ' ? '\u00A0' : letter));

	const sections = [
		{ id: 'work', label: 'Work' },
		{ id: 'projects', label: 'Projects' },
		{ id: 'upstream', label: 'Open source' },
		{ id: 'modelling', label: 'Modelling' },
		{ id: 'education', label: 'Education' },
		{ id: 'toolkit', label: 'Toolkit' }
	];
</script>

<svelte:head>
	<title>{profile.name} — {profile.role}, {profile.location}</title>
	<meta name="description" content="{profile.role} at {profile.employer}. {profile.intro}" />
	<link rel="canonical" href={profile.site} />

	<meta property="og:title" content="{profile.name} — {profile.role}" />
	<meta property="og:description" content={profile.intro} />
	<meta property="og:type" content="profile" />
	<meta property="og:url" content={profile.site} />
	<meta property="og:image" content="{profile.site}og.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="{profile.name}, {profile.role} at {profile.employer}" />
	<meta property="og:locale" content="en_GB" />
	<meta property="og:site_name" content={profile.name} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="{profile.name} — {profile.role}" />
	<meta name="twitter:description" content={profile.intro} />
	<meta name="twitter:image" content="{profile.site}og.png" />

	<!--
		Person schema, so a search engine can connect the name to the employer,
		the schools and the profiles rather than inferring them from prose.
		Everything here is stated on the page itself.
	-->
	{@html `<script type="application/ld+json">${JSON.stringify(personSchema)}</script>`}
</svelte:head>

<a class="skip-link" href="#work">Skip to the content</a>

<header class="topbar" use:scrollProgress>
	<div class="shell bar">
		<a class="wordmark" href="#top">{profile.handle}</a>
		<nav class="nav">
			{#each sections as section (section.id)}
				<a href="#{section.id}">{section.label}</a>
			{/each}
		</nav>
		<ThemeToggle />
	</div>
</header>

<main id="top">
	<section class="shell hero">
		{#if profile.available}
			<p class="badge mono enter" style="--d: 0ms">
				<span class="dot" aria-hidden="true"></span> Open to work
			</p>
		{/if}

		<h1 class="name">
			<span class="sr-only">{profile.name}</span>
			<span aria-hidden="true">
				{#each letters as letter, index (index)}
					<span class="letter" style="--i: {index}">{letter}</span>
				{/each}
			</span>
		</h1>

		<p class="role enter" style="--d: 520ms">
			{profile.role} at <a href={profile.employerUrl} rel="noopener">{profile.employer}</a>, based
			in {profile.location}.
		</p>

		<p class="intro enter" style="--d: 600ms">{profile.intro}</p>

		<p class="highlight enter" style="--d: 640ms">
			Most recently I fixed a blocking call on Home Assistant’s event loop in the
			<a href={contributions[0].url} rel="noopener">X-Sense integration</a>, one of
			{contributionCount} contributions merged by maintainers of projects I do not own.
		</p>

		<div class="links enter" style="--d: 680ms">
			<a class="link" href={profile.github} rel="noopener">GitHub</a>
			<a class="link" href={profile.linkedin} rel="noopener">LinkedIn</a>
			<a class="link" href="mailto:{profile.email}">Email</a>
			<a class="link" href="{base}/cv.pdf">CV (PDF)</a>
		</div>
	</section>

	<section class="shell section" id="work">
		<div class="section-head">
			<h2>Work</h2>
			<p class="section-note">One employer, two roles.</p>
		</div>
		<PostList posts={work} />
	</section>

	<section class="shell section" id="projects">
		<div class="section-head">
			<h2>Projects</h2>
			<p class="section-note">
				Six things I have built, newest first. Language, stars, dates and live links come from the
				GitHub API when the site builds.
			</p>
		</div>
		<LanguageMix languages={data.languages} classified={data.classified} />

		<div class="grid">
			{#each data.projects as project, index (project.repo)}
				<ProjectEntry {project} {index} />
			{/each}
		</div>
	</section>
	<section class="shell section" id="upstream">
		<div class="section-head">
			<h2>Open source</h2>
			<p class="section-note">Work reviewed and merged by maintainers of projects I do not own.</p>
		</div>
		<ol class="contributions">
			{#each contributions as contribution, index (contribution.url)}
				<li class="contribution" use:reveal={index * 60}>
					<span class="state mono" data-state={contribution.state}>{contribution.state}</span>
					<div>
						<h3 class="contribution-title">
							<a href={contribution.url} rel="noopener">
								{contribution.project} <span class="ref mono">{contribution.reference}</span>
							</a>
						</h3>
						<p class="detail">{contribution.summary}</p>
					</div>
				</li>
			{/each}
		</ol>
	</section>
	<section class="shell section" id="modelling">
		<div class="section-head">
			<h2>3D modelling</h2>
			<p class="section-note">
				Three of nine coursework models. Tinkercad and SketchUp for the set exercises, Blender when
				the set tool was Windows-only.
			</p>
		</div>
		<ModelGrid {models} />
	</section>

	<section class="shell section" id="education">
		<div class="section-head">
			<h2>Education</h2>
			<p class="section-note">Vocational, then applied higher education.</p>
		</div>
		<PostList posts={education} />
	</section>
	<section class="shell section" id="toolkit">
		<div class="section-head">
			<h2>Toolkit</h2>
			<p class="section-note">What I have actually put into production or into a homelab.</p>
		</div>
		<div class="tools">
			{#each data.toolkit as group, index (group.heading)}
				<div class="tool-group" use:reveal={Math.min(index, 3) * 60}>
					<h3 class="tool-heading">{group.heading}</h3>
					<ul class="chips">
						{#each group.tools as tool (tool.name)}
							<li class="chip" style="--brand: {tool.hex}; --on-brand: {tool.fg}">
								{#if tool.path}
									<svg viewBox="0 0 24 24" aria-hidden="true"><path d={tool.path} /></svg>
								{:else}
									<span class="mark" aria-hidden="true">{tool.letter}</span>
								{/if}
								<span>{tool.name}</span>
							</li>
						{/each}
					</ul>
				</div>
			{/each}

			<div class="tool-group" use:reveal>
				<h3 class="tool-heading">AI tools</h3>
				<ul class="chips">
					{#each data.aiTools as tool (tool.name)}
						<li class="chip" style="--brand: {tool.hex}; --on-brand: {tool.fg}">
							{#if tool.path}
								<svg viewBox="0 0 24 24" aria-hidden="true"><path d={tool.path} /></svg>
							{:else}
								<span class="mark" aria-hidden="true">{tool.letter}</span>
							{/if}
							<span>{tool.name}</span>
						</li>
					{/each}
				</ul>
			</div>

			<div class="tool-group" use:reveal>
				<h3 class="tool-heading">Spoken languages</h3>
				<ul class="spoken">
					{#each languages as language (language.name)}
						<li><strong>{language.name}</strong> — {language.level}</li>
					{/each}
				</ul>
			</div>
		</div>
	</section>

	<footer class="shell colophon">
		<p class="colophon-links">
			<a href={profile.github} rel="noopener">github.com/{profile.handle}</a>
			<a href={profile.linkedin} rel="noopener">LinkedIn</a>
			<a href="mailto:{profile.email}">{profile.email}</a>
		</p>
	</footer>
</main>

<style>
	.topbar {
		position: sticky;
		top: 0;
		z-index: 10;
		background: color-mix(in srgb, var(--paper) 90%, transparent);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid var(--rule);
	}

	/* Reading progress. --read is written by the scrollProgress action; see
	   there for why this isn't animation-timeline: scroll(). */
	.topbar::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -1px;
		width: 100%;
		height: 2px;
		background: var(--accent);
		transform: scaleX(var(--read, 0));
		transform-origin: 0 50%;
	}

	.bar {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding-block: 0.85rem;
	}

	.wordmark {
		font-family: var(--display);
		font-weight: 700;
		font-size: 1.15rem;
		letter-spacing: -0.02em;
		text-decoration: none;
		margin-right: auto;
	}

	.nav {
		display: none;
		gap: 1.5rem;
	}

	.nav a {
		color: var(--muted);
		text-decoration: none;
		font-weight: 500;
	}

	.nav a:hover {
		color: var(--ink);
	}

	.hero {
		padding-block: clamp(3rem, 9vh, 5.5rem) clamp(2.5rem, 6vh, 4rem);
	}

	.badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--accent);
		background: var(--accent-wash);
		border-radius: 999px;
		padding: 0.25rem 0.8rem;
		margin-bottom: 1.5rem;
	}

	.dot {
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 50%;
		background: currentColor;
	}

	.name {
		font-size: var(--step-3);
		font-weight: 700;
		letter-spacing: -0.035em;
		max-width: 16ch;
	}

	.letter {
		display: inline-block;
		animation: rise 0.75s cubic-bezier(0.2, 0.7, 0.3, 1) both;
		animation-delay: calc(var(--i) * 26ms);
	}

	/* Everything else in the hero follows the name in, one beat apart. */
	.enter {
		animation: rise 0.7s cubic-bezier(0.2, 0.7, 0.3, 1) both;
		animation-delay: var(--d, 0ms);
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(0.42em);
			filter: blur(8px);
		}
	}

	.role {
		font-size: var(--step-1);
		margin-top: 1.1rem;
		max-width: 40ch;
	}

	.intro {
		color: var(--muted);
		margin-top: 0.9rem;
		max-width: 56ch;
	}

	.highlight {
		margin-top: 0.9rem;
		max-width: 56ch;
	}

	.highlight a {
		color: var(--accent);
		text-decoration-color: color-mix(in oklab, var(--accent) 45%, transparent);
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.7rem;
		margin-top: 2rem;
	}

	.link {
		border: 1px solid var(--rule-strong);
		border-radius: 8px;
		padding: 0.5rem 1.1rem;
		text-decoration: none;
		font-weight: 500;
		transition:
			border-color 0.15s ease,
			background-color 0.15s ease;
	}

	.link:hover {
		border-color: var(--accent);
		background: var(--accent-wash);
	}

	.section {
		padding-block: clamp(2.5rem, 6vw, 4rem);
		border-top: 1px solid var(--rule);
	}

	.section-head {
		margin-bottom: clamp(1.75rem, 4vw, 2.5rem);
	}

	.section-head h2 {
		font-size: var(--step-2);
		font-weight: 700;
	}

	.section-note {
		color: var(--muted);
		margin-top: 0.5rem;
		max-width: 58ch;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(19rem, 1fr));
		gap: 1.1rem;
	}

	.contributions {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 1.75rem;
	}

	.contribution {
		display: grid;
		grid-template-columns: 11rem minmax(0, 1fr);
		gap: 0.35rem 1.5rem;
		padding-bottom: 1.75rem;
		border-bottom: 1px solid var(--rule);
	}

	.contribution:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.state {
		text-transform: uppercase;
		color: var(--muted);
		padding-top: 0.35rem;
	}

	.state[data-state='merged'] {
		color: var(--accent);
	}

	.contribution-title {
		font-size: var(--step-1);
		margin-bottom: 0.35rem;
	}

	.contribution-title a {
		text-decoration: none;
	}

	.ref {
		color: var(--muted);
		font-weight: 400;
	}

	.detail {
		color: var(--muted);
		max-width: 58ch;
	}

	.tools {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
		gap: clamp(1.75rem, 4vw, 2.75rem);
	}

	.tool-heading {
		font-size: var(--step-1);
		margin-bottom: 0.85rem;
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	/* Each chip wears its own brand: the logo is monochrome, drawn in whichever
	   of black or white reads better on that brand colour. */
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		background: var(--brand);
		color: var(--on-brand);
		border-radius: 7px;
		padding: 0.3rem 0.7rem 0.3rem 0.55rem;
		font-size: var(--step--1);
		font-weight: 500;
		line-height: 1.5;
		/* A hairline in the contrasting colour, so brands that are essentially
		   black (Bun, Express, macOS, Cursor) stay defined on the dark theme. */
		box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--on-brand) 20%, transparent);
		transition:
			transform 0.18s ease,
			box-shadow 0.18s ease;
	}

	.chip svg {
		width: 1.05em;
		height: 1.05em;
		fill: currentColor;
		flex: none;
	}

	.chip .mark {
		width: 1.05em;
		height: 1.05em;
		display: grid;
		place-items: center;
		border: 1.5px solid currentColor;
		border-radius: 3px;
		font-size: 0.78em;
		font-weight: 700;
		flex: none;
	}

	.chip:hover {
		transform: translateY(-3px);
		box-shadow:
			inset 0 0 0 1px color-mix(in oklab, var(--on-brand) 20%, transparent),
			0 7px 20px -7px color-mix(in oklab, var(--brand) 80%, transparent);
	}

	.spoken {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.4rem;
		color: var(--muted);
	}

	.colophon {
		border-top: 1px solid var(--rule);
		padding-block: clamp(2rem, 5vw, 3rem) clamp(3rem, 8vw, 5rem);
		color: var(--muted);
	}

	.colophon p {
		max-width: 62ch;
	}

	.colophon-links {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		margin-top: 1rem;
	}

	@media (min-width: 48rem) {
		.nav {
			display: flex;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.letter,
		.enter {
			animation: none;
		}

		.chip:hover {
			transform: none;
		}
	}

	@media (max-width: 44rem) {
		.contribution {
			grid-template-columns: 1fr;
		}

		.state {
			padding-top: 0;
		}
	}
</style>
