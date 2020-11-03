class boot extends Phaser.Scene{
  constructor(){
    super("boot");
  }

  init(){

  }

  preload(){

  }

  create(){
    this.scene.start('preload');
  }

  update(){
    
  }
}
