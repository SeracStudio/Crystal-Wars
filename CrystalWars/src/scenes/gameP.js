class gameP extends Phaser.Scene {

    constructor() {
        super("gameP")
    }

    create() {

        this.nCards = 6;
        this.nenemyCards = 6;
        this.cards = [];
        this.enemyCards = [];
        this.width = 640;
        this.height = 360;

        var board = this.add.image(0, 0, 'board');
        Phaser.Display.Align.In.Center(board, this.add.zone(320, 180, 640, 360));

        var id = 0;

        for (let index = 0; index < this.nCards; index++) {
            var card = new Card(this,id);
            card.setInteractive();
            this.cards.push(card);
            id++;
        }

        for (let index = 0; index < this.nCards; index++) {
            var card = this.add.image(0,0,'cards',16);
            this.enemyCards.push(card);
        }

        this.input.setDraggable(this.cards);

        this.resizeCards();

        this.resizeEnemyCards();

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', function(pointer, handCard){
            this.cardReleased(handCard);
        },this);

        this.input.on('gameobjectover', function (pointer, gameObject) {
            gameObject.y = 343-25;
            gameObject.depth = 0;
            this.showCardDescription(gameObject.cardId);
        },this);
    
        this.input.on('gameobjectout', function (pointer, gameObject) {
            gameObject.y = 343;
            gameObject.depth = 0;
            this.hideCardDescription();
        },this);

        this.cardsInfo = this.cache.json.get('info');

        this.description = this.add.text(0, 0, "");
    }

    cardReleased(handCard){
        if(handCard.y<200){
            this.invocar();
        }else{
            this.resizeCards();
        }
    }

    resizeCards() {
        var anchoCarta = 56;
        var anchoCartas = this.cards.length * anchoCarta;
        var cartaActual = (this.width / 2) - (anchoCartas / 2);

        for (let index = 0; index < this.cards.length; index++) {
            this.cards[index].x = cartaActual + 28;
            this.cards[index].y = 343;
            cartaActual += anchoCarta;
        }
    }

    resizeEnemyCards() {
        var anchoCarta = 56;
        var anchoCartas = this.enemyCards.length * anchoCarta;
        var cartaActual = (this.width / 2) - (anchoCartas / 2);

        for (let index = 0; index < this.enemyCards.length; index++) {
            this.enemyCards[index].x = cartaActual + 28;
            this.enemyCards[index].y = 17;
            cartaActual += anchoCarta;
        }
    }

    invocar() {
        for (let index = 0; index < this.cards.length; index++) {
            if(this.cards[index].y < 200){
                alert(this.cards[index].cardId);
                this.cards[index].setInteractive(false);
                this.cards[index].destroy();
                this.cards.splice(index,1);
            }
        }
        this.resizeCards();
    }

    addEnemyCard(){
        var card = this.add.image(0,0,'cards',16);
        this.enemyCards.push(card);
    }

    deleteEnemyCard(){
        if(this.enemyCards.length > 0){
            this.enemyCards[0].destroy();
            this.enemyCards.splice(0,1);
            this.resizeEnemyCards();
        }
    }

    showCardDescription(id){
        var description = this.cardsInfo[id].description;
        this.description.text = description;
    }
    hideCardDescription(){
        this.description.text = "";
    }
}
