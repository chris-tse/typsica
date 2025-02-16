import { GameObjects } from 'phaser'

export class Enemy extends GameObjects.Container {
	private sprite: GameObjects.Sprite | GameObjects.Arc

	constructor(scene: Phaser.Scene, x: number, y: number, size: number = 20) {
		super(scene, x, y) // Create a red enemy circle

		// Create a default circular sprite (can be replaced with any sprite later)
		this.sprite = scene.add
			.arc(0, 0, size, 0, 360, false, 0xffff00)

		// Add the sprite to this container
		this.add(this.sprite)

		scene.add.existing(this) // Add the enemy to the scene
		scene.physics.add.existing(this)

		// Set up physics body
		const body = this.body as Phaser.Physics.Arcade.Body

		// Set the physics body size to match the circle
		body
			.setCircle(size) // radius = 20
			.setOffset(-size, -size) // Offset by -radius to center
			.setCollideWorldBounds(true)
	}

	moveTowards(playerX: number, playerY: number, speed: number) {
		// Get the physics body of the enemy
		const body = this.body as Phaser.Physics.Arcade.Body

		// Calculate angle to player
		const angle = Phaser.Math.Angle.Between(this.x, this.y, playerX, playerY)

		// Set velocity using physics
		body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed)
	}
}
