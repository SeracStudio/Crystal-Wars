class Card extends Phaser.GameObjects.Sprite {
    constructor(scene,id){

        var x = 0;
        var y = 0;

        super(scene,x,y,"cards",id);

        this.cardId = id;
        this.isStatic = false;

        scene.add.existing(this);
    }

    setPos(newPos){
        this.x = newPos[0];
        this.y = newPos[1];
    }
}
