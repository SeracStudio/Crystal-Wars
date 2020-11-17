class Crystal {
    constructor(scene, posX, posY) {
        this.scene = scene;
        this.posX = posX;
        this.posY = posY;
        this.crystal;

        this.displayHealth(15);
    }

    displayHealth(health) {
        if (this.crystal != undefined) {
            this.crystal.destroy();
        }

        if (health > 9 || health < 0) {
            this.crystal = this.scene.add.dynamicBitmapText(this.posX, this.posY, 'dogica', health, 16);
        } else {
            this.crystal = this.scene.add.dynamicBitmapText(this.posX + 6, this.posY, 'dogica', health, 16);
        }

        this.crystal.align = 0;
        this.crystal.setTintFill(0x0a7c80, 0x0a7c80, 0x0a7c80, 0x0a7c80);
    }

}
