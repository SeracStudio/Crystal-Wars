class optionsScene extends Phaser.Scene {
    constructor() {
        super("optionsScene");
    }

    create() {
        this.tutoIndex = 0;
        this.tutoImages = ['help_tutorial_1', 'help_tutorial_2', 'help_tutorial_3'];
        this.fondo = this.add.image(320, 180, this.tutoImages[0]);
        this.fondo.scale = 1/3;

        var menu = this.add.image(20, 340, 'lobbyButtons', 'delete_1');
        menu.setInteractive().on('pointerdown', () => mouseClickMenu(this));
        menu.on('pointerover', function() {
            menu.setTexture('lobbyButtons', 'delete_2');
        });
        menu.on('pointerout', function() {
            menu.setTexture('lobbyButtons', 'delete_1');
        });
        menu.depth = 2;

        var exitText = this.add.dynamicBitmapText(65, 340, 'dogica', "Salir", 16);
        exitText.setOrigin(0.5, 0.5);
        exitText.depth = 2;

        var arrow = this.add.image(600, 180, 'arrow');
        arrow.setInteractive().on('pointerdown', function() {
            this.tutoIndex++;
            if (this.tutoIndex > 2) {
                this.tutoIndex = 2;
            }
            this.fondo = this.add.image(320, 180, this.tutoImages[this.tutoIndex]);
            this.fondo.scale = 1/3;
        }, this);
        arrow.depth = 2;

        var arrowBack = this.add.image(40, 180, 'arrow');
        arrowBack.scaleX = -1;
        arrowBack.setInteractive().on('pointerdown', function() {
            this.tutoIndex--;
            if (this.tutoIndex < 0) {
                this.tutoIndex = 0;
            }
            this.fondo = this.add.image(320, 180, this.tutoImages[this.tutoIndex]);
            this.fondo.scale = 1/3;
        }, this);
        arrowBack.depth = 2;
    }
}
