class Carta extends Phaser.GameObjects.Sprite {
    constructor(scene,id){

        var x = 0;
        var y = 0;

        super(scene,x,y,"card");
        

        this.id = id;
        scene.add.existing(this);
    }
}