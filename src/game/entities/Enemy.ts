import { GameObjects } from 'phaser'

export class Enemy extends GameObjects.Container {
	private sprite: GameObjects.Sprite | GameObjects.Arc
	private wordText: GameObjects.Text
	private matchedText: GameObjects.Text
	private currentWord: string
	private matchedLetters: number = 0

	private static resetAllEnemiesExcept(scene: Phaser.Scene, excludedEnemy: Enemy) {
		const enemies = scene.children.list.filter(child => 
			child instanceof Enemy && child !== excludedEnemy
		) as Enemy[]
		
		enemies.forEach(enemy => {
			enemy.matchedLetters = 0
			enemy.updateWordDisplay()
		})
	}

	private generateRandomWord(): string {
		const wordList = this.scene.cache.json.get('wordLength4List').words
		const seed = Date.now().toString()
		const rng = new Phaser.Math.RandomDataGenerator([seed])
		return wordList[rng.integerInRange(0, wordList.length - 1)]
	}

	private updateWordDisplay() {
		// Update the base (white) text
		this.wordText.setText(this.currentWord)
		
		// Create an overlay text in green for matched letters
		const matchedPortion = this.currentWord.substring(0, this.matchedLetters)
		this.matchedText.setText(matchedPortion.padEnd(this.currentWord.length, ' '))
	}

	constructor(scene: Phaser.Scene, x: number, y: number, size: number = 16) {
		super(scene, x, y)

		// Create a default circular sprite
		this.sprite = scene.add
			.arc(0, 0, size, 0, 360, false, 0xffff00)

		// Generate the word
		const word = this.generateRandomWord()
		this.currentWord = word

		// Create the base white text
		this.wordText = scene.add.text(0, -size - 35, word, {
			fontSize: '32px',
			color: '#ffffff',
			align: 'center',
			fixedWidth: 200,
			fontFamily: '"Oxygen Mono", monospace'
		}).setOrigin(0.5, 0.5)

		// Create the green overlay text
		this.matchedText = scene.add.text(0, -size - 35, '', {
			fontSize: '32px',
			color: '#00ff00',
			align: 'center',
			fixedWidth: 200,
			fontFamily: '"Oxygen Mono", monospace'
		}).setOrigin(0.5, 0.5)

		// Add all objects to the container
		this.add([this.sprite, this.wordText, this.matchedText])

		scene.add.existing(this)
		scene.physics.add.existing(this)

		// Set up physics body
		const body = this.body as Phaser.Physics.Arcade.Body
		body
			.setCircle(size)
			.setOffset(-size, -size)
			.setCollideWorldBounds(true)
			
		// Initial display
		this.updateWordDisplay()
	}

	checkLetter(letter: string) {
		if (letter === this.currentWord[this.matchedLetters]) {
			this.matchedLetters++
			this.updateWordDisplay()
			
			if (this.matchedLetters === this.currentWord.length) {
				Enemy.resetAllEnemiesExcept(this.scene, this)
				this.destroy()
			}
		} else {
			this.matchedLetters = 0
			this.updateWordDisplay()
		}
	}

	moveTowards(playerX: number, playerY: number, speed: number) {
		const body = this.body as Phaser.Physics.Arcade.Body
		const angle = Phaser.Math.Angle.Between(this.x, this.y, playerX, playerY)
		body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed)
	}
}
