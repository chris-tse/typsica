import { Scene } from 'phaser'

export class Boot extends Scene {
	constructor() {
		super('Boot')
	}

	preload() {
		//  The Boot Scene is typically used to load in any assets you require for your Preloader
		this.registry.set('theme', 'dark')
		this.load.font(
			'GameFont',
			'https://fonts.googleapis.com/css2?family=Golos+Text',
		)
	}

	create() {
		this.scene.start('Preloader')
	}
}
