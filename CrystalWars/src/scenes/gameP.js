class gameP extends Phaser.Scene {

    constructor() {
        super("gameP")
    }

    create() {

        this.nCards = 6;
        this.cartas = [];

        var board = this.add.image(0, 0, 'board');
        Phaser.Display.Align.In.Center(board, this.add.zone(320, 180, 640, 360));

        var id = 0;

        for (let index = 0; index < this.nCards; index++) {
            var card = new Carta(this,id);
            card.setInteractive();
            this.cartas.push(card);
            id++;
        }

        this.input.setDraggable(this.cartas);

        this.resizeCards();

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', gameObject =>  this.cardReleased(gameObject));

        this.input.on('gameobjectover', function (pointer, gameObject) {
            gameObject.y = 343-25;
            gameObject.depth = 100;
        });

        this.input.on('gameobjectout', function (pointer, gameObject) {
            gameObject.y = 343;
            gameObject.depth = 0;
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
        var anchoCartas = this.cartas.length * anchoCarta;
        var cartaActual = (ancho / 2) - (anchoCartas / 2);

        for (let index = 0; index < this.cartas.length; index++) {
            this.cartas[index].x = cartaActual + 28;
            this.cartas[index].y = 343;
            cartaActual += anchoCarta;
        }
    }

    invocar() {
        for (let index = 0; index < this.cartas.length; index++) {
            if(this.cartas[index].y < 200){
                alert(this.cartas[index].id);
                this.cartas[index].setInteractive(false);
                this.cartas[index].destroy();
                this.cartas.splice(index,1);
            }
        }
        this.resizeCards();
    }
}
