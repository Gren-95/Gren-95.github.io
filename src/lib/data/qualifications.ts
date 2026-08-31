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
		period: 'Feb 2024 — present',
		title: 'Junior Web Developer',
		place: 'JELD-WEN Eesti AS',
		placeUrl: 'https://www.swedoor.ee/',
		logo: { src: 'logos/jeldwen.svg', width: 152, height: 43 },
		detail: 'Building web applications and keeping the IT infrastructure behind them running.'
	},
	{
		period: '2022 — Feb 2024',
		title: 'IT Support Technician',
		place: 'JELD-WEN Eesti AS',
		placeUrl: 'https://www.swedoor.ee/',
		logo: { src: 'logos/jeldwen.svg', width: 152, height: 43 },
		detail: 'Three internships at the same company, which turned into the developer post above.'
	}
];

export const education: Post[] = [
	{
		period: '2026 —',
		title: 'Arukad süsteemid ja rakendusinfotehnoloogia',
		place: 'Tallinna Tehnikaülikool',
		logo: { src: 'logos/taltech.png', width: 171, height: 96 },
		placeUrl: 'https://taltech.ee/',
		detail:
			'Professional higher education in smart systems and applied information technology. Three and a half years at the Kohtla-Järve campus, taught in Estonian. Started August 2026, alongside the job.'
	},
	{
		period: '2024 — 2026',
		title: 'Junior Developer, EQF level 4',
		place: 'Viljandi Kutsehariduskeskus',
		logo: { src: 'logos/vikk.png', width: 349, height: 96 },
		placeUrl: 'https://vikk.ee/',
		detail:
			'AI-driven development, and the programming groundwork that makes it work: object orientation and the basics you need to judge whether generated code is any good. Less about producing code than directing the tools and catching what they get wrong.'
	},
	{
		period: '2021 — 2024',
		title: 'Junior IT Systems Specialist, EQF level 4',
		place: 'Rakvere Ametikool',
		logo: { src: 'logos/rakvere.png', width: 137, height: 96 },
		placeUrl: 'https://rak.ee/',
		detail:
			'Networks and hardware with hands on the kit: CAT 5e through CAT 7 terminated by hand, punched down to 110 blocks and keystone panels, and a rack of Cisco switches and routers cabled to be used afterwards rather than just graded. Also where I learned to coax a configuration page out of an access point too old for a modern browser to render one.'
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
		heading: 'Editors and tooling',
		tools: ['Git', 'VS Code', 'VSCodium', 'Trello']
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

export const aiTools = ['Claude', 'Cursor'];

export const languages = [
	{ name: 'Estonian', level: 'Native' },
	{ name: 'English', level: 'Professional working proficiency' }
];
