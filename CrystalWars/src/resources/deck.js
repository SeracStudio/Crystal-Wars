class Deck{
    constructor(){
        this.deck = [];
    }

    shuffle(){
        for(let i = this.deck.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    draw(nCards){
        let drawnCards = [];
        for(let i = 0; i < nCards; i++){
            drawnCards.push(this.deck.pop());
        }
        return drawnCards;
    }
}
