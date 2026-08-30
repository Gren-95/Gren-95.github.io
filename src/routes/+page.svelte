<script lang="ts">
	import ProjectEntry from '$lib/components/ProjectEntry.svelte';
	import PostList from '$lib/components/PostList.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { profile } from '$lib/data/profile';
	import { contributions } from '$lib/data/contributions';
	import { work, education, toolkit, languages } from '$lib/data/qualifications';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const built = $derived(
		new Date(data.builtAt).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})
	);

	const sections = [
		{ id: 'work', label: 'Work' },
		{ id: 'education', label: 'Education' },
		{ id: 'projects', label: 'Projects' },
		{ id: 'toolkit', label: 'Toolkit' }
	];
</script>

<svelte:head>
	<title>{profile.name} — {profile.role}, {profile.location}</title>
	<meta name="description" content="{profile.role} at {profile.employer}. {profile.intro}" />
	<meta property="og:title" content="{profile.name} — {profile.role}" />
	<meta property="og:description" content={profile.intro} />
	<meta property="og:type" content="profile" />
</svelte:head>

<header class="topbar">
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
			<p class="badge mono"><span class="dot" aria-hidden="true"></span> Open to work</p>
		{/if}

		<h1 class="name">{profile.name}</h1>

		<p class="role">
			{profile.role} at <a href={profile.employerUrl} rel="noopener">{profile.employer}</a>, based
			in {profile.location}.
		</p>

		<p class="intro">{profile.intro}</p>

		<div class="links">
			<a class="link" href={profile.github} rel="noopener">GitHub</a>
			<a class="link" href={profile.linkedin} rel="noopener">LinkedIn</a>
			<a class="link" href="mailto:{profile.email}">Email</a>
		</div>
	</section>

	<section class="shell section" id="work">
		<div class="section-head">
			<h2>Work</h2>
			<p class="section-note">One employer, two roles.</p>
		</div>
		<PostList posts={work} />
	</section>

	<section class="shell section" id="education">
		<div class="section-head">
			<h2>Education</h2>
			<p class="section-note">Vocational, in Estonia.</p>
		</div>
		<PostList posts={education} />
	</section>

	<section class="shell section" id="projects">
		<div class="section-head">
			<h2>Projects</h2>
			<p class="section-note">
				The six on my GitHub profile. Language, stars and dates come from the GitHub API when the
				site builds.
			</p>
		</div>
		<div class="grid">
			{#each data.projects as project, index (project.repo)}
				<ProjectEntry {project} {index} />
			{/each}
		</div>
	</section>

	<section class="shell section" id="upstream">
		<div class="section-head">
			<h2>Upstream</h2>
			<p class="section-note">Work sent to projects other people maintain.</p>
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

	<section class="shell section" id="toolkit">
		<div class="section-head">
			<h2>Toolkit</h2>
			<p class="section-note">What I have actually put into production or into a homelab.</p>
		</div>
		<div class="tools">
			{#each toolkit as group, index (group.heading)}
				<div class="tool-group" use:reveal={Math.min(index, 3) * 60}>
					<h3 class="tool-heading">{group.heading}</h3>
					<ul class="chips">
						{#each group.tools as tool (tool)}
							<li>{tool}</li>
						{/each}
					</ul>
				</div>
			{/each}

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
		<p>
			SvelteKit, prerendered to static files and deployed to GitHub Pages by Actions. Facts are
			taken from my
			<a href={profile.github} rel="noopener">GitHub profile</a>; the project data is fetched from
			the GitHub API at build time. Last built {built}.
		</p>
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

	.chips li {
		border: 1px solid var(--rule-strong);
		border-radius: 6px;
		padding: 0.2rem 0.65rem;
		font-size: var(--step--1);
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

	@media (max-width: 44rem) {
		.contribution {
			grid-template-columns: 1fr;
		}

		.state {
			padding-top: 0;
		}
	}
</style>
