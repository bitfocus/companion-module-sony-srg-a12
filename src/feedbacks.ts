import { combineRgb } from '@companion-module/base'
import type { ModuleInstance } from './main.js'

export function UpdateFeedbacks(self: ModuleInstance): void {
	self.setFeedbackDefinitions({
		connection_status: {
			name: 'Connection Status',
			type: 'boolean',
			defaultStyle: {
				bgcolor: combineRgb(0, 255, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [],
			callback: () => {
				return self.visca?.isConnected() || false
			},
		},
		recording_status: {
			name: 'Recording Status',
			type: 'boolean',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [],
			callback: () => {
				// This would require implementing VISCA inquiry commands
				// For now, return false as a placeholder
				return false
			},
		},
		power_status: {
			name: 'Power Status',
			type: 'boolean',
			defaultStyle: {
				bgcolor: combineRgb(0, 128, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [],
			callback: () => {
				// This would require implementing VISCA inquiry commands
				// For now, return true if connected
				return self.visca?.isConnected() || false
			},
		},
		focus_mode: {
			name: 'Focus Mode (Auto)',
			type: 'boolean',
			defaultStyle: {
				bgcolor: combineRgb(0, 0, 255),
				color: combineRgb(255, 255, 255),
			},
			options: [],
			callback: () => {
				// This would require implementing VISCA inquiry commands
				// For now, return false as a placeholder
				return false
			},
		},
	})
}
