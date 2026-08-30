/**
 * Drawn from the 2023 portfolio at github.com/Gren-95/MyPortfolio, translated
 * from Estonian and regrouped. The original rated each skill as a percentage;
 * those numbers were self-assessed and are left out on purpose.
 */

export interface SkillGroup {
	heading: string;
	note: string;
	skills: string[];
}

export const skillGroups: SkillGroup[] = [
	{
		heading: 'Networks and hardware',
		note: 'Built and cabled from bare parts, not just configured.',
		skills: [
			'RJ45 termination, CAT 5e through CAT 7',
			'Punchdown to 110 blocks and keystone panels',
			'Cisco switches and routers',
			'Cisco Packet Tracer',
			'Wireless access points',
			'IP cameras',
			'Desktop assembly and laptop teardown',
			'Fault diagnosis'
		]
	},
	{
		heading: 'Systems and servers',
		note: 'Linux first, the other two when the job needs them.',
		skills: [
			'Linux, Windows, macOS',
			'Shell scripting in Bash, Zsh, and Fish',
			'PowerShell',
			'Hyper-V, virt-manager, VirtualBox',
			'Docker and Podman',
			'Self-hosted services behind a reverse proxy',
			'Home Assistant and Zigbee2MQTT'
		]
	},
	{
		heading: 'Languages I write',
		note: 'Ordered by how much of it I have actually shipped.',
		skills: ['Rust', 'TypeScript', 'JavaScript', 'Python', 'Go', 'QML', 'Shell', 'PHP']
	}
];

export interface TimelineEntry {
	period: string;
	title: string;
	place: string;
	detail: string;
}

export const education: TimelineEntry[] = [
	{
		period: '2021—',
		title: 'Vocational secondary education',
		place: 'Rakvere Ametikool',
		detail:
			'Computer networks and hardware. Coursework ran to a working server rack: two Cisco switches, a router, a 110 block, and a keystone panel, cabled and labelled to be used rather than graded.'
	},
	{
		period: '2012—2021',
		title: 'Basic education',
		place: 'Rakvere Põhikool',
		detail: 'Rakvere, Estonia.'
	}
];

export const languages = [
	{ name: 'Estonian', level: 'Native' },
	{ name: 'English', level: 'Fluent — I think in both, in parallel' }
];
