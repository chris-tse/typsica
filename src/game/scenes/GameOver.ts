import { EventBus } from '../EventBus'
import { Scene } from 'phaser'

export class GameOver extends Scene {
	camera: Phaser.Cameras.Scene2D.Camera
	gameOverText: Phaser.GameObjects.Text
	retryButton: Phaser.GameObjects.Text

	constructor() {
		super('GameOver')
	}

	create() {
		this.camera = this.cameras.main
		this.camera.setBackgroundColor(0x222222)

		this.gameOverText = this.add
			.text(
				this.cameras.main.centerX,
				this.cameras.main.centerY,
				'Game Over',
				{
					fontFamily: 'Arial Black',
					fontSize: 64,
					color: '#ffffff',
					stroke: '#000000',
					strokeThickness: 8,
					align: 'center',
				},
			)
			.setOrigin(0.5)
			.setDepth(100)

		this.retryButton = this.add
			.text(
				this.cameras.main.centerX,
				this.cameras.main.centerY + 100,
				'Retry',
				{
					fontFamily: 'Arial Black',
					fontSize: 32,
					color: '#ffffff',
					stroke: '#000000',
					strokeThickness: 4,
					align: 'center',
				},
			)
			.setOrigin(0.5)
			.setDepth(100)
			.setInteractive({ useHandCursor: true })
			.on('pointerover', () => this.retryButton.setScale(1.1))
			.on('pointerout', () => this.retryButton.setScale(1))
			.on('pointerdown', () => this.scene.start('Game'))

		EventBus.emit('current-scene-ready', this)
	}

	changeScene() {
		this.scene.start('MainMenu')
	}
}
