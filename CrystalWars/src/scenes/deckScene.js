class deckScene extends Phaser.Scene {
  constructor() {
      super("deckScene");
  }

  create(){

    this.deck=new Deck();

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

    var neutralDeckIm=this.add.image(0,0,'neutralDeck');
    Phaser.Display.Align.In.Center(neutralDeckIm,this.add.zone(267,44,640,360));

    var menu=this.add.image(0,0,'menuButton');
    Phaser.Display.Align.In.Center(menu,this.add.zone(600,30,640,360));

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

    neutralDeckIm.setInteractive().on('pointerover',function(){neutralDeckIm.setScale(1.1)});
    neutralDeckIm.on('pointerout',function(){neutralDeckIm.setScale(1)});
    neutralDeckIm.on('pointerdown',()=>showDeck(this,5));


  }

  resetDeck(){
    try{
      for(let i=0;i<this.deck.deck.length;i++){
        this.deck.deck[i].destroy();
      }
      this.deck.deck=[];
    }catch{}
  }

  resizeCards() {
      var ancho = 640;
      var anchoCarta = 56;
      var anchoCartas = this.deck.deck.length * anchoCarta;
      var cartaActual = (ancho / 2) - (anchoCartas / 2);

      for (let index = 0; index < this.deck.deck.length; index++) {
          this.deck.deck[index].x = cartaActual;
          this.deck.deck[index].y = 170;
          cartaActual += anchoCarta+6;
      }
  }
}

function showDeck(scene,dType){
  scene.resetDeck();
  scene.deck.setDeckType(dType,scene);
  scene.resizeCards();
}
