/**
 * GitHub's canonical language colours, vendored for the languages that appear
 * in these repositories. Taken from github-linguist by way of ozh/github-colors.
 *
 * These are deliberately not re-stepped to pass a palette validator: the whole
 * point is that JavaScript yellow and Go cyan are recognisable. Because several
 * fail contrast against one surface or the other — JavaScript at 1.32:1 on the
 * light theme, PowerShell at 1.15:1 on the dark — every mark carries a written
 * label and an outline, so colour never has to be read on its own.
 */
export const languageColors: Record<string, string> = {
	CSS: '#663399',
	Go: '#00ADD8',
	HTML: '#e34c26',
	Java: '#b07219',
	JavaScript: '#f1e05a',
	Mermaid: '#ff3670',
	PHP: '#4F5D95',
	PLpgSQL: '#336790',
	PowerShell: '#012456',
	Python: '#3572A5',
	QML: '#44a51c',
	Rust: '#dea584',
	Shell: '#89e051',
	TypeScript: '#3178c6'
};

/** Anything unrecognised gets the page's muted ink rather than an invented hue. */
export const unknownLanguageColor = '#78716c';

export function languageColor(language: string | null | undefined): string {
	if (!language) return unknownLanguageColor;
	return languageColors[language] ?? unknownLanguageColor;
}
