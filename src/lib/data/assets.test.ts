import { describe, expect, it } from 'vitest';
import { projects } from './projects';
import { models } from './models';
import { education, work } from './qualifications';
import { profile } from './profile';

// Vite resolves these at transform time, so the check needs no Node typings.
const staticFiles = Object.keys(import.meta.glob('/static/**/*'));
const seoFiles = import.meta.glob('/static/*.{xml,txt}', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

function assetPaths() {
	const shots = projects.flatMap((project) => (project.shot ? [project.shot.src] : []));
	const modelImages = models.map((model) => model.image.src);
	const logos = [...work, ...education].flatMap((post) => (post.logo ? [post.logo.src] : []));
	return [...new Set([...shots, ...modelImages, ...logos])];
}

describe('static assets referenced from data', () => {
	it('finds the static directory', () => {
		expect(staticFiles.length).toBeGreaterThan(0);
	});

	it.each(assetPaths())('%s exists under static/', (path) => {
		expect(staticFiles).toContain(`/static/${path}`);
	});
});

describe('SEO files', () => {
	it('lists the profile site in the sitemap', () => {
		expect(seoFiles['/static/sitemap.xml']).toContain(`<loc>${profile.site}</loc>`);
	});

	it('points robots.txt at the sitemap on the profile site', () => {
		expect(seoFiles['/static/robots.txt']).toContain(`Sitemap: ${profile.site}sitemap.xml`);
	});
});
