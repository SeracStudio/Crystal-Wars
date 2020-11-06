class creditsScene extends Phaser.Scene {
  constructor() {
      super("creditsScene");
  }

  create(){
    var fondo = this.add.image(0, 0, 'credits');
    Phaser.Display.Align.In.Center(fondo, this.add.zone(320,180,640,360));

    var menu=this.add.image(0,0,'menuButton');
    menu.setScale(0.04)
    Phaser.Display.Align.In.Center(menu,this.add.zone(320,320,640,360));

    menu.setInteractive().on('pointerover',function(){menu.setScale(0.08)});
    menu.on('pointerout',function(){menu.setScale(0.04)});
    menu.on('pointerdown',()=>mouseClickMenu(this));
  }
}

function mouseClickMenu(aux){
  aux.scene.start("main_menu");
}
