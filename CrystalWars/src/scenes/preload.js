class preload extends Phaser.Scene {
    constructor() {
        super("preload")
    }

    preload() {
        this.load.image('crystalParticle', 'assets/images/crystalParticle.png');
        this.load.image('crystalParticle2', 'assets/images/crystalParticle2.png');
        this.load.image('button_off_1', 'assets/images/button_off_1.png');
        this.load.image('button_off_2', 'assets/images/button_off_2.png');
        this.load.image('button_on_1', 'assets/images/button_on_1.png');
        this.load.image('button_on_2', 'assets/images/button_on_2.png');
        this.load.image('placeHolder', 'assets/PlaceHolder.png');
        this.load.image('manaOrb', 'assets/images/manaOrb.png');
        this.load.image('board', 'assets/images/board2.png');
        this.load.image('card', 'assets/images/card.png');
        this.load.image('play', 'assets/images/Play.png');
        this.load.image('creditsButton', 'assets/images/CreditsButton.png')
        this.load.image('credits', 'assets/images/credits.png')
        this.load.image('menuButton', 'assets/images/menuButton.png')
        this.load.image('mainMenuBackground', 'assets/images/menuBackground.png')
        this.load.image('optionsButton', 'assets/images/OptionsButton.png')
        this.load.image('optionsBackground', 'assets/images/OptionsBackground.png')
        this.load.image('deckButton', 'assets/images/deckButton.png')
        this.load.image('englishButton', 'assets/images/englishButton.png')
        this.load.image('spanishButton', 'assets/images/spanishButton.png')
        this.load.image('waterDeck', 'assets/images/waterDeck.png')
        this.load.image('fireDeck', 'assets/images/fireDeck.png')
        this.load.image('windDeck', 'assets/images/windDeck.png')
        this.load.image('earthDeck', 'assets/images/earthDeck.png')
        this.load.image('confirmDeckButton', 'assets/images/confirmDeckButton.png')
        this.load.spritesheet('cards', 'assets/spritesheets/Cards.png', {
            frameWidth: 56,
            frameHeight: 82
        });
        this.load.json('info', 'assets/JSONinfo/CardsInfo.json');
        this.load.bitmapFont('dogica', 'assets/fonts/dogica.png', 'assets/fonts/dogica.fnt');
        this.load.image('descBox', 'assets/images/desc_box.png');
        this.load.atlas('crystalCards', 'assets/atlas/crystalCards.png', 'assets/atlas/crystalCards.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        this.load.atlas('neutral', 'assets/atlas/desc_box.png', 'assets/atlas/desc_box.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        this.load.atlas('water', 'assets/atlas/desc_box_water.png', 'assets/atlas/desc_box.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        this.load.atlas('fire', 'assets/atlas/desc_box_fire.png', 'assets/atlas/desc_box.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        this.load.atlas('wind', 'assets/atlas/desc_box_wind.png', 'assets/atlas/desc_box.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        this.load.atlas('earth', 'assets/atlas/desc_box_earth.png', 'assets/atlas/desc_box.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

        this.load.image('continue', 'assets/images/continue.png');
        this.load.image('continue_2', 'assets/images/continue_2.png');
        this.load.image('victory', 'assets/images/victory.png');
        this.load.image('defeat', 'assets/images/defeat.png');

        this.load.image('neutralBox', 'assets/atlas/neutral_name_box.png');
        this.load.atlas('nameBoxes', 'assets/atlas/nameBoxes.png', 'assets/atlas/nameBoxes.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        this.load.image('cardsNames', 'assets/images/nombres.png');
        this.load.json('cardNames', 'assets/JSONinfo/CardsName.json');
        this.load.image('confirm_1', 'assets/images/confirmar_1.png');
        this.load.image('confirm_2', 'assets/images/confirmar_2.png');
        this.load.image('credits_1', 'assets/images/credits_1.png');
        this.load.image('credits_2', 'assets/images/credits_2.png');
        this.load.image('help_1', 'assets/images/help_1.png');
        this.load.image('help_2', 'assets/images/help_2.png');

        this.load.atlas('lobbyButtons', 'assets/atlas/lobbyButtons.png', 'assets/atlas/lobbyButtons.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        this.load.image('placeHolderButton', 'assets/images/placeHolderButton.png');
        this.load.image('roomTextBox', 'assets/images/textBoxRoomID.png');
        this.load.image('create_1', 'assets/images/create_game_1.png');
        this.load.image('create_2', 'assets/images/create_game_2.png');
        this.load.image('search_1', 'assets/images/search_game_1.png');
        this.load.image('search_2', 'assets/images/search_game_2.png');

        this.load.image('fullDeck', 'assets/images/fullDeck.png');
        this.load.image('quickButton_1', 'assets/images/quick_mode_button.png');
        this.load.image('quickButton_2', 'assets/images/quick_mode_button_off.png');

        this.load.image('mainBackground', 'assets/images/menuBackground.png');
        this.load.image('collectionBackground', 'assets/images/collectionBackground.png');
        this.load.atlas('buttonsAtlas', 'assets/atlas/buttonsAtlas.png', 'assets/atlas/buttonsAtlas.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

        this.load.image('popUpBox', 'assets/images/popUpBox_Base.png');
        this.load.image('popUpBoxError', 'assets/images/popUpBox_Error.png');
        this.load.image('popUpBoxError2', 'assets/images/popUpBox_Error2.png');

        this.load.image('cursor', 'assets/images/cursor.png');
        this.input.setDefaultCursor('url(assets/images/cursor.png), pointer');

        this.load.audio('menuMusic', 'assets/audio/menuMusic.mp3');
        this.load.audio('gameMusic', 'assets/audio/gameMusic.mp3');
        this.load.audio('cardDraw', 'assets/audio/cardDraw.mp3');
        this.load.audio('manaEffect', 'assets/audio/manaEffect.mp3');
        this.load.audio('errorEffect', 'assets/audio/errorSound.ogg');
        this.load.audio('damageEffect', 'assets/audio/damageSound.wav');
        this.load.audio('healEffect', 'assets/audio/healSound.wav');
        this.load.audio('summonEffect', 'assets/audio/summonEffect.mp3');

        this.load.image('twitterLogo', 'assets/images/twitter.png');
        this.load.image('seracLogo', 'assets/images/seraclogo.png');

        this.load.image('arrow', 'assets/images/arrow.png');
        this.load.image('help_tutorial_1', 'assets/images/tutorial_def_1.png');
        this.load.image('help_tutorial_2', 'assets/images/tutorial_def_2.png');
        this.load.image('help_tutorial_3', 'assets/images/tutorial_def_3.png');

        this.load.image('crystalLogo', 'assets/images/crystalLogo.png');
    }

    create() {
        this.scene.start('main_menu');
    }
}
