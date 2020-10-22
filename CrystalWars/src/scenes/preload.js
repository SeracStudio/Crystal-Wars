class preload extends Phaser.Scene{
    constructor(){
        super("preload")
    }

    preload(){
        this.load.image('placeHolder', 'assets/PlaceHolder.png');
    }

    create(){
        this.scene.start('mainMenu');
    }
}
