class Crystal {
    constructor(scene, posX, posY) {
        this.scene = scene;
        this.posX = posX;
        this.posY = posY;
        this.crystal;

        this.health = 15;

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

        if (health == this.health) return;

        if (health < this.health) {
            this.scene.scene.get('gameP').playSound('damageEffect', 0.3);
            this.scene.emitter0.setPosition(this.posX + 12, this.posY + 8);
            this.scene.emitter0.explode();
        } else if (this.health != 15) {
            this.scene.scene.get('gameP').playSound('healEffect', 0.3);
            this.scene.emitter1.setPosition(this.posX + 12, this.posY + 20);
            this.scene.emitter1.explode();
        }

        this.health = health;
    }

}
