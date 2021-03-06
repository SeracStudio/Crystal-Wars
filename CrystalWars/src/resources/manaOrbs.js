class ManaOrbs{
    constructor(scene, targets){
        this.scene = scene;
        this.targets = targets;
        this.manaOrbs = [];
        this.currentOrbs = 0;

        for(let i = 0; i < targets.length; i++){
            this.manaOrbs[i] = this.scene.add.sprite(targets[i][0], targets[i][1], 'manaOrb');
            this.manaOrbs[i].scaleX = 0;
            this.manaOrbs[i].scaleY = 0;
            this.manaOrbs[i].depth = 0;
            this.manaOrbs[i].tweener = new Tweener(this.manaOrbs[i]);
        }
    }

    addMana(mana){
        var beta = this.currentOrbs + mana;
        var delayCount = 0;
        for(let i = this.currentOrbs; i < beta; i++){
            let delay = delayCount * 250;
            delayCount++;
            this.scene.tweens.add({
                targets: this.manaOrbs[i],
                scaleX: 1,
                scaleY: 1,
                duration: 250,
                //delay: delay,
                ease: 'Power2',
            });
            this.currentOrbs++;
        }
    }

    removeMana(mana){
        var alpha = this.currentOrbs - 1;
        var beta = this.currentOrbs + mana - 1;
        var delayCount = 0;
        for(let i = alpha; i > beta; i--){
            let delay = delayCount * 250;
            delayCount++;
            this.scene.tweens.add({
                targets: this.manaOrbs[i],
                scaleX: 0,
                scaleY: 0,
                duration: 250,
                //delay: delay,
                ease: 'Power2',
            });
            this.currentOrbs--;
        }
    }

    changeMana(mana){
        if(mana < 0){
            this.removeMana(mana);
        }else{
            this.addMana(mana);
        }
    }
}
