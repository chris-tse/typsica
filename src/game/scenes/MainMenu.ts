import { GameObjects, Scene } from 'phaser'

import { EventBus } from '../EventBus'

export class MainMenu extends Scene {
	background: GameObjects.Rectangle
	startButton: GameObjects.Text

	constructor() {
		super('MainMenu')
	}

	create() {
		// Set the camera background color to dark gray
		this.cameras.main.setBackgroundColor(0x222222)

		this.startButton = this.add
			.text(
				this.cameras.main.centerX,
				this.cameras.main.centerY,
				'Start Game',
				{
					fontFamily: 'Arial Black',
					fontSize: 48,
					color: '#ffffff',
					stroke: '#000000',
					strokeThickness: 8,
					align: 'center',
				},
			)
			.setOrigin(0.5)
			.setDepth(100)
			.setInteractive({ useHandCursor: true })
			.on('pointerover', () => this.startButton.setScale(1.1))
			.on('pointerout', () => this.startButton.setScale(1))
			.on('pointerdown', () => this.changeScene())

		EventBus.emit('current-scene-ready', this)
	}

	changeScene() {
		this.scene.start('Game')
	}
}
