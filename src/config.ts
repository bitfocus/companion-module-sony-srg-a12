import { Regex, type SomeCompanionConfigField } from '@companion-module/base'

export interface ModuleConfig {
	host: string
	port: number
	panTiltSpeed: number
	zoomSpeed: number
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'Camera IP Address',
			width: 8,
			regex: Regex.IP,
		},
		{
			type: 'number',
			id: 'port',
			label: 'VISCA Port',
			width: 4,
			min: 1,
			max: 65535,
			default: 52381,
		},
		{
			type: 'number',
			id: 'panTiltSpeed',
			label: 'Default Pan/Tilt Speed',
			width: 4,
			min: 1,
			max: 24,
			default: 12,
		},
		{
			type: 'number',
			id: 'zoomSpeed',
			label: 'Default Zoom Speed',
			width: 4,
			min: 1,
			max: 7,
			default: 4,
		},
	]
}
