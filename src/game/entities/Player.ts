import { GameObjects } from 'phaser'

const PLAYER_RADIUS = 40

export class Player extends GameObjects.Container {
	private sprite: GameObjects.Sprite | GameObjects.Arc
	shields: number = 0

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y)

		// Create a default circular sprite (can be replaced with any sprite later)
		this.sprite = scene.add
			.arc(0, 0, PLAYER_RADIUS, 0, 360, false, 0xffffff)
			.setStrokeStyle(5, 0xffffff)
			.setFillStyle()

		// Add the sprite to this container
		this.add(this.sprite)

		scene.add.existing(this)
		scene.physics.add.existing(this)

		// Set up physics body
		const body = this.body as Phaser.Physics.Arcade.Body

		// Set the physics body size to match the circle
		body
			.setCircle(PLAYER_RADIUS) // radius = 20
			.setOffset(-PLAYER_RADIUS, -PLAYER_RADIUS) // Offset by -radius to center
			.setCollideWorldBounds(true)
			.setImmovable(true)
	}

	// Method to change the player's visual representation
	// setSprite(sprite: GameObjects.Sprite | GameObjects.Arc): this {
	// 	// Remove existing sprite
	// 	this.sprite.destroy()

	// 	// Add new sprite
	// 	this.sprite = sprite
	// 	this.add(sprite)

	// 	return this
	// }
}
