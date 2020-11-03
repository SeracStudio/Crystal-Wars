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
      Phaser.Display.Align.In.Center(credits,this.add.zone(320,250,640,360));

      play.setInteractive().on('pointerover',function(){play.setScale(0.08)});
      play.on('pointerout',function(){play.setScale(0.04)});
      play.on('pointerdown',()=>mouseClickPlay(this));

      credits.setInteractive().on('pointerover',function(){credits.setScale(0.08)});
      credits.on('pointerout',function(){credits.setScale(0.04)});
      credits.on('pointerdown',()=>mouseClickCredits(this));
    }

}

function mouseClickPlay(aux){
  aux.scene.start('gameP');
}

function mouseClickCredits(aux){
  aux.scene.start('creditsScene');
}
