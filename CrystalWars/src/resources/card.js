const CardType = {
    MANA: 'mana',
    SUMMONING: 'summoning',
    SPELL: 'spell'
}

class Card {
    constructor(type, cost) {
        this.type = type;
        this.cost = cost;
        this.effects = [];
    }

    addEffect(effect) {
        this.effects.push(effect);
    }

    activateEffectsOn(effectOn) {
        this.effects.forEach(effect => {
            if (effect.effectOn === effectOn) {
                effect.activate();
            }
        });
    }
}
