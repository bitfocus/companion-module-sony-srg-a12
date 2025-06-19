import type { ModuleInstance } from './main.js'

export function UpdateVariableDefinitions(self: ModuleInstance): void {
	self.setVariableDefinitions([
		{ variableId: 'connection_status', name: 'Connection Status' },
		{ variableId: 'camera_ip', name: 'Camera IP Address' },
		{ variableId: 'camera_port', name: 'Camera Port' },
		{ variableId: 'power_status', name: 'Power Status' },
		{ variableId: 'recording_status', name: 'Recording Status' },
		{ variableId: 'focus_mode', name: 'Focus Mode' },
		{ variableId: 'white_balance_mode', name: 'White Balance Mode' },
		{ variableId: 'exposure_mode', name: 'Exposure Mode' },
		{ variableId: 'pan_position', name: 'Pan Position' },
		{ variableId: 'tilt_position', name: 'Tilt Position' },
		{ variableId: 'zoom_position', name: 'Zoom Position' },
	])
	
	// Set initial variable values
	self.setVariableValues({
		connection_status: self.visca?.isConnected() ? 'Connected' : 'Disconnected',
		camera_ip: self.config?.host || 'Not configured',
		camera_port: self.config?.port?.toString() || 'Not configured',
		power_status: 'Unknown',
		recording_status: 'Unknown',
		focus_mode: 'Unknown',
		white_balance_mode: 'Unknown',
		exposure_mode: 'Unknown',
		pan_position: 'Unknown',
		tilt_position: 'Unknown',
		zoom_position: 'Unknown',
	})
}
