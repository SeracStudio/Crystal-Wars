class deckScene extends Phaser.Scene {
  constructor() {
      super("deckScene");
  }

  create(){

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
    menu.setScale(0.04)
    Phaser.Display.Align.In.Center(menu,this.add.zone(600,50,640,360));

    menu.setInteractive().on('pointerover',function(){menu.setScale(0.08)});
    menu.on('pointerout',function(){menu.setScale(0.04)});
    menu.on('pointerdown',()=>mouseClickMenu(this));

    var confirmButton=this.add.image(0,0,'confirmDeckButton');
    confirmButton.setScale(0.04)
    Phaser.Display.Align.In.Center(confirmButton,this.add.zone(500,50,640,360));

    this.finalDeck=[];

    confirmButton.setInteractive().on('pointerover',function(){confirmButton.setScale(0.08)});
    confirmButton.on('pointerout',function(){confirmButton.setScale(0.04)});
    confirmButton.on('pointerdown',function(){
      var neutralN=0;
      var aux=[];
      for(let i=0;i<10;i++){
        aux.push(this.finalDeck[i]);
      }
      this.finalDeck=aux;
      for(let i=0;i<this.neutralDeck.length;i++){
        if(this.neutralDeck[i].selected){
          neutralN++;
        }
      }
      if(neutralN!=3){
        alert("Debes seleccionar 3 cartas neutrales");
      }else{
        for(let i=0;i<this.neutralDeck.length;i++){
          if(this.neutralDeck[i].selected){
            this.finalDeck.push(this.neutralDeck[i].cardId);
          }

        }
        game.global.finalDeck="";
        for(let i=0;i<this.finalDeck.length;i++){
          game.global.finalDeck+=this.finalDeck[i];
          if(i!=this.finalDeck.length-1){
            game.global.finalDeck+=" ";
          }
        }
        console.log(game.global.finalDeck);
      }
    },this);

//Nombres?
    this.cardsNames = this.cache.json.get('info');
    this.cardsInfo = this.cache.json.get('info');
    this.names=[];
    this.description=new Object();
    this.cardImage;
    this.neutralDeck=[];

    waterDeckIm.setInteractive().on('pointerover',function(){waterDeckIm.setScale(1.1)});
    waterDeckIm.on('pointerout',function(){waterDeckIm.setScale(1)});
    waterDeckIm.on('pointerdown',function(){
      this.showNames(0);
    },this)

    fireDeckIm.setInteractive().on('pointerover',function(){fireDeckIm.setScale(1.1)});
    fireDeckIm.on('pointerout',function(){fireDeckIm.setScale(1)});
    fireDeckIm.on('pointerdown',function(){
      this.showNames(1);
    },this)

    windDeckIm.setInteractive().on('pointerover',function(){windDeckIm.setScale(1.1)});
    windDeckIm.on('pointerout',function(){windDeckIm.setScale(1)});
    windDeckIm.on('pointerdown',function(){
      this.showNames(2);
    },this)

    earthDeckIm.setInteractive().on('pointerover',function(){earthDeckIm.setScale(1.1)});
    earthDeckIm.on('pointerout',function(){earthDeckIm.setScale(1)});
    earthDeckIm.on('pointerdown',function(){
      this.showNames(3);
    },this)

    var xAux=250;
    var yAux=150;
    for(let i=41;i<49;i++){
      var card=new Card(this,i);
      card.deckScene=true;
      card.setInteractive();
      if(i==45){
        xAux=250
        yAux=250;
      }
      card.x=xAux;
      card.y=yAux;
      xAux+=60;
      this.neutralDeck.push(card);
    }
  }

  showNames(dType){

    this.finalDeck=[];
    for(let i=0;i<this.names.length;i++){
      this.names[i].box.destroy();
      this.names[i].text.destroy();
    }
    this.names=[];

    var y=110
    var aux=(dType*10)+1

    this.finalDeck.push(aux);
    var nombre=this.cardsNames[aux].description; //Cambiar por Nombres
    var boxN=new Object()
    boxN.box=this.add.sprite(90,y,'cardsNames');
    Object.defineProperty(boxN,'idC',{value:aux});
    boxN.text=this.add.dynamicBitmapText(20,y,'dogica',nombre).setInteractive();
    boxN.text.on('pointerover',function(){boxN.text.setScale(1.1)});
    boxN.text.on('pointerout',function(){boxN.text.setScale(1)});
    boxN.text.on('pointerdown',function(){
      this.showCardDescription(boxN.idC);
    },this)
    this.names.push(boxN);
    y+=25;
    aux++;

    this.finalDeck.push(aux)
    var nombre=this.cardsNames[aux].description; //Cambiar por Nombres
    var boxN2=new Object();
    boxN2.box=this.add.sprite(90,y,'cardsNames');
    Object.defineProperty(boxN2,'idC',{value:aux});
    boxN2.text=this.add.dynamicBitmapText(20,y,'dogica',nombre).setInteractive();
    boxN2.text.on('pointerover',function(){boxN2.text.setScale(1.1)});
    boxN2.text.on('pointerout',function(){boxN2.text.setScale(1)});
    boxN2.text.on('pointerdown',function(){
      this.showCardDescription(boxN2.idC);
    },this)
    this.names.push(boxN2);
    y+=25;
    aux++;

    this.finalDeck.push(aux)
    var nombre=this.cardsNames[aux].description; //Cambiar por Nombres
    var boxN3=new Object();
    boxN3.box=this.add.sprite(90,y,'cardsNames');
    Object.defineProperty(boxN3,'idC',{value:aux});
    boxN3.text=this.add.dynamicBitmapText(20,y,'dogica',nombre).setInteractive();
    boxN3.text.on('pointerover',function(){boxN3.text.setScale(1.1)});
    boxN3.text.on('pointerout',function(){boxN3.text.setScale(1)});
    boxN3.text.on('pointerdown',function(){
      this.showCardDescription(boxN3.idC);
    },this)
    this.names.push(boxN3);
    y+=25;
    aux++;

    this.finalDeck.push(aux)
    var nombre=this.cardsNames[aux].description; //Cambiar por Nombres
    var boxN4=new Object();
    boxN4.box=this.add.sprite(90,y,'cardsNames');
    Object.defineProperty(boxN4,'idC',{value:aux});
    boxN4.text=this.add.dynamicBitmapText(20,y,'dogica',nombre).setInteractive();
    boxN4.text.on('pointerover',function(){boxN4.text.setScale(1.1)});
    boxN4.text.on('pointerout',function(){boxN4.text.setScale(1)});
    boxN4.text.on('pointerdown',function(){
      this.showCardDescription(boxN4.idC);
    },this)
    this.names.push(boxN4);
    y+=25;
    aux++;

    this.finalDeck.push(aux)
    var nombre=this.cardsNames[aux].description; //Cambiar por Nombres
    var boxN5=new Object();
    boxN5.box=this.add.sprite(90,y,'cardsNames');
    Object.defineProperty(boxN5,'idC',{value:aux});
    boxN5.text=this.add.dynamicBitmapText(20,y,'dogica',nombre).setInteractive();
    boxN5.text.on('pointerover',function(){boxN5.text.setScale(1.1)});
    boxN5.text.on('pointerout',function(){boxN5.text.setScale(1)});
    boxN5.text.on('pointerdown',function(){
      this.showCardDescription(boxN5.idC);
    },this)
    this.names.push(boxN5);
    y+=25;
    aux++;

    this.finalDeck.push(aux)
    var nombre=this.cardsNames[aux].description; //Cambiar por Nombres
    var boxN6=new Object();
    boxN6.box=this.add.sprite(90,y,'cardsNames');
    Object.defineProperty(boxN6,'idC',{value:aux});
    boxN6.text=this.add.dynamicBitmapText(20,y,'dogica',nombre).setInteractive();
    boxN6.text.on('pointerover',function(){boxN6.text.setScale(1.1)});
    boxN6.text.on('pointerout',function(){boxN6.text.setScale(1)});
    boxN6.text.on('pointerdown',function(){
      this.showCardDescription(boxN6.idC);
    },this)
    this.names.push(boxN6);
    y+=25;
    aux++;

    this.finalDeck.push(aux)
    var nombre=this.cardsNames[aux].description; //Cambiar por Nombres
    var boxN7=new Object()
    boxN7.box=this.add.sprite(90,y,'cardsNames');
    Object.defineProperty(boxN7,'idC',{value:aux});
    boxN7.text=this.add.dynamicBitmapText(20,y,'dogica',nombre).setInteractive();
    boxN7.text.on('pointerover',function(){boxN7.text.setScale(1.1)});
    boxN7.text.on('pointerout',function(){boxN7.text.setScale(1)});
    boxN7.text.on('pointerdown',function(){
      this.showCardDescription(boxN7.idC);
    },this)
    this.names.push(boxN7);
    y+=25;
    aux++;

    this.finalDeck.push(aux)
    var nombre=this.cardsNames[aux].description; //Cambiar por Nombres
    var boxN8=new Object()
    boxN8.box=this.add.sprite(90,y,'cardsNames');
    Object.defineProperty(boxN8,'idC',{value:aux});
    boxN8.text=this.add.dynamicBitmapText(20,y,'dogica',nombre).setInteractive();
    boxN8.text.on('pointerover',function(){boxN8.text.setScale(1.1)});
    boxN8.text.on('pointerout',function(){boxN8.text.setScale(1)});
    boxN8.text.on('pointerdown',function(){
      this.showCardDescription(boxN8.idC);
    },this)
    this.names.push(boxN8);
    y+=25;
    aux++;

    this.finalDeck.push(aux)
    var nombre=this.cardsNames[aux].description; //Cambiar por Nombres
    var boxN9=new Object()
    boxN9.box=this.add.sprite(90,y,'cardsNames');
    Object.defineProperty(boxN9,'idC',{value:aux});
    boxN9.text=this.add.dynamicBitmapText(20,y,'dogica',nombre).setInteractive();
    boxN9.text.on('pointerover',function(){boxN9.text.setScale(1.1)});
    boxN9.text.on('pointerout',function(){boxN9.text.setScale(1)});
    boxN9.text.on('pointerdown',function(){
      this.showCardDescription(boxN9.idC);
    },this)
    this.names.push(boxN9);
    y+=25;
    aux++;

    this.finalDeck.push(aux)
    var nombre=this.cardsNames[aux].description; //Cambiar por Nombres
    var boxN0=new Object()
    boxN0.box=this.add.sprite(90,y,'cardsNames');
    Object.defineProperty(boxN0,'idC',{value:aux});
    boxN0.text=this.add.dynamicBitmapText(20,y,'dogica',nombre).setInteractive();
    boxN0.text.on('pointerover',function(){boxN0.text.setScale(1.1)});
    boxN0.text.on('pointerout',function(){boxN0.text.setScale(1)});
    boxN0.text.on('pointerdown',function(){
      this.showCardDescription(boxN0.idC);
    },this)
    this.names.push(boxN0);
    y+=25;
    aux++;
  }

  showCardDescription(id){
    try{
      this.description.box.destroy();
      this.description.text.destroy();
      this.cardImage.destroy();
    }catch{}
    this.cardImage=new Card(this,id);
    this.cardImage.x=550;
    this.cardImage.y=150;
    var description = this.cardsInfo[id].description;
    this.description.box = this.add.sprite(550, 300, 'descBox');
    this.description.text = this.add.dynamicBitmapText(480, 260, 'dogica', description);
  }

}
