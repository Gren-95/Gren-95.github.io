/** Work, schooling, toolkit and spoken languages, from the GitHub profile README. */

export interface Post {
	period: string;
	title: string;
	place: string;
	placeUrl?: string;
	detail: string;
}

export const work: Post[] = [
	{
		period: 'Feb 2024 — present',
		title: 'Junior Web Developer',
		place: 'JELD-WEN Eesti AS',
		placeUrl: 'https://www.jeld-wen.com/',
		detail: 'Building web applications and keeping the IT infrastructure behind them running.'
	},
	{
		period: '2022 — Feb 2024',
		title: 'IT Support Technician',
		place: 'JELD-WEN Eesti AS',
		placeUrl: 'https://www.jeld-wen.com/',
		detail: 'Three internships at the same company, which turned into the developer post above.'
	}
];

export const education: Post[] = [
	{
		period: '2024 — 2026',
		title: 'Junior Developer, EQF level 4',
		place: 'Viljandi Kutsehariduskeskus',
		placeUrl: 'https://vikk.ee/',
		detail: 'Vocational qualification in software development.'
	},
	{
		period: '2021 — 2024',
		title: 'Junior IT Systems Specialist, EQF level 4',
		place: 'Rakvere Ametikool',
		placeUrl: 'https://rak.ee/',
		detail:
			'Networks and hardware, down to terminating the cable: coursework ran to a working rack of Cisco switches, a router, a 110 block and a keystone panel.'
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
		tools: ['Go', 'Python', 'TypeScript', 'JavaScript', 'PHP', 'Java', 'Shell', 'PowerShell']
	},
	{
		heading: 'Web and runtime',
		tools: [
			'React',
			'Node.js',
			'Express',
			'Bun',
			'Vite',
			'Tailwind CSS',
			'jQuery',
			'Playwright',
			'Nginx',
			'Apache'
		]
	},
	{
		heading: 'Data',
		tools: ['MySQL', 'MariaDB', 'SQLite', 'Prisma', 'phpMyAdmin']
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
		heading: 'Infrastructure and automation',
		tools: [
			'Docker',
			'Proxmox',
			'Portainer',
			'Ansible',
			'Terraform',
			'GitHub Actions',
			'TrueNAS',
			'DigitalOcean',
			'Home Assistant',
			'ServiceNow'
		]
	}
];

export const languages = [
	{ name: 'Estonian', level: 'Native' },
	{ name: 'English', level: 'Professional working proficiency' }
];
