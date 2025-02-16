import { Enemy } from '../entities/Enemy'

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

	constructor(
		scene: Phaser.Scene,
		enemyGroup: Phaser.GameObjects.Group,
		spawnInterval: number = 1000,
	) {
		this.scene = scene
		this.enemyGroup = enemyGroup
		this.spawnInterval = spawnInterval
		this.lastSpawnTime = 0
	}

	update(time: number) {
		if (time - this.lastSpawnTime > this.spawnInterval) {
			this.trySpawn()
			this.lastSpawnTime = time
		}
	}

	private trySpawn() {
		if (Math.random() < 0.5) {
			const spawnPoint = this.getRandomSpawnPoint()
			const enemy = new Enemy(this.scene, spawnPoint.x, spawnPoint.y)
			this.enemyGroup.add(enemy)
		}
	}

	private getRandomSpawnPoint(_margin: number = 20) {
		const direction = Math.floor(Math.random() * 4)
		const camera = this.scene.cameras.main

		switch (direction) {
			case SPAWN_DIRECTION.LEFT:
				return {
					x: -20,
					y: Phaser.Math.Between(0, camera.height),
				}
			case SPAWN_DIRECTION.RIGHT:
				return {
					x: camera.width + 20,
					y: Phaser.Math.Between(0, camera.height),
				}
			case SPAWN_DIRECTION.TOP:
				return {
					x: Phaser.Math.Between(0, camera.width),
					y: -20,
				}
			case SPAWN_DIRECTION.DOWN:
				return {
					x: Phaser.Math.Between(0, camera.width),
					y: camera.height + 20,
				}
			default:
				throw new Error('This should never happen')
		}
	}
}
