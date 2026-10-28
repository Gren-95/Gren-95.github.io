/** Work, schooling, toolkit and spoken languages, from the GitHub profile README. */

export interface Post {
	period: string;
	title: string;
	place: string;
	placeUrl?: string;
	detail: string;
	/** Institution mark, served from static/logos. Width and height are the
	    file's own pixel size, so the row never shifts while it loads. */
	logo?: { src: string; width: number; height: number };
}

export const work: Post[] = [
	{
		period: 'Apr 2026 - present',
		title: 'Junior Developer and IT Operations Specialist',
		place: 'JELD-WEN Eesti AS',
		placeUrl: 'https://www.swedoor.ee/',
		logo: { src: 'logos/jeldwen.svg', width: 152, height: 43 },
		detail: 'Building web applications and keeping the IT infrastructure behind them running.'
	},
	{
		period: 'Sep 2024 - Mar 2026',
		title: 'Web Developer (internship)',
		place: 'JELD-WEN Eesti AS',
		placeUrl: 'https://www.swedoor.ee/',
		logo: { src: 'logos/jeldwen.svg', width: 152, height: 43 },
		detail:
			'The third internship at the same company and the first on the development side, which turned into the developer post above.'
	},
	{
		period: 'Feb 2023 - Aug 2024',
		title: 'IT Support Technician',
		place: 'JELD-WEN Eesti AS',
		placeUrl: 'https://www.swedoor.ee/',
		logo: { src: 'logos/jeldwen.svg', width: 152, height: 43 },
		detail: 'Two internships at the same company, on the IT support side.'
	}
];

export const education: Post[] = [
	{
		period: '2026 - present',
		title: 'Arukad süsteemid ja rakendusinfotehnoloogia',
		place: 'Tallinna Tehnikaülikool',
		logo: { src: 'logos/taltech.png', width: 171, height: 96 },
		placeUrl: 'https://taltech.ee/',
		detail:
			'Professional higher education in smart systems and applied information technology. Three and a half years at the Kohtla-Järve campus, taught in Estonian. Started August 2026, alongside the job.'
	},
	{
		period: '2024 - 2026',
		title: 'Junior Developer, EQF level 4',
		place: 'Viljandi Kutsehariduskeskus',
		logo: { src: 'logos/vikk.png', width: 349, height: 96 },
		placeUrl: 'https://vikk.ee/',
		detail:
			'AI-driven development, and the programming groundwork that makes it work: object orientation and the basics you need to judge whether generated code is any good. Most of it was about directing the tools and catching their mistakes.'
	},
	{
		period: '2021 - 2024',
		title: 'Junior IT Systems Specialist, EQF level 4',
		place: 'Rakvere Ametikool',
		logo: { src: 'logos/rakvere.png', width: 137, height: 96 },
		placeUrl: 'https://rak.ee/',
		detail:
			'Networks and hardware with hands on the kit: CAT 5e through CAT 7 terminated by hand, punched down to 110 blocks and keystone panels, and a rack of Cisco switches and routers cabled properly enough to keep using after it was graded. Also where I learned to coax a configuration page out of an access point too old for a modern browser to render one.'
	}
];

export interface ToolGroup {
	heading: string;
	tools: string[];
}

/**
 * Condensed from the profile README's badge wall. Grouped so it can be read
 * rather than scanned past.
 */
export const toolkit: ToolGroup[] = [
	{
		heading: 'Languages',
		tools: [
			'Go',
			'Python',
			'TypeScript',
			'JavaScript',
			'Rust',
			'PHP',
			'Java',
			'Shell',
			'PowerShell',
			'QML'
		]
	},
	{
		heading: 'Web and runtime',
		tools: [
			'React',
			'Next.js',
			'Svelte',
			'Node.js',
			'Express',
			'Bun',
			'Gin',
			'Vite',
			'Tailwind CSS',
			'jQuery',
			'Nginx',
			'Caddy',
			'Apache'
		]
	},
	{
		heading: 'Data',
		tools: ['MySQL', 'MariaDB', 'PostgreSQL', 'SQLite', 'Prisma', 'phpMyAdmin']
	},
	{
		heading: 'Testing',
		tools: ['Playwright', 'Vitest', 'Jest', 'pytest']
	},
	{
		heading: 'Systems and networking',
		tools: [
			'Linux',
			'Windows',
			'macOS',
			'Active Directory',
			'WireGuard',
			'Tailscale',
			'Cisco networking'
		]
	},
	{
		heading: 'Editors and tooling',
		tools: ['Git', 'VS Code', 'VSCodium', 'Trello']
	},
	{
		heading: 'Infrastructure and automation',
		tools: [
			'Docker',
			'Podman',
			'Proxmox',
			'Portainer',
			'Ansible',
			'Terraform',
			'GitHub Actions',
			'Prometheus',
			'TrueNAS',
			'DigitalOcean',
			'ServiceNow'
		]
	},
	{
		heading: 'Self-hosted and smart home',
		tools: [
			'Home Assistant',
			'MQTT',
			'Zigbee2MQTT',
			'Node-RED',
			'Uptime Kuma',
			'Gitea',
			'Jellyfin',
			'Immich',
			'AdGuard Home'
		]
	}
];

export const aiTools = ['Claude', 'Cursor'];

export const languages = [
	{ name: 'Estonian', level: 'Native' },
	{ name: 'English', level: 'Professional working proficiency' }
];
