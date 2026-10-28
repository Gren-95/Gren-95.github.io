import type { CuratedProject } from '$lib/types/project';

/**
 * The projects, roughly newest activity first. The tagline is the one line a
 * skimming reader sees; the summary states the problem, what was built, and
 * what came of it, and sits behind the card's Read more toggle.
 *
 * Live language, stars, last-push dates and demo links are merged in at build
 * time by src/routes/+page.server.ts.
 */
export const projects: CuratedProject[] = [
	{
		repo: 'ha-relay-panel',
		tagline: 'Turns relays into simple thermostats in Home Assistant.',
		period: '2026',
		summary:
			'Running a relay as a thermostat in Home Assistant means hand-writing an automation for every room. This panel puts relays on a board, binds each to a temperature sensor and a set point, and writes the automation itself. If a sensor goes unavailable, the relay switches off.',
		exposes: ['JavaScript', 'Node', 'MariaDB', 'Home Assistant', 'self-hosted'],
		shot: { src: 'shots/ha-relay-panel.webp', width: 1200, height: 675 }
	},
	{
		repo: 'hyprland-dots',
		tagline: 'My Hyprland desktop shell, written from scratch in QML.',
		period: '2025 - 2026',
		summary:
			"Most Hyprland setups stitch together other people's widgets, each with its own look and its own bugs. I wrote the whole shell in QML instead (bar, notifications, launcher and on-screen displays), so it all looks and behaves the same. It's what I run every day.",
		exposes: ['QML', 'Quickshell', 'Hyprland', 'Wayland'],
		shot: { src: 'shots/hyprland-dots.webp', width: 1200, height: 750 }
	},
	{
		repo: 'peaport',
		tagline: 'A web control panel for Podman and Docker, with users and roles.',
		period: '2026',
		summary:
			'Running containers for other people means sharing SSH or handing out the engine socket, which is root on the host. Peaport puts Podman or Docker behind a web panel with per-user roles: containers, Compose stacks, images, volumes, networks and pods, plus encrypted secrets, an audit log, live metrics and a terminal in the browser.',
		exposes: ['TypeScript', 'Next.js', 'Podman', 'Docker', 'RBAC'],
		shot: {
			src: 'shots/peaport.webp',
			width: 1200,
			height: 750,
			alt: 'Peaport dashboard with container counts, live usage, container states and disk usage'
		}
	},
	{
		repo: 'cc2-commander',
		tagline: "Shares the Elegoo CC2 printer's single MQTT connection with every tool.",
		period: '2026',
		summary:
			'The Elegoo Centauri Carbon 2 has a single MQTT slot, so only one client can talk to it at a time. This service holds that slot and shares it: a web dashboard, Mainsail and Fluidd through a Moonraker-compatible API, Prometheus and Telegram all work at once. It began as a fork of runnane/elegoo-web.',
		exposes: ['TypeScript', 'Bun', 'MQTT', 'Moonraker', 'Prometheus'],
		shot: { src: 'shots/cc2-commander.webp', width: 1200, height: 750 }
	},
	{
		repo: 'wren',
		tagline: 'A GNOME-style file manager, written in Rust on GTK4.',
		period: '2026',
		summary:
			'A file manager written from scratch with GTK4 and libadwaita. Tabs keep their own history, grid and list views show cached thumbnails, copies report progress and ask before overwriting, renames can be undone, and the keyboard shortcuts match Nautilus.',
		exposes: ['Rust', 'GTK4', 'libadwaita', 'GNOME'],
		shot: {
			src: 'shots/wren.webp',
			width: 959,
			height: 577,
			alt: 'Wren main window showing the home directory in grid view'
		}
	},
	{
		repo: 'tailboard',
		tagline: 'One page for all my self-hosted services and their status.',
		period: '2026',
		summary:
			"A dozen self-hosted services means a dozen bookmarks and no idea which one is down. Tailboard puts them all on one page with their status, so I can see what's running and what's down in one place.",
		exposes: ['self-hosted', 'homelab', 'dashboard'],
		shot: { src: 'shots/tailboard.webp', width: 900, height: 562 }
	},
	{
		repo: 'uptime-kuma-compact-theme',
		title: 'uptime-kuma-theme',
		tagline: 'A compact, full-width theme for Uptime Kuma status pages.',
		period: '2026',
		summary:
			"Uptime Kuma's status page wastes a wall-mounted screen: wide gaps, uptime numbers overlapping names, ragged heartbeat bars. This is one CSS file for the Custom CSS field that packs monitors into a full-width grid, with status-coloured uptime pills and bottom-aligned bars.",
		exposes: ['CSS', 'Uptime Kuma', 'dark theme'],
		shot: {
			src: 'shots/uptime-kuma-compact-theme.webp',
			width: 1200,
			height: 510,
			alt: 'uptime-kuma-compact-theme applied to a status page with placeholder monitors'
		}
	},
	{
		repo: 'gcode-viewer',
		tagline: 'A fast 3D viewer for G-code toolpaths on Linux.',
		period: '2026',
		summary:
			'Checking a print before sending it meant opening a whole slicer just to look at the toolpath. Gcode Viewer opens a .gcode file on its own: orbit the model, scrub through layers, colour it by speed, feature or filament, and read off print time and filament use. It installs as the default app for .gcode files, with thumbnails in the file manager.',
		exposes: ['Rust', 'egui', 'wgpu', 'WGSL', 'Linux'],
		shot: {
			src: 'shots/gcode-viewer.webp',
			width: 1200,
			height: 727,
			alt: 'Gcode Viewer showing a multi-colour print coloured by filament, with shadows and collapsible sidebar sections'
		}
	},
	{
		repo: 'spawnpoint',
		tagline: 'Lets friends run their own Minecraft servers from a browser.',
		period: '2026',
		summary:
			'Friends kept asking me to spin up Minecraft worlds, which meant an SSH session every time. Spawnpoint puts start, stop, backups and the server console in a browser, so they can do it without me.',
		exposes: ['TypeScript', 'self-hosted', 'backups', 'console'],
		shot: { src: 'shots/spawnpoint.webp', width: 900, height: 563 }
	},
	{
		repo: 'ha-elering-ee',
		tagline: 'Estonian hourly electricity prices as a Home Assistant sensor.',
		period: '2026',
		summary:
			"Estonian electricity prices swing hour to hour, but Home Assistant couldn't see them. This pulls Elering's hourly rates into a sensor, so an automation can hold the dishwasher until the cheap window.",
		exposes: ['Python', 'Home Assistant', 'Elering API'],
		shot: {
			src: 'shots/ha-elering-ee.webp',
			width: 1200,
			height: 750,
			alt: "Home Assistant dashboard with the current price, today's statistics and an hourly price chart"
		}
	},
	{
		repo: 'estonian-id-decoder',
		tagline: 'Decodes an Estonian personal ID code, in the browser.',
		period: '2026',
		summary:
			'An Estonian ID code holds a birth date, gender and checksum, but reading them by hand is easy to get wrong. This page decodes a code as you type: birth date, age, weekday, gender, serial number and whether the checksum holds. It runs entirely in the browser and sends nothing anywhere.',
		exposes: ['JavaScript', 'no dependencies', 'client-side'],
		shot: {
			src: 'shots/estonian-id-decoder.webp',
			width: 1200,
			height: 750,
			alt: 'The decoder showing a valid code: male, born 3 May 1976, aged 50, born on a Monday'
		}
	},
	{
		repo: 'esc2pipe',
		tagline: 'A fish plugin that makes Escape type a pipe.',
		period: '2023 - 2024',
		summary:
			"Some keyboard layouts hide the pipe character behind a key combination a laptop can't produce. This plugin for fish makes Escape type a pipe instead.",
		exposes: ['fish', 'Fisher', 'shell'],
		shot: {
			src: 'shots/esc2pipe.webp',
			width: 1200,
			height: 750,
			alt: 'A fish session where every pipe in the commands was typed by pressing Escape'
		}
	}
];
