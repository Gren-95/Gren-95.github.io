<script lang="ts">
	// A Zigbee mesh: one coordinator, routers around it, end devices at the
	// edges. Coordinates live in a 1600x1000 box that is sliced to the viewport.
	const nodes = [
		{ x: 1180, y: 430, kind: 'coordinator' },
		{ x: 930, y: 250, kind: 'router' },
		{ x: 1400, y: 250, kind: 'router' },
		{ x: 1420, y: 640, kind: 'router' },
		{ x: 1040, y: 760, kind: 'router' },
		{ x: 520, y: 620, kind: 'router' },
		{ x: 700, y: 130, kind: 'end' },
		{ x: 1250, y: 90, kind: 'end' },
		{ x: 1540, y: 420, kind: 'end' },
		{ x: 1560, y: 860, kind: 'end' },
		{ x: 1240, y: 930, kind: 'end' },
		{ x: 820, y: 900, kind: 'end' },
		{ x: 300, y: 780, kind: 'end' },
		{ x: 200, y: 470, kind: 'end' },
		{ x: 380, y: 240, kind: 'end' }
	] as const;

	// [from, to, seconds per trip, delay, reversed]
	const links: [number, number, number, number, boolean][] = [
		[0, 1, 9, 0, false],
		[0, 2, 11, 2, true],
		[0, 3, 10, 5, false],
		[0, 4, 12, 1, true],
		[1, 5, 14, 4, false],
		[4, 5, 13, 7, true],
		[1, 6, 8, 3, true],
		[2, 7, 9, 6, false],
		[2, 8, 10, 1, false],
		[3, 8, 11, 8, true],
		[3, 9, 9, 2, false],
		[4, 10, 8, 5, true],
		[4, 11, 10, 9, false],
		[5, 12, 9, 3, true],
		[5, 13, 11, 6, false],
		[1, 14, 15, 10, true]
	];

	const path = (from: number, to: number) =>
		`M${nodes[from].x} ${nodes[from].y}L${nodes[to].x} ${nodes[to].y}`;
</script>

<svg class="mesh" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
	{#each links as [from, to, seconds, delay, reversed] (`${from}-${to}`)}
		<path class="link" d={path(from, to)} />
		<path
			class="packet"
			class:reversed
			d={path(from, to)}
			pathLength="100"
			style="--trip: {seconds}s; --delay: -{delay}s"
		/>
	{/each}

	{#each nodes as node, i (i)}
		{#if node.kind === 'coordinator'}
			<circle class="ring" cx={node.x} cy={node.y} r="14" />
			<circle class="ring late" cx={node.x} cy={node.y} r="14" />
			<circle class="hub" cx={node.x} cy={node.y} r="9" />
		{:else if node.kind === 'router'}
			<circle class="router" cx={node.x} cy={node.y} r="6" />
		{:else}
			<circle class="end" cx={node.x} cy={node.y} r="3.5" />
		{/if}
	{/each}
</svg>

<style>
	.mesh {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		pointer-events: none;
	}

	/* Strength is set by alpha, and stays this low because the mesh sits behind
	   body text: hairlines and dots cover a sliver of the ground, so muted text
	   keeps its 6.9:1 (light) and 6.9:1 (dark) against a 4.5:1 floor. */
	.link,
	.packet {
		fill: none;
		vector-effect: non-scaling-stroke;
	}

	.link {
		stroke: color-mix(in srgb, var(--accent) var(--mesh-link), transparent);
		stroke-width: 1;
	}

	.packet {
		stroke: color-mix(in srgb, var(--accent) var(--mesh-packet), transparent);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-dasharray: 3 97;
		stroke-dashoffset: 100;
		animation: packet-travel var(--trip) linear var(--delay) infinite;
	}

	.packet.reversed {
		animation-direction: reverse;
	}

	.hub {
		fill: color-mix(in srgb, var(--accent) var(--mesh-node), transparent);
	}

	.router {
		fill: none;
		stroke: color-mix(in srgb, var(--accent) var(--mesh-node), transparent);
		stroke-width: 1.5;
	}

	.end {
		fill: color-mix(in srgb, var(--accent) var(--mesh-link), transparent);
	}

	.ring {
		fill: none;
		stroke: color-mix(in srgb, var(--accent) var(--mesh-node), transparent);
		stroke-width: 1.5;
		transform-box: fill-box;
		transform-origin: center;
		animation: hub-ping 7s ease-out infinite;
	}

	.ring.late {
		animation-delay: -3.5s;
	}

	@keyframes packet-travel {
		to {
			stroke-dashoffset: 0;
		}
	}

	@keyframes hub-ping {
		from {
			transform: scale(1);
			opacity: 1;
		}
		to {
			transform: scale(7);
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.packet,
		.ring {
			animation: none;
		}

		.packet {
			display: none;
		}

		.ring {
			opacity: 0;
		}
	}
</style>
