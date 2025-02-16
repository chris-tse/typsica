import { Enemy } from '../entities/Enemy'
import { GameSettings } from '../config/GameSettings'

const SPAWN_DIRECTION = {
	LEFT: 0,
	RIGHT: 1,
	TOP: 2,
	DOWN: 3,
} as const

// EnemySpawner.ts
export class EnemySpawner {
	private scene: Phaser.Scene
	private enemyGroup: Phaser.GameObjects.Group
	private spawnInterval: number
	private lastSpawnTime: number
	private spawnChance: number

	constructor(
		scene: Phaser.Scene,
		enemyGroup: Phaser.GameObjects.Group,
	) {
		this.scene = scene
		this.enemyGroup = enemyGroup
		this.spawnInterval = GameSettings.enemies.spawnInterval
		this.lastSpawnTime = 0
		this.spawnChance = GameSettings.enemies.spawnChance
	}

	update(time: number) {
		if (time - this.lastSpawnTime > this.spawnInterval) {
			this.trySpawn()
			this.lastSpawnTime = time
		}
	}

	private trySpawn() {
		if (Math.random() < this.spawnChance) {
			const spawnPoint = this.getRandomSpawnPoint()
			const enemy = new Enemy(this.scene, spawnPoint.x, spawnPoint.y)
			this.enemyGroup.add(enemy)
		}
	}

	private getRandomSpawnPoint() {
		const direction = Math.floor(Math.random() * 4)
		const camera = this.scene.cameras.main
		const margin = GameSettings.enemies.spawnMargin

		switch (direction) {
			case SPAWN_DIRECTION.LEFT:
				return {
					x: -margin,
					y: Phaser.Math.Between(0, camera.height),
				}
			case SPAWN_DIRECTION.RIGHT:
				return {
					x: camera.width + margin,
					y: Phaser.Math.Between(0, camera.height),
				}
			case SPAWN_DIRECTION.TOP:
				return {
					x: Phaser.Math.Between(0, camera.width),
					y: -margin,
				}
			case SPAWN_DIRECTION.DOWN:
				return {
					x: Phaser.Math.Between(0, camera.width),
					y: camera.height + margin,
				}
			default:
				throw new Error('This should never happen')
		}
	}
}
