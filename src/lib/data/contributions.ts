import type { Contribution } from '$lib/types/project';

/** Work sent to projects other people maintain. */
export const contributions: Contribution[] = [
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
		state: 'open',
		summary:
			'The photograph for that same sensor, cut to the documentation’s 512 px transparent-PNG convention.'
	}
];
