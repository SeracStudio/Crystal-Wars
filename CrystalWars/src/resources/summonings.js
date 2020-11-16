class Summonings {
    constructor(scene, posX, posY) {
        this.scene = scene;
        this.pos = [
            [posX[0], posY],
            [posX[1], posY]
        ];
        this.inUse = [false, false];
        this.summons = [];
    }

    getFreeSummonPos() {
        for (var i = 0; i < 2; i++) {
            if (this.inUse[i] == false) {
                this.inUse[i] = true;
                return this.pos[i];
            }
        }
    }

    destroy(id) {
        for (let index = 0; index < this.summons.length; index++) {
            if (this.summons[index].cardId == parseInt(id)) {
                this.scene.emitter0.setPosition(this.summons[index].x, this.summons[index].y);
                this.scene.emitter0.explode();
                this.summons[index].destroy();
                this.summons.splice(index, 1);
                this.inUse[index] = false;
                break;
            }
        }
    }
}
