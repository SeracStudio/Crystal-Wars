class Summonings {
    constructor(scene, posX, posY, owner) {
        this.scene = scene;
        this.pos = [
            [posX[0], posY],
            [posX[1], posY]
        ];
        this.owner = owner;

        this.sum1 = new Object();
        this.sum1.pos = this.pos[0];
        this.sum1.inUse = false;
        this.sum1.card;

        this.sum2 = new Object();
        this.sum2.pos = this.pos[1];
        this.sum2.inUse = false;
        this.sum2.card;

        this.summons = [this.sum1, this.sum2];
    }

    add(card) {
        for (let i = 0; i < this.summons.length; i++) {
            if (this.summons[i].inUse == false) {
                this.summons[i].inUse = true;
                this.summons[i].card = card;
                return this.summons[i].pos;
            }
        }
    }

    destroySummoning(id) {
        for (let index = 0; index < this.summons.length; index++) {
            let card = this.summons[index];
            if (card.card.cardId == parseInt(id) && card.inUse == true) {
                card.inUse = false;
                this.scene.hideCardDescription();
                card.depth = 2;
                if (this.owner == 'player') {
                    this.scene.graveyard.push(card.card);
                    for (let i = 0; i < this.scene.graveyard.length; i++) {
                        this.scene.graveyard[i].depth = 2;
                        if(i == this.scene.graveyard.length - 1){
                            console.log(this.scene.graveyard[i][0]);
                            this.scene.graveyard[i].depth = 3;
                        }
                    }
                    card.card.tweener.tweenChainTo([
                        [card.pos[0], card.pos[1] - 20, 300, 'Back'],
                        [66, 279, 400, 'Power2']
                    ]);
                } else {
                    this.scene.enemyGraveyard.push(card.card);
                    for (let i = 0; i < this.scene.enemyGraveyard.length; i++) {
                        this.scene.enemyGraveyard[i].depth = 2;
                        if(i == this.scene.enemyGraveyard.length - 1){
                            this.scene.enemyGraveyard[i].depth = 3;
                        }
                    }
                    card.card.tweener.tweenChainTo([
                        [card.pos[0], card.pos[1] - 20, 300, 'Back'],
                        [575, 78, 400, 'Power2']
                    ]);
                }
                break;
            }
        }
    }

    remove(id) {
        for (let i = 0; i < this.summons.length; i++) {
            if (this.summons[i].card.cardId == parseInt(id) && this.summons[i].inUse == true) {
                this.summons[i].inUse = false;
                this.scene.hideCardDescription();
                return this.summons[i].card;
            }
        }
    }

    destroy(id) {
        for (let i = 0; i < this.summons.length; i++) {
            if (this.summons[i].card.cardId == parseInt(id) && this.summons[i].inUse == true) {
                this.summons[i].inUse = false;
                this.scene.hideCardDescription();
                this.summons[i].card.destroy();
                return this.summons[i].pos;
            }
        }
    }
}
