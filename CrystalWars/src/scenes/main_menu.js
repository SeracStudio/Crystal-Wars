class main_menu extends Phaser.Scene {
    constructor() {
        super("main_menu")
    }

    create() {
        if (!isMusicPlaying) {
            isMusicPlaying = true;
            this.menuMusic = this.sound.add('menuMusic');
            this.menuMusic.play();
            this.menuMusic.volume = 0.15;
            this.menuMusic.loop = true;
        }

        var fondo = this.add.image(320, 180, 'mainBackground');
        var logo = this.add.image(320, 60, 'crystalLogo');

        var play = this.add.image(320, 180, 'buttonsAtlas', 'play_1');
        var credits = this.add.image(80, 40, 'credits_1');
        var sound = new SoundController(this, 590, 40);
        var collection = this.add.image(203, 180, 'buttonsAtlas', 'collection_1');
        var help = this.add.image(560, 320, 'help_1');

        play.setInteractive().on('pointerdown', () => mouseClickPlay(this));
        play.on('pointerover', function() {
            play.setTexture('buttonsAtlas', 'play_2');
        });
        play.on('pointerout', function() {
            play.setTexture('buttonsAtlas', 'play_1');
        });

        credits.setInteractive().on('pointerdown', () => mouseClickCredits(this));
        credits.on('pointerover', function() {
            credits.setTexture('credits_2');
        });
        credits.on('pointerout', function() {
            credits.setTexture('credits_1');
        });

        collection.setInteractive().on('pointerdown', () => mouseClickDeck(this));
        collection.on('pointerover', function() {
            collection.setTexture('buttonsAtlas', 'collection_2');
        });
        collection.on('pointerout', function() {
            collection.setTexture('buttonsAtlas', 'collection_1');
        });

        help.setInteractive().on('pointerdown', () => mouseClickTutorial(this));
        help.on('pointerover', function() {
            help.setTexture('help_2');
        });
        help.on('pointerout', function() {
            help.setTexture('help_1');
        });

        if (deckCreated)
            this.deckCreatedFeedback();
    }

    deckCreatedFeedback() {
        new PopUpBox(this, 320, 280, 'popUpBox', 'Mazo creado y guardado.', 1500).launchPopUp();
        deckCreated = false;
    }
}

var deckCreated = false;

function mouseClickPlay(aux) {
    aux.scene.start('lobbyScene');
}

function mouseClickCredits(aux) {
    aux.scene.start('creditsScene');
}

function mouseClickTutorial(aux) {
    aux.scene.start('optionsScene');
}

function mouseClickDeck(aux) {
    aux.scene.start('deckScene');
}
