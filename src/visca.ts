import { Socket } from 'dgram'
import { createSocket } from 'dgram'

export class ViscaConnection {
	private socket: Socket | null = null
	private host: string = ''
	private port: number = 52381
	private sequenceNumber: number = 0
	private connected: boolean = false

	constructor(host: string, port: number = 52381) {
		this.host = host
		this.port = port
	}

	async connect(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			if (this.socket) {
				this.socket.close()
			}

			this.socket = createSocket('udp4')

			// Set up error handling
			this.socket.on('error', (error) => {
				this.connected = false
				reject(error)
			})

			// Test connection with a VISCA inquiry command
			this.testConnection()
				.then(() => {
					this.connected = true
					resolve(true)
				})
				.catch((error) => {
					this.connected = false
					if (this.socket) {
						this.socket.close()
						this.socket = null
					}
					reject(error instanceof Error ? error : new Error(String(error)))
				})
		})
	}

	async testConnection(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (!this.socket) {
				reject(new Error('Socket not initialized'))
				return
			}

			console.log(`[VISCA Debug] Testing connection to ${this.host}:${this.port}`)

			// Send a version inquiry command to test connection
			const command = Buffer.from([0x81, 0x09, 0x00, 0x02, 0xff])
			const header = this.createHeader(0x0110, command.length) // VISCA inquiry type
			const message = Buffer.concat([header, command])

			console.log(`[VISCA Debug] Sending test command:`, message.toString('hex'))

			const timeout = setTimeout(() => {
				console.log(`[VISCA Debug] Connection test timeout after 5 seconds`)
				console.log(`[VISCA Debug] Possible issues:`)
				console.log(`  - Camera IP incorrect: ${this.host}`)
				console.log(`  - VISCA over IP not enabled on camera`)
				console.log(`  - Port ${this.port} blocked by firewall`)
				console.log(`  - Camera requires authentication/setup`)
				console.log(`  - Network routing issues`)
				reject(new Error(`Connection test timeout - no response from camera at ${this.host}:${this.port}`))
			}, 5000) // 5 second timeout

			// Listen for response
			const onMessage = (msg: Buffer, rinfo: any) => {
				console.log(`[VISCA Debug] Received response from ${rinfo.address}:${rinfo.port}:`, msg.toString('hex'))
				clearTimeout(timeout)
				if (this.socket) {
					this.socket.removeListener('message', onMessage)
				}
				resolve()
			}

			// Listen for errors
			const onError = (error: Error) => {
				console.log(`[VISCA Debug] Socket error:`, error.message)
				clearTimeout(timeout)
				if (this.socket) {
					this.socket.removeListener('error', onError)
					this.socket.removeListener('message', onMessage)
				}
				reject(error)
			}

			this.socket.on('message', onMessage)
			this.socket.on('error', onError)

			this.socket.send(message, this.port, this.host, (error) => {
				if (error) {
					console.log(`[VISCA Debug] Send error:`, error.message)
					clearTimeout(timeout)
					reject(error)
				} else {
					console.log(`[VISCA Debug] Command sent successfully, waiting for response...`)
				}
			})
		})
	}

	disconnect(): void {
		if (this.socket) {
			this.socket.close()
			this.socket = null
		}
		this.connected = false
	}

	isConnected(): boolean {
		return this.connected
	}

	private createHeader(type: number, length: number): Buffer {
		const header = Buffer.alloc(8)
		header.writeUInt16BE(type, 0) // Payload type
		header.writeUInt16BE(length, 2) // Payload length
		header.writeUInt32BE(++this.sequenceNumber, 4) // Sequence number
		return header
	}

	private async sendCommand(command: Buffer): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			if (!this.socket) {
				reject(new Error('Not connected'))
				return
			}

			const header = this.createHeader(0x0100, command.length) // VISCA command type
			const message = Buffer.concat([header, command])

			this.socket.send(message, this.port, this.host, (error) => {
				if (error) {
					reject(error)
					return
				}
				resolve(Buffer.alloc(0)) // For fire-and-forget commands
			})
		})
	}

	// Power commands
	async powerOn(): Promise<void> {
		const command = Buffer.from([0x81, 0x01, 0x04, 0x00, 0x02, 0xff])
		await this.sendCommand(command)
	}

	async powerOff(): Promise<void> {
		const command = Buffer.from([0x81, 0x01, 0x04, 0x00, 0x03, 0xff])
		await this.sendCommand(command)
	}

	// Pan/Tilt commands
	async panTiltStop(): Promise<void> {
		const command = Buffer.from([0x81, 0x01, 0x06, 0x01, 0x18, 0x18, 0x03, 0x03, 0xff])
		await this.sendCommand(command)
	}

	async panTiltMove(panSpeed: number, tiltSpeed: number, panDir: number, tiltDir: number): Promise<void> {
		const command = Buffer.from([
			0x81,
			0x01,
			0x06,
			0x01,
			panSpeed & 0x1f,
			tiltSpeed & 0x1f,
			panDir & 0x03,
			tiltDir & 0x03,
			0xff,
		])
		await this.sendCommand(command)
	}

	async panTiltAbsolute(pan: number, tilt: number, panSpeed: number = 12, tiltSpeed: number = 12): Promise<void> {
		const panBytes = [(pan >> 12) & 0x0f, (pan >> 8) & 0x0f, (pan >> 4) & 0x0f, pan & 0x0f]
		const tiltBytes = [(tilt >> 12) & 0x0f, (tilt >> 8) & 0x0f, (tilt >> 4) & 0x0f, tilt & 0x0f]

		const command = Buffer.from([
			0x81,
			0x01,
			0x06,
			0x02,
			panSpeed & 0x1f,
			tiltSpeed & 0x1f,
			...panBytes,
			...tiltBytes,
			0xff,
		])
		await this.sendCommand(command)
	}

	async panTiltHome(): Promise<void> {
		const command = Buffer.from([0x81, 0x01, 0x06, 0x04, 0xff])
		await this.sendCommand(command)
	}

	// Zoom commands
	async zoomStop(): Promise<void> {
		const command = Buffer.from([0x81, 0x01, 0x04, 0x07, 0x00, 0xff])
		await this.sendCommand(command)
	}

	async zoomTele(speed: number = 3): Promise<void> {
		const command = Buffer.from([0x81, 0x01, 0x04, 0x07, 0x20 | (speed & 0x07), 0xff])
		await this.sendCommand(command)
	}

	async zoomWide(speed: number = 3): Promise<void> {
		const command = Buffer.from([0x81, 0x01, 0x04, 0x07, 0x30 | (speed & 0x07), 0xff])
		await this.sendCommand(command)
	}

	async zoomAbsolute(position: number): Promise<void> {
		const posBytes = [(position >> 12) & 0x0f, (position >> 8) & 0x0f, (position >> 4) & 0x0f, position & 0x0f]

		const command = Buffer.from([0x81, 0x01, 0x04, 0x47, ...posBytes, 0xff])
		await this.sendCommand(command)
	}

	// Focus commands
	async focusStop(): Promise<void> {
		const command = Buffer.from([0x81, 0x01, 0x04, 0x08, 0x00, 0xff])
		await this.sendCommand(command)
	}

	async focusNear(speed: number = 3): Promise<void> {
		const command = Buffer.from([0x81, 0x01, 0x04, 0x08, 0x30 | (speed & 0x07), 0xff])
		await this.sendCommand(command)
	}

	async focusFar(speed: number = 3): Promise<void> {
		const command = Buffer.from([0x81, 0x01, 0x04, 0x08, 0x20 | (speed & 0x07), 0xff])
		await this.sendCommand(command)
	}

	async focusAuto(): Promise<void> {
		const command = Buffer.from([0x81, 0x01, 0x04, 0x38, 0x02, 0xff])
		await this.sendCommand(command)
	}

	async focusManual(): Promise<void> {
		const command = Buffer.from([0x81, 0x01, 0x04, 0x38, 0x03, 0xff])
		await this.sendCommand(command)
	}

	async focusOnePush(): Promise<void> {
		const command = Buffer.from([0x81, 0x01, 0x04, 0x18, 0x01, 0xff])
		await this.sendCommand(command)
	}

	// Preset commands
	async presetSet(presetNumber: number): Promise<void> {
		const command = Buffer.from([0x81, 0x01, 0x04, 0x3f, 0x01, presetNumber & 0x7f, 0xff])
		await this.sendCommand(command)
	}

	async presetRecall(presetNumber: number): Promise<void> {
		const command = Buffer.from([0x81, 0x01, 0x04, 0x3f, 0x02, presetNumber & 0x7f, 0xff])
		await this.sendCommand(command)
	}

	async presetClear(presetNumber: number): Promise<void> {
		const command = Buffer.from([0x81, 0x01, 0x04, 0x3f, 0x00, presetNumber & 0x7f, 0xff])
		await this.sendCommand(command)
	}

	// White Balance commands
	async whiteBalanceAuto(): Promise<void> {
		const command = Buffer.from([0x81, 0x01, 0x04, 0x35, 0x00, 0xff])
		await this.sendCommand(command)
	}

	async whiteBalanceIndoor(): Promise<void> {
		const command = Buffer.from([0x81, 0x01, 0x04, 0x35, 0x01, 0xff])
		await this.sendCommand(command)
	}

	async whiteBalanceOutdoor(): Promise<void> {
		const command = Buffer.from([0x81, 0x01, 0x04, 0x35, 0x02, 0xff])
		await this.sendCommand(command)
	}

	async whiteBalanceOnePush(): Promise<void> {
		const command = Buffer.from([0x81, 0x01, 0x04, 0x35, 0x05, 0xff])
		await this.sendCommand(command)
	}

	async whiteBalanceOnePushTrigger(): Promise<void> {
		const command = Buffer.from([0x81, 0x01, 0x04, 0x10, 0x05, 0xff])
		await this.sendCommand(command)
	}

	// Exposure commands
	async exposureAuto(): Promise<void> {
		const command = Buffer.from([0x81, 0x01, 0x04, 0x39, 0x00, 0xff])
		await this.sendCommand(command)
	}

	async exposureManual(): Promise<void> {
		const command = Buffer.from([0x81, 0x01, 0x04, 0x39, 0x03, 0xff])
		await this.sendCommand(command)
	}

	async exposureShutterPriority(): Promise<void> {
		const command = Buffer.from([0x81, 0x01, 0x04, 0x39, 0x0a, 0xff])
		await this.sendCommand(command)
	}

	async exposureIrisPriority(): Promise<void> {
		const command = Buffer.from([0x81, 0x01, 0x04, 0x39, 0x0b, 0xff])
		await this.sendCommand(command)
	}

	async exposureBright(): Promise<void> {
		const command = Buffer.from([0x81, 0x01, 0x04, 0x39, 0x0d, 0xff])
		await this.sendCommand(command)
	}

	// Recording commands
	async recordStart(): Promise<void> {
		const command = Buffer.from([0x81, 0x01, 0x7e, 0x04, 0x1d, 0x02, 0xff])
		await this.sendCommand(command)
	}

	async recordStop(): Promise<void> {
		const command = Buffer.from([0x81, 0x01, 0x7e, 0x04, 0x1d, 0x03, 0xff])
		await this.sendCommand(command)
	}

	// Connection health check
	async healthCheck(): Promise<boolean> {
		try {
			await this.testConnection()
			return true
		} catch (_error) {
			this.connected = false
			return false
		}
	}

	// Network connectivity test (basic UDP test)
	async testNetworkConnectivity(): Promise<boolean> {
		return new Promise((resolve) => {
			const testSocket = createSocket('udp4')

			const timeout = setTimeout(() => {
				testSocket.close()
				console.log(`[VISCA Debug] Basic network test timeout`)
				resolve(false)
			}, 3000)

			testSocket.on('error', (error) => {
				console.log(`[VISCA Debug] Network test error:`, error.message)
				clearTimeout(timeout)
				testSocket.close()
				resolve(false)
			})

			// Send a simple UDP packet to test network reachability
			const testData = Buffer.from('test')
			testSocket.send(testData, this.port, this.host, (error) => {
				clearTimeout(timeout)
				if (error) {
					console.log(`[VISCA Debug] Network send failed:`, error.message)
					resolve(false)
				} else {
					console.log(`[VISCA Debug] Network send successful`)
					resolve(true)
				}
				testSocket.close()
			})
		})
	}

	// Detailed connection diagnostics
	async diagnoseConnection(): Promise<string[]> {
		const issues: string[] = []

		console.log(`[VISCA Debug] Running connection diagnostics for ${this.host}:${this.port}`)

		// Test basic network connectivity
		const networkOk = await this.testNetworkConnectivity()
		if (!networkOk) {
			issues.push(`Network unreachable: Cannot send UDP packets to ${this.host}:${this.port}`)
		}

		// Check if using standard VISCA port
		if (this.port !== 52381) {
			issues.push(`Non-standard port: Using port ${this.port} instead of standard VISCA port 52381`)
		}

		// Sony SRG-A12 specific checks
		issues.push('Sony SRG-A12 Setup Requirements:')
		issues.push('1. Enable VISCA over IP in camera menu: Network → VISCA over IP → Enable')
		issues.push('2. Check camera IP settings: Network → IPv4 Address')
		issues.push('3. Ensure firewall allows UDP port 52381')
		issues.push('4. Camera may need to be in REMOTE mode')
		issues.push('5. Check for VISCA ID conflicts (should be 1)')

		return issues
	}
}

// VISCA command constants
export const ViscaCommands = {
	// Pan/Tilt directions
	PAN_STOP: 0x03,
	PAN_LEFT: 0x01,
	PAN_RIGHT: 0x02,
	TILT_STOP: 0x03,
	TILT_UP: 0x01,
	TILT_DOWN: 0x02,

	// Zoom directions
	ZOOM_STOP: 0x00,
	ZOOM_TELE: 0x02,
	ZOOM_WIDE: 0x03,

	// Focus directions
	FOCUS_STOP: 0x00,
	FOCUS_FAR: 0x02,
	FOCUS_NEAR: 0x03,
}
