class mainMenu extends Phaser.Scene {
    constructor() {
        super("mainMenu")
    }

    create() {
        this.add.image(100, 100, 'placeHolder');
        this.scene.start('game');
    }
}
