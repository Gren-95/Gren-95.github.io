import type { Contribution } from '$lib/types/project';

/**
 * Work reviewed and merged by maintainers of projects he does not own.
 * Strongest first — the hero links whichever sits at the top.
 */
export const contributions: Contribution[] = [
	{
		project: 'X-Sense for Home Assistant',
		reference: '#275',
		url: 'https://github.com/Jarnsen/ha-xsense-component_test/pull/275',
		state: 'merged',
		summary:
			'Every request to the recordings panel returned HTTP 500. A readiness check was shelling out to ffprobe on Home Assistant’s event loop, once per cached clip — 130 blocking-call errors in three minutes on an install with 85 clips. I traced the call chain, moved the check onto a flag recorded where blocking work is allowed, and the panel returned to HTTP 200 with none.'
	},
	{
		project: 'zigbee-herdsman-converters',
		reference: '#12992',
		url: 'https://github.com/Koenkk/zigbee-herdsman-converters/pull/12992',
		state: 'merged',
		summary:
			'A device definition for the EZVIZ CS-T10C leak sensor. The generated fallback published a raw alarm bitmap; this maps it to a water_leak sensor and drops the alarm bit the ZCL zone type never sets.'
	},
	{
		project: 'zigbee2mqtt.io',
		reference: '#5460',
		url: 'https://github.com/Koenkk/zigbee2mqtt.io/pull/5460',
		state: 'merged',
		summary:
			'The photograph for that same sensor, cut to the documentation’s 512 px transparent-PNG convention.'
	}
];
