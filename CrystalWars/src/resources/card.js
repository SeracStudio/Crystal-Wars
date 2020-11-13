class Card extends Phaser.GameObjects.Sprite {
    constructor(scene,id){

        var x = 0;
        var y = 0;

        super(scene,x,y,"cards",id);

        this.cardId = id;

        scene.add.existing(this);
    }
}
