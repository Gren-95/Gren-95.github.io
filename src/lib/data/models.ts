export interface Model {
	title: string;
	tool: string;
	summary: string;
	image: { src: string; width: number; height: number };
	/** A model that can be turned around in the browser, when there is a file for it. */
	glb?: {
		src: string;
		bytes: number;
		/** How far the camera starts, as a share of the size that fits the model. */ distance: string;
	};
}

/**
 * A selection of the coursework models. The rest are the exercises that come before
 * these (a navigation cube, a stool, snowflakes), and showing all of them would bury the
 * ones worth looking at. A model with a `glb` can be turned around in the browser; the
 * others are stills, because their files were never exported.
 */
export const models: Model[] = [
	{
		title: 'Renault FT-17',
		tool: 'Blender',
		summary:
			"The set exercise expected a tool that only runs on Windows, which I don't use. I taught myself Blender over two weekends and modelled the tank there instead, with the hull plating, rivets and full running gear. The 3D view is a lighter copy, with the suspension springs and the rivets left out to keep the download small.",
		image: { src: 'models/tank.webp', width: 900, height: 507 },
		glb: { src: 'models/tank.glb', bytes: 3815688, distance: '78%' }
	},
	{
		title: 'Lego brick 2x4',
		tool: 'Tinkercad',
		summary: 'The first Tinkercad lesson: a 2x4 brick with its eight studs.',
		image: { src: 'models/lego-brick.webp', width: 900, height: 506 },
		glb: { src: 'models/lego-brick.glb', bytes: 101984, distance: '125%' }
	},
	{
		title: 'Single-storey house',
		tool: 'SketchUp',
		summary:
			"Built from a drawing across three lessons. SketchUp's web version stalled once furniture came in from the model store, so I moved to the desktop application to finish it.",
		image: { src: 'models/house.webp', width: 900, height: 506 }
	},
	{
		title: 'Castle',
		tool: 'SketchUp',
		summary: "Gate, curtain walls, a moat and a bowman's tower, worked up from a reference.",
		image: { src: 'models/castle.webp', width: 900, height: 506 }
	}
];
