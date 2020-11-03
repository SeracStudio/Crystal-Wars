nCards = 5;

class gameP extends Phaser.Scene {
    
    constructor() {
        super("gameP")
    }

    create() {
        var pic = this.add.image(0, 0, 'board');
        Phaser.Display.Align.In.Center(pic, this.add.zone(320,180,640,360));

        this.add.image(50, 100, 'card');
        this.resizeCards();
    }

    resizeCards(){
        var ancho = 640;
        var anchoCarta = 56;
        var anchoCartas = nCards*anchoCarta;
        var cartaActual = (ancho/2)-(anchoCartas/2);

        for (var i = 0; i < nCards; i++) {
            this.add.image(cartaActual+28, 320, 'card');
            cartaActual+=anchoCarta;
          }
    }
}
