import type { CuratedProject } from '$lib/types/project';

/**
 * Six projects, newest activity first README, newest activity first.
 * Live language, stars and last-push data are merged in at build time by
 * src/routes/+page.server.ts.
 */
export const projects: CuratedProject[] = [
	{
		repo: 'hyprland-dots',
		period: '2025—2026',
		summary:
			'A complete Hyprland desktop written in QML — bar, notifications, launcher, and on-screen displays are all native, not assembled from other people’s widgets.',
		exposes: ['QML', 'Quickshell', 'Hyprland', 'Wayland']
	},
	{
		repo: 'tailboard',
		period: '2026',
		summary:
			'A self-hosted dashboard for a homelab: every service you run gathered onto one page you would actually leave open.',
		exposes: ['self-hosted', 'homelab', 'dashboard']
	},
	{
		repo: 'sonic-siphon',
		period: '2025—2026',
		summary:
			'Paste a YouTube playlist and get MP3 files back. One Go binary you host yourself, so nothing passes through anybody else’s server.',
		exposes: ['Go', 'single binary', 'self-hosted']
	},
	{
		repo: 'spawnpoint',
		period: '2026',
		summary:
			'Start, stop, and back up Minecraft servers from a browser, instead of opening an SSH session every time a friend wants a world spun up.',
		exposes: ['TypeScript', 'self-hosted', 'backups', 'console']
	},
	{
		repo: 'ha-elering-ee',
		period: '2026',
		summary:
			'Pulls Estonian electricity prices from Elering into Home Assistant, so automations can hold off until the cheap hours.',
		exposes: ['Python', 'Home Assistant', 'Elering API']
	},
	{
		repo: 'esc2pipe',
		period: '2023—2024',
		summary:
			'Some keyboard layouts have no pipe key. These plugins put one on the Escape key instead, for Bash, Zsh, and Fish alike.',
		exposes: ['Bash', 'Zsh', 'Fish']
	}
];
