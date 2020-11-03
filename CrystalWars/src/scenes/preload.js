class preload extends Phaser.Scene{
    constructor(){
        super("preload")
    }

    preload(){
        this.load.image('placeHolder', 'assets/PlaceHolder.png');
        this.load.image('board', 'assets/images/board.png');
        this.load.image('card', 'assets/images/card.png');
    }

    create(){
        this.scene.start('mainMenu');
    }
}
