class Summonings {
    constructor(posY) {
        this.pos = [
            [208, posY],
            [432, posY]
        ]   ;
        this.inUse = [false, false];
    }

    getFreeSummonPos() {
        for (var i = 0; i < 2; i++) {
            if (this.inUse[i] == false) {
                this.inUse[i] = true;
                return this.pos[i];
            }
        }
    }
}
