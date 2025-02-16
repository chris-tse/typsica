import { GameObjects } from 'phaser'

export class Enemy extends GameObjects.Arc {
	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, 10, 0xff0000) // Create a red enemy circle
		this.setOrigin(0.5)
		scene.add.existing(this) // Add the enemy to the scene
		scene.physics.add.existing(this)
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
