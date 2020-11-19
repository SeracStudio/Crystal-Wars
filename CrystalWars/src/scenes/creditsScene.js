class creditsScene extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    create() {
        var fondo = this.add.image(320, 180, 'collectionBackground');
        var menu = this.add.image(320, 320, 'buttonsAtlas', 'back_1');

        this.add.dynamicBitmapText(320, 90, 'dogica', 'SERAC STUDIO', 32).setOrigin(0.5, 0.5);
        this.add.dynamicBitmapText(320, 130, 'dogica', 'Pablo Fernández-Vega Padilla').setOrigin(0.5, 0.5);
        this.add.dynamicBitmapText(320, 150, 'dogica', 'Enrique Corrochano Pardo').setOrigin(0.5, 0.5);
        this.add.dynamicBitmapText(320, 170, 'dogica', 'Darío Muñoz Rostami').setOrigin(0.5, 0.5);
        this.add.dynamicBitmapText(320, 190, 'dogica', 'Dilan Rodríguez Triana').setOrigin(0.5, 0.5);
        this.add.dynamicBitmapText(320, 210, 'dogica', 'Alejandro Vera López').setOrigin(0.5, 0.5);
        this.add.dynamicBitmapText(320, 230, 'dogica', 'Germán Calcedo Perez').setOrigin(0.5, 0.5);

        menu.setInteractive().on('pointerdown', () => mouseClickMenu(this));
        menu.on('pointerover', function() {
            menu.setTexture('buttonsAtlas', 'back_2');
        });
        menu.on('pointerout', function() {
            menu.setTexture('buttonsAtlas', 'back_1');
        });

        this.add.image(200, 300, 'twitterLogo').setInteractive().on('pointerdown', function() {
            window.open('https://twitter.com/StudioSerac', '_blank');
        });

        this.add.image(440, 300, 'seracLogo').setInteractive().on('pointerdown', function() {
            window.open('https://seracstudio.github.io/portfolio/', '_blank');
        });


        new SoundController(this, 590, 40);
    }
}

function mouseClickMenu(aux) {
    aux.scene.start("main_menu");
}
