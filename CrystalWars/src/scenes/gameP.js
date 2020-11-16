class gameP extends Phaser.Scene {

    constructor() {
        super("gameP")
    }

    create() {

         this.emitter0 = this.add.particles('particle_1').createEmitter({
            speed: {
                min: -400,
                max: 400
            },
            angle: {
                min: 0,
                max: 360
            },
            scale: {
                start: 1,
                end: 0.75
            },
            quantity: 50,
            blendMode: 'SCREEN',
            lifespan: 600,
        });
        this.emitter0.stop();

        this.endTurnButton = this.add.sprite(500, 180, 'button_off_1').setInteractive();
        this.myTurn = false;
        this.endTurnButton.on('pointerover', function() {
            if (this.myTurn)
                this.endTurnButton.setTexture('button_on_1');
        }, this);
        this.endTurnButton.on('pointerout', function() {
            this.setTexture('button_off_1');
        });
        this.endTurnButton.on('pointerdown', function() {
            if (this.myTurn) {
                this.endTurnButton.setTexture('button_on_2');
                this.endTurn();
            }
        }, this);
        this.endTurnButton.on('pointerup', function() {
            this.setTexture('button_off_1');
        });

        this.cards = [];
        this.enemyCards = [];
        this.mana = new ManaOrbs(this, [
            [280, 231],
            [295, 253],
            [320, 263],
            [345, 253],
            [360, 231]
        ]);
        this.enemyMana = new ManaOrbs(this, [
            [280, 129],
            [295, 107],
            [320, 97],
            [345, 107],
            [360, 129]
        ])

        this.summons = new Map();

        this.summonings = new Summonings(this, [208, 432], 235, 'player');
        this.enemySummonings = new Summonings(this, [432, 208], 122, 'enemy');
        this.summons.set('player', this.summonings);
        this.summons.set('enemy', this.enemySummonings);

        this.health;
        this.enemyHealth;
        this.mana;
        this.enemyMana;
        this.width = 640;
        this.height = 360;

        var board = this.add.sprite(0, 0, 'board');
        board.depth = -1;
        Phaser.Display.Align.In.Center(board, this.add.zone(320, 180, 640, 360));

        this.input.on('drag', function(pointer, gameObject, dragX, dragY) {
            gameObject.tweener.stopTween();
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', function(pointer, handCard) {
            this.cardReleased(handCard);
        }, this);

        this.input.on('gameobjectover', function(pointer, gameObject) {
            try {
                if (!gameObject.isStatic && gameObject.isPointerOver == false) {
                    gameObject.isPointerOver = true;
                    //gameObject.y = 343 - 25;
                    gameObject.tweener.tweenTo(gameObject.x, 319, 250);
                    gameObject.depth = 0;
                }
                this.showCardDescription(gameObject.cardId);
            } catch {

            }
        }, this);

        this.input.on('gameobjectout', function(pointer, gameObject) {
            try {
                if (!gameObject.isStatic) {
                    gameObject.isPointerOver = false;
                    //gameObject.y = 343;
                    gameObject.tweener.tweenTo(gameObject.x, 343, 350);
                    gameObject.depth = 0;
                }
                this.hideCardDescription();
            } catch {

            }
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

    endTurn() {
        let msg = new Object();
        msg.event = 'END TURN';

        game.global.socket.send(JSON.stringify(msg));
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
            //this.cards[index].x = cartaActual + 28;
            //this.cards[index].y = 343;
            this.cards[index].tweener.tweenTo(cartaActual + 28, 343, 250, true, true);
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
        //card.setInteractive();
        this.cards.push(card);
        this.input.setDraggable(card);
        this.resizeCards();
        card.y = 343;
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
                //this.cards[index].setPos(this.summonings.getFreeSummonPos());
                this.summons.get('player').summons.push(this.cards[index]);
                let summonPos = this.summonings.getFreeSummonPos();
                this.cards[index].tweener.tweenChainTo([
                    [summonPos[0], summonPos[1] - 5, 400, 'Power2'],
                    [summonPos[0], summonPos[1] - 20, 400, 'Back'],
                    [summonPos[0], summonPos[1], 150, 'Back']
                ])
                this.cards.splice(index, 1);
                this.resizeCards();
                break;
            }
        }
    }

    enemySummon(id) {
        var enemySummon = new Card(this, id);
        enemySummon.setInteractive();
        enemySummon.isStatic = true;
        //enemySummon.setPos(this.enemySummonings.getFreeSummonPos());
        enemySummon.x = 320;
        enemySummon.y = -100;
        this.summons.get('enemy').summons.push(enemySummon);
        let summonPos = this.enemySummonings.getFreeSummonPos();
        enemySummon.tweener.tweenChainTo([
            [summonPos[0], summonPos[1] - 5, 400, 'Power2'],
            [summonPos[0], summonPos[1] - 20, 400, 'Back'],
            [summonPos[0], summonPos[1], 150, 'Back']
        ])
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
                break;
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
