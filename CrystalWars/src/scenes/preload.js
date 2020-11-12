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
        this.load.image('optionsButton','assets/images/OptionsButton.png')
        this.load.image('optionsBackground','assets/images/OptionsBackground.png')
        this.load.image('deckButton','assets/images/deckButton.png')
        this.load.image('englishButton','assets/images/englishButton.png')
        this.load.image('spanishButton','assets/images/spanishButton.png')
        this.load.image('waterDeck','assets/images/waterDeck.png')
        this.load.image('fireDeck','assets/images/fireDeck.png')
        this.load.image('windDeck','assets/images/windDeck.png')
        this.load.image('earthDeck','assets/images/earthDeck.png')
        this.load.image('neutralDeck','assets/images/neutralDeck.png')
        this.load.spritesheet('cards', 'assets/spritesheets/Cards.png', { frameWidth: 56, frameHeight: 82 });
    }

    create(){
        this.scene.start('main_menu');
    }
}
