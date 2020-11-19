class PopUpBox extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, sprite, text, duration, fontSize) {
        super(scene, x, y, sprite);

        scene.add.existing(this);

        this.scene = scene;
        this.x = x;
        this.y = y;
        this.popUpText = scene.add.dynamicBitmapText(x, y, 'dogica', text, fontSize).setOrigin(0.5, 0.5);
        this.duration = duration;

        this.scaleX = 0;
        this.scaleY = 0;
        this.popUpText.scaleX = 0;
        this.popUpText.scaleY = 0;
    }

    launchPopUp() {
        this.open();
        this.close();
    }

    delayLaunchPopUp(delay) {
        setTimeout(() => {
            this.open();
            this.close();
        }, delay)
    }

    open() {
        this.scene.tweens.add({
            targets: [this, this.popUpText],
            scale: 1,
            duration: 300,
            ease: 'Power4'
        });
    }

    closeNow() {
        this.scene.tweens.add({
            targets: [this, this.popUpText],
            scale: 0,
            duration: 300,
            ease: 'Power4'
        });
    }

    close() {
        this.scene.tweens.add({
            targets: [this, this.popUpText],
            scale: 0,
            duration: 300,
            delay: this.duration,
            ease: 'Power4'
        });
    }
}
