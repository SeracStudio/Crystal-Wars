//This script specifies the way to define card effects.

//When an effect can take place.
const EffectOn = {
    PLAY: 'play',
    TURN_START: 'turnStart',
    TURN_END: 'turnEnd',
    PLAYER_PLAY: 'playerPlay',
    ENEMY_PLAY: 'enemyPlay'
}

//Target of effect
const Target = {
    PLAYER: 'player',
    ENEMY: 'enemy',
    SELECT: 'select'
}

//Base class for all effects.
class BaseEffect {
    constructor(effectOn, target) {
        this.effectOn = effectOn;
        this.target = target;
    }

    //Implements the specific way an effect takes action in inherited classes.
    activate() {}
}

class Damage extends BaseEffect {
    constructor(effectOn, target, amount) {
        super(effectOn, target);
        this.amount = amount;
    }

    activate() {
        this.target.damage(this.amount);
    }
}

class Heal extends BaseEffect {
    constructor(effectOn, target, amount) {
        super(effectOn, target);
        this.amount = amount;
    }

    activate() {
        this.target.heal(this.amount);
    }
}

class Draw extends BaseEffect {
    constructor(effectOn, target, amount) {
        super(effectOn, target);
        this.amount = amount;
    }

    activate() {
        this.target.hand.draw(this.amount);
    }
}
