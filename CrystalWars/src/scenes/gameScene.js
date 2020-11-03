nCards = 5;
var cartas = [];

class gameScene extends Phaser.Scene {

    constructor() {
        super("gameScene")
    }

    create() {
        var board = this.add.image(0, 0, 'board');
        Phaser.Display.Align.In.Center(board, this.add.zone(320, 180, 640, 360));

        for (let index = 0; index < nCards; index++) {
            cartas[index] = this.add.sprite(0, 0, 'card').setInteractive();
        }

        this.input.setDraggable(cartas);

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

            gameObject.x = dragX;
            gameObject.y = dragY;

        });

        this.input.on('dragend', function (pointer, gameObject) {

            gameObject.clearTint();
        });

        this.resizeCards(cartas);
    }

    resizeCards(cartas) {
        var ancho = 640;
        var anchoCarta = 56;
        var anchoCartas = cartas.length * anchoCarta;
        var cartaActual = (ancho / 2) - (anchoCartas / 2);

        for (let index = 0; index < cartas.length; index++) {
            cartas[index].x = cartaActual + 28;
            cartas[index].y = 319;
            cartaActual += anchoCarta;
        }
    }

    update() {
        //comprobar si la carta se ha usado
        for (let index = 0; index < cartas.length; index++) {
            if(cartas[index].y < 100){
                this.invocar(index);
            }
        }
    }

    invocar(index) {
        alert("alert");
        cartas[index].setInteractive(false);
        cartas.splice(index,1);
    }
}
