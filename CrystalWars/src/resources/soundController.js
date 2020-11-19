var isMusicPlaying = false;
var isMusicMuted = false;

class SoundController extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {

        if (!isMusicMuted) {
            super(scene, x, y, 'buttonsAtlas', 'sound_on_1');
        } else {
            super(scene, x, y, 'buttonsAtlas', 'sound_off_1');
        }
        scene.add.existing(this);

        //this.isSoundOn = isMusicPlaying;

        this.setInteractive();
        this.on('pointerover', function() {
            if (!isMusicMuted) {
                this.setTexture('buttonsAtlas', 'sound_on_2');
            } else {
                this.setTexture('buttonsAtlas', 'sound_off_2');
            }
        });
        this.on('pointerout', function() {
            if (!isMusicMuted) {
                this.setTexture('buttonsAtlas', 'sound_on_1');
            } else {
                this.setTexture('buttonsAtlas', 'sound_off_1');
            }
        });
        this.on('pointerdown', function() {
            isMusicMuted = !isMusicMuted;

            if (!isMusicMuted) {
                this.setTexture('buttonsAtlas', 'sound_on_2');
                game.sound.mute = false;
            } else {
                this.setTexture('buttonsAtlas', 'sound_off_2');
                game.sound.mute = true;
            }
        });
    }

}

var drawCount = 0;

class PlaySound {
    constructor(scene, sound, volume) {
        this.sound = scene.sound.add(sound);
        this.sound.volume = volume;
        this.sound.play();
    }
}
