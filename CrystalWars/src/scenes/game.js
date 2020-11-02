class mainMenu extends Phaser.Scene {
    constructor() {
        super("game")
    }

    create() {
        var pic = this.add.image(0, 0, 'board');
        Phaser.Display.Align.In.Center(pic, this.add.zone(320,180,640,360));
    }
}
