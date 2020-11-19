class creditsScene extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    create() {
        var fondo = this.add.image(0, 0, 'credits');
        Phaser.Display.Align.In.Center(fondo, this.add.zone(320, 180, 640, 360));

        var menu = this.add.image(0, 0, 'menuButton');
        menu.setScale(0.04)
        Phaser.Display.Align.In.Center(menu, this.add.zone(320, 320, 640, 360));

        menu.setInteractive().on('pointerover', function() {
            menu.setScale(0.08)
        });
        menu.on('pointerout', function() {
            menu.setScale(0.04)
        });
        menu.on('pointerdown', () => mouseClickMenu(this));

        this.count = 1;
        this.cardsInfo = this.cache.json.get('info');
        this.description = new Object();
    }

    update() {
        var cKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        var fKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        var dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        if (Phaser.Input.Keyboard.JustDown(cKey)) {
            var description = this.cardsInfo[this.count].description;
            this.description.box = this.add.sprite(320, 130, 'descBox');
            this.description.text = this.add.dynamicBitmapText(250, 100, 'dogica', description);
        } else if (Phaser.Input.Keyboard.JustDown(fKey)) {
            this.description.box.destroy();
            this.description.text.destroy();
            this.count++;
        }else if (Phaser.Input.Keyboard.JustDown(dKey)) {
            this.description.box.destroy();
            this.description.text.destroy();
            this.count--;
        }
    }
}

function mouseClickMenu(aux) {
    aux.scene.start("main_menu");
}
