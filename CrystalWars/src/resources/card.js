class Card extends Phaser.GameObjects.Sprite {
    constructor(scene, id) {

        var x = 0;
        var y = 0;

        super(scene, x, y, "crystalCards", id);

        this.cardId = id;
        this.tweener = new Tweener(this);
        this.isStatic = false;
        this.selected=false;
        this.deckS=false;

        this.isPointerOver = false;
        scene.add.existing(this);

        this.setInteractive();

        this.on('pointerdown', function() {
          if(!deckScene){
            let msg = new Object();

            msg.event = 'SELECT';
            msg.id = this.cardId;

            game.global.socket.send(JSON.stringify(msg));
          }else{
            if(!this.selected){
              this.selected=true
              this.setScale(1.2);
            }else{
              this.selected=false;
              this.setScale(1);
            }
          }

        });
    }

    setPos(newPos) {
        this.x = newPos[0];
        this.y = newPos[1];
    }
}

class Tweener {
    constructor(sprite) {
        this.sprite = sprite;
        this.currentTween;
        this.continuous;
    }

    stopTween() {
        if (this.currentTween != undefined)
            this.sprite.scene.tweens.remove(this.currentTween);
    }

    tweenTo(x, y, duration, continuous, unconditional) {
        if (this.sprite.isStatic) return;

        if (!unconditional) {
            if (this.continuous == true)
                return;
        }

        if (continuous == true)
            this.continuous = true;

        this.stopTween();
        this.currentTween = this.sprite.scene.tweens.add({
            targets: this.sprite,
            x: x,
            y: y,
            duration: duration,
            ease: 'Power2',
            onCompleteScope: this,
            onComplete: function() {
                this.continuous = false;
            }
        });
    }

    tweenChainTo(chain) {
        var timeline = this.sprite.scene.tweens.createTimeline();

        for (let i = 0; i < chain.length; i++) {
            let tween = timeline.add({
                targets: this.sprite,
                x: chain[i][0],
                y: chain[i][1],
                duration: chain[i][2],
                ease: chain[i][3]
            });
        }

        timeline.play();
    }

    tweenScaleTo(scaleX, scaleY, duration) {
        this.stopTween();
        this.currentTween = this.sprite.scene.tweens.add({
            targets: this.sprite,
            scaleX: scaleX,
            scaleY: scaleY,
            duration: duration,
            ease: 'Back',
        });
    }
}
