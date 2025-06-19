import type { ModuleInstance } from './main.js'
import { ViscaCommands } from './visca.js'

export function UpdateActions(self: ModuleInstance): void {
	self.setActionDefinitions({
		// Power controls
		power_on: {
			name: 'Power On',
			options: [],
			callback: async () => {
				if (self.visca?.isConnected()) {
					try {
						await self.visca.powerOn()
						self.log('info', 'Camera powered on')
					} catch (error) {
						self.log('error', `Failed to power on camera: ${error}`)
					}
				}
			},
		},
		power_off: {
			name: 'Power Off',
			options: [],
			callback: async () => {
				if (self.visca?.isConnected()) {
					try {
						await self.visca.powerOff()
						self.log('info', 'Camera powered off')
					} catch (error) {
						self.log('error', `Failed to power off camera: ${error}`)
					}
				}
			},
		},

		// Pan/Tilt controls
		pan_tilt_stop: {
			name: 'Pan/Tilt Stop',
			options: [],
			callback: async () => {
				if (self.visca?.isConnected()) {
					try {
						await self.visca.panTiltStop()
					} catch (error) {
						self.log('error', `Failed to stop pan/tilt: ${error}`)
					}
				}
			},
		},
		pan_left: {
			name: 'Pan Left',
			options: [
				{
					id: 'speed',
					type: 'number',
					label: 'Speed (1-24)',
					default: self.config?.panTiltSpeed || 12,
					min: 1,
					max: 24,
				},
			],
			callback: async (event) => {
				if (self.visca?.isConnected()) {
					try {
						const speed = Number(event.options.speed) || 12
						await self.visca.panTiltMove(speed, speed, ViscaCommands.PAN_LEFT, ViscaCommands.TILT_STOP)
					} catch (error) {
						self.log('error', `Failed to pan left: ${error}`)
					}
				}
			},
		},
		pan_right: {
			name: 'Pan Right',
			options: [
				{
					id: 'speed',
					type: 'number',
					label: 'Speed (1-24)',
					default: self.config?.panTiltSpeed || 12,
					min: 1,
					max: 24,
				},
			],
			callback: async (event) => {
				if (self.visca?.isConnected()) {
					try {
						const speed = Number(event.options.speed) || 12
						await self.visca.panTiltMove(speed, speed, ViscaCommands.PAN_RIGHT, ViscaCommands.TILT_STOP)
					} catch (error) {
						self.log('error', `Failed to pan right: ${error}`)
					}
				}
			},
		},
		tilt_up: {
			name: 'Tilt Up',
			options: [
				{
					id: 'speed',
					type: 'number',
					label: 'Speed (1-24)',
					default: self.config?.panTiltSpeed || 12,
					min: 1,
					max: 24,
				},
			],
			callback: async (event) => {
				if (self.visca?.isConnected()) {
					try {
						const speed = Number(event.options.speed) || 12
						await self.visca.panTiltMove(speed, speed, ViscaCommands.PAN_STOP, ViscaCommands.TILT_UP)
					} catch (error) {
						self.log('error', `Failed to tilt up: ${error}`)
					}
				}
			},
		},
		tilt_down: {
			name: 'Tilt Down',
			options: [
				{
					id: 'speed',
					type: 'number',
					label: 'Speed (1-24)',
					default: self.config?.panTiltSpeed || 12,
					min: 1,
					max: 24,
				},
			],
			callback: async (event) => {
				if (self.visca?.isConnected()) {
					try {
						const speed = Number(event.options.speed) || 12
						await self.visca.panTiltMove(speed, speed, ViscaCommands.PAN_STOP, ViscaCommands.TILT_DOWN)
					} catch (error) {
						self.log('error', `Failed to tilt down: ${error}`)
					}
				}
			},
		},
		pan_tilt_home: {
			name: 'Pan/Tilt Home',
			options: [],
			callback: async () => {
				if (self.visca?.isConnected()) {
					try {
						await self.visca.panTiltHome()
						self.log('info', 'Camera moved to home position')
					} catch (error) {
						self.log('error', `Failed to move to home position: ${error}`)
					}
				}
			},
		},

		// Zoom controls
		zoom_stop: {
			name: 'Zoom Stop',
			options: [],
			callback: async () => {
				if (self.visca?.isConnected()) {
					try {
						await self.visca.zoomStop()
					} catch (error) {
						self.log('error', `Failed to stop zoom: ${error}`)
					}
				}
			},
		},
		zoom_tele: {
			name: 'Zoom Tele (In)',
			options: [
				{
					id: 'speed',
					type: 'number',
					label: 'Speed (1-7)',
					default: self.config?.zoomSpeed || 4,
					min: 1,
					max: 7,
				},
			],
			callback: async (event) => {
				if (self.visca?.isConnected()) {
					try {
						const speed = Number(event.options.speed) || 4
						await self.visca.zoomTele(speed)
					} catch (error) {
						self.log('error', `Failed to zoom tele: ${error}`)
					}
				}
			},
		},
		zoom_wide: {
			name: 'Zoom Wide (Out)',
			options: [
				{
					id: 'speed',
					type: 'number',
					label: 'Speed (1-7)',
					default: self.config?.zoomSpeed || 4,
					min: 1,
					max: 7,
				},
			],
			callback: async (event) => {
				if (self.visca?.isConnected()) {
					try {
						const speed = Number(event.options.speed) || 4
						await self.visca.zoomWide(speed)
					} catch (error) {
						self.log('error', `Failed to zoom wide: ${error}`)
					}
				}
			},
		},

		// Focus controls
		focus_stop: {
			name: 'Focus Stop',
			options: [],
			callback: async () => {
				if (self.visca?.isConnected()) {
					try {
						await self.visca.focusStop()
					} catch (error) {
						self.log('error', `Failed to stop focus: ${error}`)
					}
				}
			},
		},
		focus_near: {
			name: 'Focus Near',
			options: [
				{
					id: 'speed',
					type: 'number',
					label: 'Speed (1-7)',
					default: 3,
					min: 1,
					max: 7,
				},
			],
			callback: async (event) => {
				if (self.visca?.isConnected()) {
					try {
						const speed = Number(event.options.speed) || 3
						await self.visca.focusNear(speed)
					} catch (error) {
						self.log('error', `Failed to focus near: ${error}`)
					}
				}
			},
		},
		focus_far: {
			name: 'Focus Far',
			options: [
				{
					id: 'speed',
					type: 'number',
					label: 'Speed (1-7)',
					default: 3,
					min: 1,
					max: 7,
				},
			],
			callback: async (event) => {
				if (self.visca?.isConnected()) {
					try {
						const speed = Number(event.options.speed) || 3
						await self.visca.focusFar(speed)
					} catch (error) {
						self.log('error', `Failed to focus far: ${error}`)
					}
				}
			},
		},
		focus_auto: {
			name: 'Focus Auto',
			options: [],
			callback: async () => {
				if (self.visca?.isConnected()) {
					try {
						await self.visca.focusAuto()
						self.log('info', 'Focus set to auto')
					} catch (error) {
						self.log('error', `Failed to set focus auto: ${error}`)
					}
				}
			},
		},
		focus_manual: {
			name: 'Focus Manual',
			options: [],
			callback: async () => {
				if (self.visca?.isConnected()) {
					try {
						await self.visca.focusManual()
						self.log('info', 'Focus set to manual')
					} catch (error) {
						self.log('error', `Failed to set focus manual: ${error}`)
					}
				}
			},
		},
		focus_one_push: {
			name: 'One Push Auto Focus',
			options: [],
			callback: async () => {
				if (self.visca?.isConnected()) {
					try {
						await self.visca.focusOnePush()
						self.log('info', 'One push auto focus executed')
					} catch (error) {
						self.log('error', `Failed to execute one push auto focus: ${error}`)
					}
				}
			},
		},

		// Preset controls
		preset_recall: {
			name: 'Recall Preset',
			options: [
				{
					id: 'preset',
					type: 'number',
					label: 'Preset Number',
					default: 1,
					min: 1,
					max: 100,
				},
			],
			callback: async (event) => {
				if (self.visca?.isConnected()) {
					try {
						const preset = Number(event.options.preset) || 1
						await self.visca.presetRecall(preset - 1) // VISCA uses 0-based indexing
						self.log('info', `Recalled preset ${preset}`)
					} catch (error) {
						self.log('error', `Failed to recall preset: ${error}`)
					}
				}
			},
		},
		preset_save: {
			name: 'Save Preset',
			options: [
				{
					id: 'preset',
					type: 'number',
					label: 'Preset Number',
					default: 1,
					min: 1,
					max: 100,
				},
			],
			callback: async (event) => {
				if (self.visca?.isConnected()) {
					try {
						const preset = Number(event.options.preset) || 1
						await self.visca.presetSet(preset - 1) // VISCA uses 0-based indexing
						self.log('info', `Saved preset ${preset}`)
					} catch (error) {
						self.log('error', `Failed to save preset: ${error}`)
					}
				}
			},
		},

		// White Balance controls
		wb_auto: {
			name: 'White Balance Auto',
			options: [],
			callback: async () => {
				if (self.visca?.isConnected()) {
					try {
						await self.visca.whiteBalanceAuto()
						self.log('info', 'White balance set to auto')
					} catch (error) {
						self.log('error', `Failed to set white balance auto: ${error}`)
					}
				}
			},
		},
		wb_indoor: {
			name: 'White Balance Indoor',
			options: [],
			callback: async () => {
				if (self.visca?.isConnected()) {
					try {
						await self.visca.whiteBalanceIndoor()
						self.log('info', 'White balance set to indoor')
					} catch (error) {
						self.log('error', `Failed to set white balance indoor: ${error}`)
					}
				}
			},
		},
		wb_outdoor: {
			name: 'White Balance Outdoor',
			options: [],
			callback: async () => {
				if (self.visca?.isConnected()) {
					try {
						await self.visca.whiteBalanceOutdoor()
						self.log('info', 'White balance set to outdoor')
					} catch (error) {
						self.log('error', `Failed to set white balance outdoor: ${error}`)
					}
				}
			},
		},
		wb_one_push: {
			name: 'White Balance One Push',
			options: [],
			callback: async () => {
				if (self.visca?.isConnected()) {
					try {
						await self.visca.whiteBalanceOnePush()
						self.log('info', 'White balance set to one push')
					} catch (error) {
						self.log('error', `Failed to set white balance one push: ${error}`)
					}
				}
			},
		},

		// Exposure controls
		exposure_auto: {
			name: 'Exposure Auto',
			options: [],
			callback: async () => {
				if (self.visca?.isConnected()) {
					try {
						await self.visca.exposureAuto()
						self.log('info', 'Exposure set to auto')
					} catch (error) {
						self.log('error', `Failed to set exposure auto: ${error}`)
					}
				}
			},
		},
		exposure_manual: {
			name: 'Exposure Manual',
			options: [],
			callback: async () => {
				if (self.visca?.isConnected()) {
					try {
						await self.visca.exposureManual()
						self.log('info', 'Exposure set to manual')
					} catch (error) {
						self.log('error', `Failed to set exposure manual: ${error}`)
					}
				}
			},
		},
		exposure_bright: {
			name: 'Exposure Bright Mode',
			options: [],
			callback: async () => {
				if (self.visca?.isConnected()) {
					try {
						await self.visca.exposureBright()
						self.log('info', 'Exposure set to bright mode')
					} catch (error) {
						self.log('error', `Failed to set exposure bright mode: ${error}`)
					}
				}
			},
		},

		// Diagnostic controls
		connection_test: {
			name: 'Test Connection',
			options: [],
			callback: async () => {
				if (self.visca) {
					try {
						self.log('info', 'Testing camera connection...')
						await self.visca.testConnection()
						self.log('info', 'Connection test successful!')
					} catch (error) {
						self.log('error', `Connection test failed: ${error}`)
						const diagnostics = await self.visca.diagnoseConnection()
						self.log('info', 'Diagnostic information:')
						diagnostics.forEach(issue => {
							self.log('info', `  ${issue}`)
						})
					}
				} else {
					self.log('error', 'No camera connection configured')
				}
			},
		},

		// Recording controls
		record_start: {
			name: 'Start Recording',
			options: [],
			callback: async () => {
				if (self.visca?.isConnected()) {
					try {
						await self.visca.recordStart()
						self.log('info', 'Recording started')
					} catch (error) {
						self.log('error', `Failed to start recording: ${error}`)
					}
				}
			},
		},
		record_stop: {
			name: 'Stop Recording',
			options: [],
			callback: async () => {
				if (self.visca?.isConnected()) {
					try {
						await self.visca.recordStop()
						self.log('info', 'Recording stopped')
					} catch (error) {
						self.log('error', `Failed to stop recording: ${error}`)
					}
				}
			},
		},
	})
}
