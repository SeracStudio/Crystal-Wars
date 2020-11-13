var finalDeck=[];

class deckScene extends Phaser.Scene {
  constructor() {
      super("deckScene");
  }

  create(){

    this.deck=new Deck();
    this.neutralCards= [];
    this.neutralDeck=[];


    var fondo = this.add.image(0, 0, 'credits');
    Phaser.Display.Align.In.Center(fondo, this.add.zone(320,180,640,360));

    var waterDeckIm=this.add.image(0,0,'waterDeck');
    Phaser.Display.Align.In.Center(waterDeckIm,this.add.zone(31,44,640,360));

    var fireDeckIm=this.add.image(0,0,'fireDeck');
    Phaser.Display.Align.In.Center(fireDeckIm,this.add.zone(90,44,640,360));

    var windDeckIm=this.add.image(0,0,'windDeck');
    Phaser.Display.Align.In.Center(windDeckIm,this.add.zone(149,44,640,360));

    var earthDeckIm=this.add.image(0,0,'earthDeck');
    Phaser.Display.Align.In.Center(earthDeckIm,this.add.zone(208,44,640,360));

    var menu=this.add.image(0,0,'menuButton');
    Phaser.Display.Align.In.Center(menu,this.add.zone(600,30,640,360));

    var confirmDeckButton=this.add.image(0,0,'confirmDeckButton');
    Phaser.Display.Align.In.Center(confirmDeckButton,this.add.zone(500,310,640,360));

    confirmDeckButton.setInteractive().on('pointerover',function(){confirmDeckButton.setScale(0.08)});
    confirmDeckButton.on('pointerout',function(){confirmDeckButton.setScale(0.04)});
    confirmDeckButton.on('pointerdown',()=>mouseClickConfirm(this));

    menu.setInteractive().on('pointerover',function(){menu.setScale(0.08)});
    menu.on('pointerout',function(){menu.setScale(0.04)});
    menu.on('pointerdown',()=>mouseClickMenu(this));

    waterDeckIm.setInteractive().on('pointerover',function(){waterDeckIm.setScale(1.1)});
    waterDeckIm.on('pointerout',function(){waterDeckIm.setScale(1)});
    waterDeckIm.on('pointerdown',()=>showDeck(this,1));

    fireDeckIm.setInteractive().on('pointerover',function(){fireDeckIm.setScale(1.1)});
    fireDeckIm.on('pointerout',function(){fireDeckIm.setScale(1)});
    fireDeckIm.on('pointerdown',()=>showDeck(this,2));

    windDeckIm.setInteractive().on('pointerover',function(){windDeckIm.setScale(1.1)});
    windDeckIm.on('pointerout',function(){windDeckIm.setScale(1)});
    windDeckIm.on('pointerdown',()=>showDeck(this,3));

    earthDeckIm.setInteractive().on('pointerover',function(){earthDeckIm.setScale(1.1)});
    earthDeckIm.on('pointerout',function(){earthDeckIm.setScale(1)});
    earthDeckIm.on('pointerdown',()=>showDeck(this,4));
  }

  resetDeck(){
    try{
      for(let i=0;i<this.deck.deck.length;i++){
        this.deck.deck[i].destroy();
      }
      for(let i=0;i<this.neutralCards.length;i++){
        this.neutralCards[i].destroy();
      }
      for(let i=0;i<this.neutralDeck.length;i++){
        this.neutralDeck[i].destroy();
      }
      this.deck.deck=[];
      this.neutralCards=[];
      this.neutralDeck=[];
    }catch{}
  }

  resizeCards() {
      var ancho = 640;
      var anchoCarta = 56;
      var anchoCartas = this.deck.deck.length * anchoCarta;
      var cartaActual = (ancho / 2) - (anchoCartas / 2);

      for (let index = 0; index < this.deck.deck.length; index++) {
          this.deck.deck[index].x = cartaActual;
          this.deck.deck[index].y = 130;
          cartaActual += anchoCarta+6;
      }

      cartaActual = (ancho / 2) - (anchoCartas / 2);

      for (let index = 0; index < this.neutralCards.length; index++) {
          this.neutralCards[index].x = cartaActual;
          this.neutralCards[index].y = 220;
          cartaActual += anchoCarta+6;
      }

      try{
        cartaActual = (ancho / 2) - (anchoCartas / 2) +200;
        for (let index = 0; index < this.neutralDeck.length; index++) {
            this.neutralDeck[index].x = cartaActual;
            this.neutralDeck[index].y = 310;
            cartaActual += anchoCarta+6;
        }
      }catch{}
  }

  dragNeutral(){
    this.input.setDraggable(this.neutralCards);
    try{
      this.input.setDraggable(this.neutralDeck);
    }catch{}
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });

    this.input.on('dragend', gameObject =>  this.cardReleased(gameObject));
  }

  cardReleased(card){
    if(card.y>294 && this.neutralDeck.length<=2){
      var cardAux=new Carta(this,card.id);
      cardAux.deckNeutral=true;
      cardAux.setInteractive();
      this.neutralDeck.push(cardAux);
      for(let i=0;i<this.neutralCards.length;i++){
        if(this.neutralCards[i].id==card.id){
          this.neutralCards[i].destroy();
          this.neutralCards.splice(i,1);
          break;
        }
      }
      this.resizeCards();
      this.dragNeutral();
    }else{
      this.resizeCards();
    }
  }

}


function showDeck(scene,dType){
  scene.resetDeck();
  scene.deck.setDeckType(dType,scene);
  for(let i=40;i<48;i++){
    var card=new Carta(scene,i)
    card.setInteractive();
    scene.neutralCards.push(card);
  }
  scene.resizeCards();
  scene.dragNeutral();
}

function mouseClickConfirm(scene){
  finalDeck=[];
  for(let i=0;i<scene.deck.deck.length;i++){
    finalDeck.push(scene.deck.deck[i]);
  }
  for(let i=0;i<scene.neutralDeck.length;i++){
    finalDeck.push(scene.neutralDeck[i]);
  }
}
