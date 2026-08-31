export interface Model {
	title: string;
	tool: string;
	summary: string;
	image: { src: string; width: number; height: number };
}

/**
 * Three of nine coursework models. The rest are the exercises that come before
 * these — a navigation cube, a Lego brick, a stool, snowflakes — and showing
 * all nine would bury the ones worth looking at.
 */
export const models: Model[] = [
	{
		title: 'Renault FT-17',
		tool: 'Blender',
		summary:
			'The set exercise expected a tool that only runs on Windows, which I do not. I taught myself Blender over two weekends and modelled the tank instead — hull plating, riveting and the full running gear.',
		image: { src: 'models/tank.webp', width: 900, height: 507 }
	},
	{
		title: 'Single-storey house',
		tool: 'SketchUp',
		summary:
			'Built from a drawing across three lessons. SketchUp’s web version stalled once furniture came in from the model store, so I moved to the desktop application to finish it.',
		image: { src: 'models/house.webp', width: 900, height: 506 }
	},
	{
		title: 'Castle',
		tool: 'SketchUp',
		summary: 'Gate, curtain walls, a moat and a bowman’s tower, worked up from a reference.',
		image: { src: 'models/castle.webp', width: 900, height: 506 }
	}
];
