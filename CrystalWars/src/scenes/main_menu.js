class main_menu extends Phaser.Scene {
    constructor() {
        super("main_menu")
    }

    create() {
      var fondo = this.add.image(0, 0, 'mainMenuBackground');
      Phaser.Display.Align.In.Center(fondo, this.add.zone(320,180,640,360));

      var play = this.add.image(0, 0, 'play');
      play.setScale(0.04)
      Phaser.Display.Align.In.Center(play, this.add.zone(320,120,640,360));

      var credits=this.add.image(0,0,'creditsButton');
      credits.setScale(0.04)
      Phaser.Display.Align.In.Center(credits,this.add.zone(320,170,640,360));

      var optionsB=this.add.image(0,0,'optionsButton');
      optionsB.setScale(0.04)
      Phaser.Display.Align.In.Center(optionsB,this.add.zone(320,220,640,360));

      var deckB=this.add.image(0,0,'deckButton');
      deckB.setScale(0.04)
      Phaser.Display.Align.In.Center(deckB,this.add.zone(320,270,640,360));

      play.setInteractive().on('pointerover',function(){play.setScale(0.08);play.setDepth(1)});
      play.on('pointerout',function(){play.setScale(0.04);play.setDepth(0)});
      play.on('pointerdown',()=>mouseClickPlay(this));

      credits.setInteractive().on('pointerover',function(){credits.setScale(0.08);credits.setDepth(1)});
      credits.on('pointerout',function(){credits.setScale(0.04),credits.setDepth(0)});
      credits.on('pointerdown',()=>mouseClickCredits(this));

      optionsB.setInteractive().on('pointerover',function(){optionsB.setScale(0.08);optionsB.setDepth(1)});
      optionsB.on('pointerout',function(){optionsB.setScale(0.04); optionsB.setDepth(0)});
      optionsB.on('pointerdown',()=>mouseClickOptions(this));

      deckB.setInteractive().on('pointerover',function(){deckB.setScale(0.08);deckB.setDepth(1)});
      deckB.on('pointerout',function(){deckB.setScale(0.04);deckB.setDepth(0)});
      deckB.on('pointerdown',()=>mouseClickDeck(this));
    }

}

function mouseClickPlay(aux){
  aux.scene.start('gameP');
}

function mouseClickCredits(aux){
  aux.scene.start('creditsScene');
}

function mouseClickOptions(aux){
  aux.scene.start('optionsScene');
}

function mouseClickDeck(aux){
  aux.scene.start('deckScene');
}
