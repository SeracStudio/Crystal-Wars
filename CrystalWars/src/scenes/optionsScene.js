class optionsScene extends Phaser.Scene {
  constructor() {
      super("optionsScene");
  }

  create(){
    var fondo = this.add.image(0, 0, 'optionsBackground');
    Phaser.Display.Align.In.Center(fondo, this.add.zone(320,180,640,360));

    var menu=this.add.image(0,0,'menuButton');
    menu.setScale(0.04)
    Phaser.Display.Align.In.Center(menu,this.add.zone(320,320,640,360));

    var englishButton=this.add.image(0,0,'englishButton');
    englishButton.setScale(0.04)
    Phaser.Display.Align.In.Center(englishButton,this.add.zone(220,120,640,360));

    var spanishButton=this.add.image(0,0,'spanishButton');
    spanishButton.setScale(0.04)
    Phaser.Display.Align.In.Center(spanishButton,this.add.zone(420,120,640,360));

    englishButton.setInteractive().on('pointerover',function(){englishButton.setScale(0.08)});
    englishButton.on('pointerout',function(){englishButton.setScale(0.04)});

    spanishButton.setInteractive().on('pointerover',function(){spanishButton.setScale(0.08)});
    spanishButton.on('pointerout',function(){spanishButton.setScale(0.04)});

    menu.setInteractive().on('pointerover',function(){menu.setScale(0.08)});
    menu.on('pointerout',function(){menu.setScale(0.04)});
    menu.on('pointerdown',()=>mouseClickMenu(this));


  }
}
