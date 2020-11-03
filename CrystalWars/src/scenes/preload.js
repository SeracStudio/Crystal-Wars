class preload extends Phaser.Scene{
    constructor(){
        super("preload")
    }

    preload(){
        this.load.image('placeHolder', 'assets/PlaceHolder.png');
        this.load.image('board', 'assets/images/board.png');
        this.load.image('card', 'assets/images/card.png');
        this.load.image('play','assets/images/Play.png');
        this.load.image('creditsButton','assets/images/CreditsButton.png')
        this.load.image('credits','assets/images/credits.png')
        this.load.image('menuButton','assets/images/menuButton.png')
        this.load.image('mainMenuBackground','assets/images/mainMenuBackground.png')
    }

    create(){
        this.scene.start('main_menu');
    }
}
