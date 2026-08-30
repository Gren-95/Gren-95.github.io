/**
 * Brand colours for tools Simple Icons does not carry — it has dropped most
 * Microsoft and Oracle marks on trademark grounds. These hexes are the ones
 * already used on the GitHub profile README's badges, so the two stay in step.
 * Tools listed here render a letter mark instead of a logo.
 */
export const brandFallbacks: Record<string, string> = {
	Java: '#ED8B00',
	PowerShell: '#5391FE',
	Playwright: '#2EAD33',
	Windows: '#0078D6',
	'Active Directory': '#0078D4',
	'VS Code': '#0078D7',
	ServiceNow: '#62D84E'
};

/** Where the tool's display name differs from the Simple Icons title. */
export const iconAliases: Record<string, string> = {
	'Cisco networking': 'Cisco',
	Shell: 'GNU Bash',
	macOS: 'Apple'
};
