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

    setDeckType(dType,scene){
      scene.resizeCards();
      for(let i=(dType-1)*10;i<dType*10;i++){
        var card=new Card(scene,i)
        this.deck.push(card);
      }
    }
}
