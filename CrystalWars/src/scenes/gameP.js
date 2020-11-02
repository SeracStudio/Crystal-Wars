class gameP extends Phaser.Scene {
    constructor() {
        super("gameP")
    }


    create() {
        var pic = this.add.image(0, 0, 'board');
        Phaser.Display.Align.In.Center(pic, this.add.zone(320,180,640,360));

        this.add.image(100, 100, 'card');
    }
}
