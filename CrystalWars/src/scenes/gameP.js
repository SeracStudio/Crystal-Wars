class gameP extends Phaser.Scene {

    constructor() {
        super("gameP")
    }

    create() {

        this.cards = [];
        this.enemyCards = [];
        this.summonings = new Summonings(235);
        this.enemySummonings = new Summonings(122);
        this.health;
        this.enemyHealth;
        this.mana;
        this.enemyMana;
        this.width = 640;
        this.height = 360;

        var board = this.add.image(0, 0, 'board');
        Phaser.Display.Align.In.Center(board, this.add.zone(320, 180, 640, 360));

        this.input.on('drag', function(pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', function(pointer, handCard) {
            this.cardReleased(handCard);
        }, this);

        this.input.on('gameobjectover', function(pointer, gameObject) {
            if (!gameObject.isStatic) {
                gameObject.y = 343 - 25;
                gameObject.depth = 0;
            }
            this.showCardDescription(gameObject.cardId);
        }, this);

        this.input.on('gameobjectout', function(pointer, gameObject) {
            if (!gameObject.isStatic) {
                gameObject.y = 343;
                gameObject.depth = 0;
            }
            this.hideCardDescription();
        }, this);

        this.cardsInfo = this.cache.json.get('info');

        this.description = this.add.text(0, 0, "");

        this.notifyReady();
    }

    notifyReady() {
        let msg = new Object();
        msg.event = 'READY';
        msg.room = game.global.myPlayer.roomID;

        game.global.socket.send(JSON.stringify(msg));
    }

    play(id) {
        let msg = new Object();
        msg.event = 'PLAY';
        msg.id = id;

        game.global.socket.send(JSON.stringify(msg));
    }

    endTurn(){
        let msg = new Object();
        msg.event = 'END TURN';

        game.global.socket.send(JSON.stringify(msg));
    }

    update() {
        var cKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        if (Phaser.Input.Keyboard.JustDown(cKey))
            this.endTurn();
    }

    cardReleased(handCard) {
        if (handCard.y < 200) {
            this.invocar();
        } else {
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

    addCard(id) {
        var card = new Card(this, id);
        card.setInteractive();
        this.cards.push(card);
        this.input.setDraggable(this.cards);
        this.resizeCards();
    }

    invocar() {
        for (let index = 0; index < this.cards.length; index++) {
            if (this.cards[index].y < 200) {
                this.play(this.cards[index].cardId);
            }
        }
    }

    summon(id) {
        for (let index = 0; index < this.cards.length; index++) {
            if (this.cards[index].cardId == parseInt(id)) {
                this.cards[index].isStatic = true;
                this.input.setDraggable(this.cards[index], false);
                this.cards[index].setPos(this.summonings.getFreeSummonPos());
                this.cards.splice(index, 1);
                this.resizeCards();
            }
        }
    }

    enemySummon(id) {
        var enemySummon = new Card(this, id);
        enemySummon.setInteractive();
        enemySummon.isStatic = true;
        enemySummon.setPos(this.enemySummonings.getFreeSummonPos());
        this.deleteEnemyCard();
    }

    addEnemyCard() {
        var card = this.add.image(0, 0, 'cards', 16);
        this.enemyCards.push(card);
        this.resizeEnemyCards();
    }

    deleteCard(id) {
        for (let index = 0; index < this.cards.length; index++) {
            if (this.cards[index].cardId == parseInt(id)) {
                this.cards[index].setInteractive(false);
                this.cards[index].destroy();
                this.cards.splice(index, 1);
            }
        }
        this.resizeCards();
    }

    deleteEnemyCard() {
        if (this.enemyCards.length > 0) {
            this.enemyCards[0].destroy();
            this.enemyCards.splice(0, 1);
            this.resizeEnemyCards();
        }
    }

    showCardDescription(id) {
        var description = this.cardsInfo[id].description;
        this.description.text = description;
    }
    hideCardDescription() {
        this.description.text = "";
    }
}
