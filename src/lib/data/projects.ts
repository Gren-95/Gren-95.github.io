import type { CuratedProject } from '$lib/types/project';

/**
 * The projects, roughly newest activity first. Each summary states the problem, what
 * was built, and what came of it — reviewers skim, so the point goes first.
 *
 * Live language, stars, last-push dates and demo links are merged in at build
 * time by src/routes/+page.server.ts.
 */
export const projects: CuratedProject[] = [
	{
		repo: 'ha-relay-panel',
		period: '2026',
		summary:
			'Running a relay as a thermostat in Home Assistant means hand-writing an automation for every room. This panel puts relays on a board, binds each to a temperature sensor and a set point, and writes the automation itself. If a sensor goes unavailable, the relay switches off.',
		exposes: ['JavaScript', 'Node', 'MariaDB', 'Home Assistant', 'self-hosted'],
		shot: { src: 'shots/ha-relay-panel.webp', width: 1200, height: 675 }
	},
	{
		repo: 'hyprland-dots',
		period: '2025—2026',
		summary:
			'Most Hyprland setups stitch together other people’s widgets, each with its own look and its own bugs. I wrote the whole shell in QML instead — bar, notifications, launcher, on-screen displays — so it behaves as one piece. It is what I run every day.',
		exposes: ['QML', 'Quickshell', 'Hyprland', 'Wayland'],
		shot: { src: 'shots/hyprland-dots.webp', width: 1200, height: 750 }
	},
	{
		repo: 'cc2-commander',
		period: '2026',
		summary:
			'The Elegoo Centauri Carbon 2 has a single MQTT slot, so only one client can talk to it at a time. This service holds that slot and shares it: a web dashboard, Mainsail and Fluidd through a Moonraker-compatible API, Prometheus and Telegram all work at once. It began as a fork of runnane/elegoo-web.',
		exposes: ['TypeScript', 'Bun', 'MQTT', 'Moonraker', 'Prometheus'],
		shot: { src: 'shots/cc2-commander.webp', width: 1200, height: 750 }
	},
	{
		repo: 'tailboard',
		period: '2026',
		summary:
			'A dozen self-hosted services means a dozen bookmarks and no idea which one is down. Tailboard puts them all on one page with their status, so the homelab has a front door instead of a folder of links.',
		exposes: ['self-hosted', 'homelab', 'dashboard'],
		shot: { src: 'shots/tailboard.webp', width: 900, height: 562 }
	},
	{
		repo: 'uptime-kuma-compact-theme',
		period: '2026',
		summary:
			'Uptime Kuma’s status page wastes a wall-mounted screen: wide gaps, uptime numbers overlapping names, ragged heartbeat bars. This is one CSS file for the Custom CSS field that packs monitors into a full-width grid, with status-coloured uptime pills and bottom-aligned bars.',
		exposes: ['CSS', 'Uptime Kuma', 'dark theme'],
		shot: {
			src: 'shots/uptime-kuma-compact-theme.webp',
			width: 1200,
			height: 510,
			alt: 'uptime-kuma-compact-theme applied to a status page with placeholder monitors'
		}
	},
	{
		repo: 'sonic-siphon',
		period: '2025—2026',
		summary:
			'Every YouTube-to-MP3 site is an ad farm that wants your links on its server. This is one Go binary you run yourself: paste a playlist, get the files back, nothing leaves your machine.',
		exposes: ['Go', 'single binary', 'self-hosted'],
		shot: { src: 'shots/sonic-siphon.webp', width: 1200, height: 750 }
	},
	{
		repo: 'spawnpoint',
		period: '2026',
		summary:
			'Friends kept asking me to spin up Minecraft worlds, which meant an SSH session every time. Spawnpoint puts start, stop, backups and the server console in a browser, so they can do it without me.',
		exposes: ['TypeScript', 'self-hosted', 'backups', 'console'],
		shot: { src: 'shots/spawnpoint.webp', width: 900, height: 563 }
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
