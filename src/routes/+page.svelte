<script lang="ts">
	import ProjectEntry from '$lib/components/ProjectEntry.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { profile } from '$lib/data/profile';
	import { contributions } from '$lib/data/contributions';
	import { skillGroups, education, languages } from '$lib/data/qualifications';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const built = $derived(
		new Date(data.builtAt).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})
	);
</script>

<svelte:head>
	<title>{profile.name} — desktop software and self-hosted services</title>
	<meta
		name="description"
		content="{profile.thesis} Work, capabilities and schooling of {profile.name}, {profile.location}."
	/>
	<meta property="og:title" content="{profile.name} — {profile.handle}" />
	<meta property="og:description" content={profile.thesis} />
	<meta property="og:type" content="profile" />
</svelte:head>

<header class="topbar">
	<div class="shell topbar-inner mono">
		<span class="wordmark">{profile.handle}</span>
		<nav>
			<a href="#catalogue">Built</a>
			<a href="#upstream">Upstream</a>
			<a href="#capabilities">Capable of</a>
			<a href="#schooling">Schooling</a>
		</nav>
		<ThemeToggle />
	</div>
</header>

<main>
	<!-- Hero: the name at full size, one sentence of thesis, and the two facts
	     that place him. No statistics row; the catalogue is the evidence. -->
	<section class="shell hero">
		<h1 class="name">{profile.name}</h1>
		<p class="thesis">{profile.thesis}</p>
		<p class="aim">{profile.aim}</p>

		<dl class="standing mono">
			<dt>currently</dt>
			<dd>{profile.currently}</dd>
			<dt>based in</dt>
			<dd>{profile.location}</dd>
			<dt>reachable</dt>
			<dd>
				<a href="mailto:{profile.email}">{profile.email}</a>
				<span class="sep" aria-hidden="true">·</span>
				<a href={profile.github} rel="noopener">github.com/{profile.handle}</a>
			</dd>
		</dl>
	</section>

	<section class="shell section" id="catalogue">
		<h2 class="eyebrow mono">
			<span>Built</span>
			<span>{data.projects.length} of 66 public repositories</span>
		</h2>
		{#each data.projects as project, index (project.repo)}
			<ProjectEntry {project} {index} />
		{/each}
	</section>

	<section class="shell section" id="upstream">
		<h2 class="eyebrow mono">
			<span>Upstream</span>
			<span>Sent to projects other people maintain</span>
		</h2>
		{#each contributions as contribution, index (contribution.url)}
			<article class="contribution" use:reveal={index * 70}>
				<div class="rail mono">
					<span class="state" data-state={contribution.state}>{contribution.state}</span>
				</div>
				<div>
					<h3 class="contribution-title">
						<a href={contribution.url} rel="noopener"
							>{contribution.project}
							<span class="ref mono">{contribution.reference}</span></a
						>
					</h3>
					<p class="summary">{contribution.summary}</p>
				</div>
			</article>
		{/each}
	</section>

	<section class="shell section" id="capabilities">
		<h2 class="eyebrow mono">
			<span>Capable of</span>
			<span>Hands on, not certificates</span>
		</h2>
		<div class="skills">
			{#each skillGroups as group, index (group.heading)}
				<div class="skill-group" use:reveal={index * 70}>
					<h3 class="skill-heading">{group.heading}</h3>
					<p class="skill-note">{group.note}</p>
					<ul class="skill-list mono">
						{#each group.skills as skill (skill)}
							<li>{skill}</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</section>

	<section class="shell section" id="schooling">
		<h2 class="eyebrow mono">
			<span>Schooling</span>
			<span>Rakvere</span>
		</h2>
		{#each education as entry, index (entry.title)}
			<article class="entry" use:reveal={index * 70}>
				<div class="rail mono"><span class="period">{entry.period}</span></div>
				<div>
					<h3 class="school-title">{entry.title}</h3>
					<p class="school-place mono">{entry.place}</p>
					<p class="summary">{entry.detail}</p>
				</div>
			</article>
		{/each}

		<div class="entry" use:reveal>
			<div class="rail mono"><span class="period">Languages</span></div>
			<dl class="standing mono no-rule">
				{#each languages as language (language.name)}
					<dt>{language.name.toLowerCase()}</dt>
					<dd>{language.level}</dd>
				{/each}
			</dl>
		</div>
	</section>

	<footer class="shell section colophon">
		<h2 class="eyebrow mono">
			<span>Colophon</span>
			<span>Built {built}</span>
		</h2>
		<p class="colophon-text">
			Written in SvelteKit and prerendered to plain files, deployed to GitHub Pages by Actions. Type
			is Fraunces, Archivo, and Spline Sans Mono; the ground is limestone and the accent is oxidised
			copper. Every language, star count, and date in the catalogue is pulled from the GitHub API
			while the site builds, so the page is only ever as stale as the last deploy.
		</p>
		<p class="colophon-text">
			<a href={profile.github} rel="noopener">github.com/{profile.handle}</a>
			<span class="sep" aria-hidden="true">·</span>
			<a href="mailto:{profile.email}">{profile.email}</a>
		</p>
	</footer>
</main>

<style>
	.topbar {
		position: sticky;
		top: 0;
		z-index: 5;
		background: color-mix(in srgb, var(--paper) 88%, transparent);
		backdrop-filter: blur(8px);
		border-bottom: 1px solid var(--rule);
	}

	.topbar-inner {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		padding-block: 0.75rem;
	}

	.wordmark {
		font-family: var(--display);
		font-variation-settings:
			'SOFT' 0,
			'WONK' 1,
			'opsz' 40;
		font-size: 1.15rem;
		letter-spacing: -0.01em;
		margin-right: auto;
	}

	.topbar nav {
		display: none;
		gap: 1.4rem;
	}

	.topbar nav a {
		color: var(--ink-muted);
		text-decoration: none;
	}

	.topbar nav a:hover {
		color: var(--ink);
	}

	.hero {
		padding-block: clamp(4rem, 14vh, 9rem) clamp(3rem, 8vh, 5rem);
	}

	.name {
		font-size: var(--step-3);
		font-variation-settings:
			'SOFT' 0,
			'WONK' 1,
			'opsz' 144;
		max-width: 14ch;
	}

	.thesis {
		font-size: var(--step-1);
		max-width: 32ch;
		margin-top: clamp(1.5rem, 4vw, 2.4rem);
		line-height: 1.35;
	}

	.aim {
		font-size: var(--step-1);
		max-width: 32ch;
		line-height: 1.35;
		color: var(--ink-muted);
		margin-top: 0.55rem;
	}

	.standing {
		display: grid;
		grid-template-columns: 6.5rem minmax(0, 1fr);
		gap: 0.45rem 1rem;
		margin: clamp(2.4rem, 6vw, 3.6rem) 0 0;
		padding-top: 1.4rem;
		border-top: 1px solid var(--rule);
		color: var(--ink-muted);
	}

	.standing.no-rule {
		border-top: none;
		padding-top: 0;
		margin: 0;
	}

	.standing dt {
		text-transform: uppercase;
		letter-spacing: 0.14em;
		font-size: 0.86em;
		padding-top: 0.12em;
	}

	.standing dd {
		margin: 0;
		color: var(--ink);
	}

	.section {
		padding-block: clamp(2.5rem, 7vw, 4.5rem);
	}

	/* Shared with ProjectEntry's geometry so every rail on the page lines up. */
	.entry,
	.contribution {
		display: grid;
		grid-template-columns: var(--rail) minmax(0, 1fr);
		gap: 0 clamp(1rem, 3vw, 2.5rem);
		padding: clamp(1.75rem, 4vw, 2.9rem) 0;
		border-bottom: 1px solid var(--rule);
	}

	.rail {
		color: var(--ink-muted);
		padding-top: 0.55rem;
	}

	.period {
		color: var(--ink);
		white-space: nowrap;
	}

	.state {
		text-transform: uppercase;
		letter-spacing: 0.14em;
		font-size: 0.86em;
	}

	.state[data-state='merged'] {
		color: var(--accent);
	}

	.contribution-title,
	.school-title {
		font-size: var(--step-1);
		margin-bottom: 0.35rem;
	}

	.contribution-title a {
		text-decoration: none;
	}

	.contribution-title a:hover {
		color: var(--accent);
	}

	.ref {
		color: var(--ink-muted);
	}

	.school-place {
		color: var(--ink-muted);
		margin-bottom: 0.6rem;
	}

	.summary {
		max-width: 54ch;
	}

	.skills {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
		gap: clamp(2rem, 5vw, 3.5rem);
		padding-top: clamp(1.75rem, 4vw, 2.9rem);
	}

	.skill-heading {
		font-size: var(--step-1);
		margin-bottom: 0.4rem;
	}

	.skill-note {
		color: var(--ink-muted);
		margin-bottom: 1.1rem;
		max-width: 30ch;
	}

	.skill-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.4rem;
	}

	.skill-list li {
		padding-left: 1rem;
		text-indent: -1rem;
	}

	.skill-list li::before {
		content: '·';
		color: var(--accent);
		padding-right: 0.6rem;
	}

	.colophon {
		border-top: 1px solid var(--rule);
		margin-top: clamp(2rem, 6vw, 4rem);
		padding-bottom: clamp(4rem, 10vw, 7rem);
	}

	.colophon-text {
		max-width: 60ch;
		color: var(--ink-muted);
		padding-top: 1.6rem;
	}

	.sep {
		color: var(--rule);
		padding: 0 0.5em;
	}

	@media (min-width: 46rem) {
		.topbar nav {
			display: flex;
		}
	}

	@media (max-width: 42rem) {
		.entry,
		.contribution {
			grid-template-columns: 1fr;
			gap: 0.75rem;
		}

		.rail {
			padding-top: 0;
		}

		.standing {
			grid-template-columns: 1fr;
			gap: 0.15rem;
		}

		.standing dt {
			padding-top: 0.7rem;
		}
	}
</style>
