import { Scene } from 'phaser'

// Declare global type for our word list
declare global {
	interface Window {
		WORD_LIST: string[];
	}
}

export class Preloader extends Scene {
	constructor() {
		super('Preloader')
	}

	init() {
		// Create a dark rectangle covering the entire game area
		this.add
			.rectangle(
				0,
				0,
				this.cameras.main.width,
				this.cameras.main.height,
				0x222222,
			)
			.setOrigin(0, 0)

		//  A simple progress bar. This is the outline of the bar.
		this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff)

		//  This is the progress bar itself. It will increase in size from the left based on the % of progress.
		const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff)

		//  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
		this.load.on('progress', (progress: number) => {
			//  Update the progress bar (our bar is 464px wide, so 100% = 464px)
			bar.width = 4 + 460 * progress
		})
	}

	preload() {
		//  Load the assets for the game
		this.load.setPath('assets')

		// Load the word list
		this.load.json('wordLength4List', '4-letter-words.json')
	}

	create() {
		// Store the word list globally
		const wordData = this.cache.json.get('wordLength4List') as { words: string[] };
		window.WORD_LIST = wordData.words;

		//  Move to the MainMenu
		this.scene.start('MainMenu')
	}
}
