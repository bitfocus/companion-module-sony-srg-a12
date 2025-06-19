import { InstanceBase, runEntrypoint, InstanceStatus, SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpdateVariableDefinitions } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { ViscaConnection } from './visca.js'

export class ModuleInstance extends InstanceBase<ModuleConfig> {
	config!: ModuleConfig // Setup in init()
	visca!: ViscaConnection
	connectionCheckInterval?: NodeJS.Timeout

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig): Promise<void> {
		this.config = config

		// Initialize VISCA connection
		await this.initConnection()

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
	}

	async initConnection(): Promise<void> {
		try {
			this.updateStatus(InstanceStatus.Connecting)
			
			if (this.visca) {
				this.visca.disconnect()
			}

			if (!this.config.host) {
				this.updateStatus(InstanceStatus.BadConfig, 'No IP address configured')
				return
			}

			this.visca = new ViscaConnection(this.config.host, this.config.port || 52381)
			
			const connected = await this.visca.connect()
			if (connected) {
				this.updateStatus(InstanceStatus.Ok)
				this.log('info', `Connected to Sony SRG-A12 at ${this.config.host}:${this.config.port}`)
				
				// Start connection monitoring
				this.startConnectionMonitoring()
			} else {
				this.updateStatus(InstanceStatus.ConnectionFailure, 'Failed to connect')
			}
		} catch (error) {
			this.updateStatus(InstanceStatus.ConnectionFailure, `Connection error: ${error}`)
			this.log('error', `Failed to connect to camera: ${error}`)
			
			// Run detailed diagnostics
			if (this.visca) {
				const diagnostics = await this.visca.diagnoseConnection()
				this.log('info', 'Connection diagnostics:')
				diagnostics.forEach(issue => {
					this.log('info', `  ${issue}`)
				})
			}
		}
	}
	// When module gets deleted
	async destroy(): Promise<void> {
		this.log('debug', 'destroy')
		
		if (this.connectionCheckInterval) {
			clearInterval(this.connectionCheckInterval)
		}
		
		if (this.visca) {
			this.visca.disconnect()
		}
	}

	private startConnectionMonitoring(): void {
		// Clear any existing interval
		if (this.connectionCheckInterval) {
			clearInterval(this.connectionCheckInterval)
		}
		
		// Check connection every 30 seconds
		this.connectionCheckInterval = setInterval(async () => {
			if (this.visca) {
				const isHealthy = await this.visca.healthCheck()
				if (!isHealthy) {
					this.updateStatus(InstanceStatus.ConnectionFailure, 'Camera not responding')
					this.log('warn', 'Lost connection to camera')
				}
			}
		}, 30000)
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		const oldConfig = this.config
		this.config = config
		
		// Reconnect if host or port changed
		if (oldConfig.host !== config.host || oldConfig.port !== config.port) {
			await this.initConnection()
		}
	}

	// Return config fields for web config
	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	updateActions(): void {
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
