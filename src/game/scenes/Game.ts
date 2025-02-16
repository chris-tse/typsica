import { EventBus } from '../EventBus'
import { Scene } from 'phaser'
import { Enemy } from '../entities/Enemy' // Import the new Enemy class
import { Player } from '../entities/Player' // Add this import
import { EnemySpawner } from '../systems/EnemySpawner'
import { Bullet } from '../entities/Bullet'

export class Game extends Scene {
	camera: Phaser.Cameras.Scene2D.Camera
	background: Phaser.GameObjects.Image
	gameText: Phaser.GameObjects.Text
	enemySpawner: EnemySpawner
	player: Player
	enemies: Phaser.GameObjects.Group // Set to hold enemy references
	bullets: Phaser.GameObjects.Group
	private typingBuffer: string = ''

	constructor() {
		super('Game')
	}

	create() {
		this.camera = this.cameras.main
		this.camera.setBackgroundColor(0x222222)

		// Create player using the new Player class
		this.player = new Player(
			this,
			this.cameras.main.centerX,
			this.cameras.main.centerY,
		)

		this.enemies = this.add.group({
			classType: Enemy,
		})

		this.bullets = this.add.group({
			classType: Bullet,
		})

		// Add collision between bullets and enemies
		this.physics.add.collider(this.bullets, this.enemies, (bullet, enemy) => {
			const typedBullet = bullet as Bullet
			const typedEnemy = enemy as Enemy
			typedEnemy.takeDamage(typedBullet.getDamage())
			typedBullet.destroy()
		})

		this.physics.add.collider(this.enemies, this.player, (_enemy, player) => {
			const typedPlayer = player as Player

			typedPlayer.shields -= 1

			if (typedPlayer.shields <= 0) {
				this.changeScene()
			}
		})

		this.enemySpawner = new EnemySpawner(this, this.enemies)

		// Add keyboard input handling
		this.input.keyboard!.on('keydown', (event: KeyboardEvent) => {
			// Only handle letter keys
			if (/^[a-zA-Z]$/.test(event.key)) {
				const letter = event.key.toLowerCase()
				this.typingBuffer += letter

				// Check letters against enemies and fire at matching enemy
				this.enemies.children.iterate((enemy) => {
					if (enemy) {
						const typedEnemy = enemy as Enemy
						const matchedEnemy = typedEnemy.checkLetter(letter)
						if (matchedEnemy) {
							this.fireBulletAtEnemy(matchedEnemy)
						}
					}
					return null
				})
			}
		})

		EventBus.emit('current-scene-ready', this)
	}

	private fireBulletAtEnemy(enemy: Enemy) {
		const playerX = this.cameras.main.centerX
		const playerY = this.cameras.main.centerY
		const enemyPos = enemy.getPosition()

		const bullet = new Bullet(this, playerX, playerY, enemyPos.x, enemyPos.y)
		this.bullets.add(bullet)
	}

	update(time: number, _delta: number) {
		this.enemySpawner.update(time)

		// Move enemies towards the player
		const playerX = this.cameras.main.centerX
		const playerY = this.cameras.main.centerY

		this.enemies.children.iterate((enemy) => {
			// Specify the type as Enemy
			const typedEnemy = enemy as Enemy
			typedEnemy.moveTowards(playerX, playerY, 20) // Use the moveTowards method
			return null // Return null to satisfy the type requirement
		})

		// Clean up bullets that are out of bounds
		this.bullets.children.iterate((bullet) => {
			if (bullet) {
				const typedBullet = bullet as Bullet
				const bounds = this.physics.world.bounds
				if (
					typedBullet.x < bounds.x ||
					typedBullet.x > bounds.width ||
					typedBullet.y < bounds.y ||
					typedBullet.y > bounds.height
				) {
					typedBullet.destroy()
				}
			}
			return null
		})
	}

	spawnEnemy() {
		// Randomly decide to spawn an enemy
		if (Math.random() < 0.5) {
			// 50% chance to spawn an enemy
			let x: number = 0 // Initialize x
			let y: number = 0 // Initialize y
			const direction = Math.floor(Math.random() * 4) // Random direction (0-3)

			switch (direction) {
				case 0: // Spawn from the left
					x = -20 // Just off-screen to the left
					y = Phaser.Math.Between(0, this.cameras.main.height)
					break
				case 1: // Spawn from the right
					x = this.cameras.main.width + 20 // Just off-screen to the right
					y = Phaser.Math.Between(0, this.cameras.main.height)
					break
				case 2: // Spawn from the top
					x = Phaser.Math.Between(0, this.cameras.main.width)
					y = -20 // Just off-screen at the top
					break
				case 3: // Spawn from the bottom
					x = Phaser.Math.Between(0, this.cameras.main.width)
					y = this.cameras.main.height + 20 // Just off-screen at the bottom
					break
			}

			const enemy = new Enemy(this, x, y) // Create a new Enemy instance
			this.enemies.add(enemy) // Store the enemy reference
		}
	}

	changeScene() {
		this.scene.start('GameOver')
	}
}
