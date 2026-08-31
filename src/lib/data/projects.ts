import type { CuratedProject } from '$lib/types/project';

/**
 * Six projects, newest activity first. Each summary states the problem, what
 * was built, and what came of it — reviewers skim, so the point goes first.
 *
 * Live language, stars, last-push dates and demo links are merged in at build
 * time by src/routes/+page.server.ts.
 */
export const projects: CuratedProject[] = [
	{
		repo: 'hyprland-dots',
		period: '2025—2026',
		summary:
			'Most Hyprland setups stitch together other people’s widgets, each with its own look and its own bugs. I wrote the whole shell in QML instead — bar, notifications, launcher, on-screen displays — so it behaves as one piece. It is what I run every day.',
		exposes: ['QML', 'Quickshell', 'Hyprland', 'Wayland']
	},
	{
		repo: 'tailboard',
		period: '2026',
		summary:
			'A dozen self-hosted services means a dozen bookmarks and no idea which one is down. Tailboard puts them all on one page with their status, so the homelab has a front door instead of a folder of links.',
		exposes: ['self-hosted', 'homelab', 'dashboard']
	},
	{
		repo: 'sonic-siphon',
		period: '2025—2026',
		summary:
			'Every YouTube-to-MP3 site is an ad farm that wants your links on its server. This is one Go binary you run yourself: paste a playlist, get the files back, nothing leaves your machine.',
		exposes: ['Go', 'single binary', 'self-hosted']
	},
	{
		repo: 'spawnpoint',
		period: '2026',
		summary:
			'Friends kept asking me to spin up Minecraft worlds, which meant an SSH session every time. Spawnpoint puts start, stop, backups and the server console in a browser, so they can do it without me.',
		exposes: ['TypeScript', 'self-hosted', 'backups', 'console']
	},
	{
		repo: 'ha-elering-ee',
		period: '2026',
		summary:
			'Estonian electricity prices swing hour to hour, but Home Assistant could not see them. This pulls Elering’s hourly rates into a sensor, so an automation can hold the dishwasher until the cheap window.',
		exposes: ['Python', 'Home Assistant', 'Elering API']
	},
	{
		repo: 'esc2pipe',
		period: '2023—2024',
		summary:
			'Some keyboard layouts hide the pipe character behind a combination a laptop cannot produce. This binds it to Escape in fish, so a key nobody uses at a prompt types the one you need constantly.',
		exposes: ['fish', 'Fisher', 'shell']
	}
];
