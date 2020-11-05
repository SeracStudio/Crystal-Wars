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

        this.resizeCards();

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', gameObject =>  this.cardReleased(gameObject));

        this.input.on('gameobjectover', function (pointer, gameObject) {
            gameObject.y = 343-25;
        });
    
        this.input.on('gameobjectout', function (pointer, gameObject) {
            gameObject.y = 343;
        });
    }

    cardReleased(handCard){
        if(handCard.y<200){
            this.invocar();
        }else{
            this.resizeCards();
        }
    }

    resizeCards() {
        var ancho = 640;
        var anchoCarta = 56;
        var anchoCartas = cartas.length * anchoCarta;
        var cartaActual = (ancho / 2) - (anchoCartas / 2);

        for (let index = 0; index < cartas.length; index++) {
            cartas[index].x = cartaActual + 28;
            cartas[index].y = 343;
            cartaActual += anchoCarta;
        }
    }

    invocar() {
        for (let index = 0; index < cartas.length; index++) {
            if(cartas[index].y < 200){
                cartas[index].setInteractive(false);
                cartas[index].destroy();
                cartas.splice(index,1);
            }
        }
        this.resizeCards();
    }
}
