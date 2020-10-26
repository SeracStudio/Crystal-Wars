class Player{
    constructor(health){
        this.MAX_HEALTH = health;
        this.health = health;
        this.mana = 0;

        this.deck = new Deck();
        this.hand =  new Hand(this.deck);

        this.summonings = [];
    }

    damage(points){
        this.health -= points;
    }

    heal(points){
        this.health += points;
        if(this.health > this.MAX_HEALTH){
            this.health = this.MAX_HEALTH;
        }
    }

    addMana(points){
        this.mana += points;
    }

    removeMana(points){
        this.mana -= points;
    }
}

class Deck{
    constructor(){
        this.cards = [];
    }

    shuffle(){
        for(let i = this.cards.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    draw(nCards){
        let drawnCards = [];
        for(let i = 0; i < nCards; i++){
            drawnCards.push(this.cards.pop());
        }
        return drawnCards;
    }
}

class Hand{
    constructor(deck){
        this.cards = [];
        this.deck = deck;
    }

    draw(nCards){
        let drawnCards = this.deck.draw(nCards);

        drawnCards.forEach(card => {
            this.cards.push(card);
        })
    }
}
