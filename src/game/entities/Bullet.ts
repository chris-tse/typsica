import { GameObjects } from 'phaser'

export class Bullet extends GameObjects.Container {
	private sprite: GameObjects.Arc
	private readonly BULLET_SPEED = 400
	private readonly BULLET_DAMAGE = 1

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		targetX: number,
		targetY: number,
	) {
		super(scene, x, y)

		// Create bullet sprite
		this.sprite = scene.add.arc(0, 0, 4, 0, 360, false, 0x00ff00)
		this.add(this.sprite)

		// Add to scene and enable physics
		scene.add.existing(this)
		scene.physics.add.existing(this)

		// Calculate velocity towards target
		const angle = Phaser.Math.Angle.Between(x, y, targetX, targetY)
		const vx = Math.cos(angle) * this.BULLET_SPEED
		const vy = Math.sin(angle) * this.BULLET_SPEED

		// Set velocity
		const body = this.body as Phaser.Physics.Arcade.Body
		body.setVelocity(vx, vy)
	}

	getDamage(): number {
		return this.BULLET_DAMAGE
	}

	destroy(fromScene?: boolean): void {
		super.destroy(fromScene)
	}
}
