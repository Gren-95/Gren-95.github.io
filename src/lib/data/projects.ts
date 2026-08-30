import type { CuratedProject } from '$lib/types/project';

/**
 * Eight entries chosen from 66 public repositories. Coursework and throwaway
 * samples are deliberately left out; what remains is the work that someone
 * else could pick up and run.
 *
 * Ordered newest first. Live language, stars and last-push data are merged in
 * at build time by src/routes/+page.server.ts.
 */
export const projects: CuratedProject[] = [
	{
		repo: 'ha-relay-panel',
		period: '2026',
		summary:
			'Turns a bare relay and a temperature sensor into a thermostat you can see. Bind one to the other in the browser and Home Assistant does the switching.',
		exposes: ['relay binding', 'thermostat rules', 'history', 'self-hosted']
	},
	{
		repo: 'peaport',
		period: '2026',
		summary:
			'A Podman and Docker dashboard built for more than one person: roles, secrets, an audit trail, and live container metrics.',
		exposes: ['containers', 'stacks', 'secrets', 'RBAC', 'audit log', 'metrics']
	},
	{
		repo: 'hyprland-dots',
		period: '2025—2026',
		summary:
			'A complete desktop shell for Hyprland, written in QML rather than assembled from other people’s widgets. Bar, notifications, launcher, and on-screen displays are all native.',
		exposes: ['bar', 'notifications', 'launcher', 'OSDs', 'Quickshell']
	},
	{
		repo: 'wren',
		period: '2026',
		summary:
			'A GTK4 file manager that opens instantly and stays out of the way, written to find out how much of a desktop app is really the toolkit.',
		exposes: ['dual pane', 'tabs', 'GTK4', 'libadwaita']
	},
	{
		repo: 'sonic-siphon',
		period: '2025—2026',
		summary:
			'Paste a YouTube playlist, get MP3 files back. One Go binary you host yourself, so nothing passes through anybody else’s server.',
		exposes: ['playlists', 'MP3', 'single binary', 'self-hosted']
	},
	{
		repo: 'spawnpoint',
		period: '2026',
		summary:
			'Start, stop, and back up Minecraft servers from a browser, instead of opening an SSH session every time a friend wants a world spun up.',
		exposes: ['server lifecycle', 'backups', 'console', 'self-hosted']
	},
	{
		repo: 'ha-elering-ee',
		period: '2026',
		summary:
			'Pulls Estonian electricity prices from Elering into Home Assistant, so automations can wait for the cheap hours.',
		exposes: ['hourly prices', 'Elering API', 'HA sensor']
	},
	{
		repo: 'esc2pipe',
		period: '2023—2024',
		summary:
			'Some keyboard layouts have no pipe key at all. These plugins put one back, for Bash, Zsh, and Fish alike.',
		exposes: ['bash', 'zsh', 'fish']
	}
];
