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

        this.endTurnButton = this.add.sprite(515, 180, 'button_off_1').setInteractive();
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

        this.crystals = new Map();
        this.health = new Crystal(this, 307, 212);
        this.enemyHealth = new Crystal(this, 307, 133);
        this.crystals.set('player', this.health);
        this.crystals.set('enemy', this.enemyHealth);

        this.width = 640;
        this.height = 360;

        var board = this.add.sprite(0, 0, 'board');
        board.depth = -1;
        Phaser.Display.Align.In.Center(board, this.add.zone(320, 180, 640, 360));

        this.input.on('drag', function(pointer, gameObject, dragX, dragY) {
            this.hideCardDescription();
            gameObject.tweener.stopTween();
            if (!gameObject.isStatic) {
                gameObject.x = dragX;
                gameObject.y = dragY;
                gameObject.depth = 2;
            }
        }, this);

        this.input.on('dragend', function(pointer, handCard) {
            this.cardReleased(handCard);
            handCard.depth = 1;
        }, this);

        this.input.on('gameobjectover', function(pointer, gameObject) {
            try {
                if (gameObject.isPointerOver == false) {
                    gameObject.isPointerOver = true;
                    //gameObject.y = 343 - 25;
                    gameObject.tweener.tweenTo(gameObject.x, 319, 250);
                }
                this.showCardDescription(gameObject.cardId);
            } catch {

            }
        }, this);

        this.input.on('gameobjectout', function(pointer, gameObject) {
            try {
                gameObject.isPointerOver = false;
                //gameObject.y = 343;
                gameObject.tweener.tweenTo(gameObject.x, 343, 350);
                this.hideCardDescription();
            } catch {

            }
        }, this);

        this.cardsInfo = this.cache.json.get('info');

        this.description = new Object();

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
        if (handCard.y < 243 && handCard.y > 117 && handCard.x > 262 && handCard.x < 378) {
            handCard.tweener.tweenTo(320, 180, 250);
            handCard.isStatic = true;
            this.play(handCard.cardId);
        } else {
            this.resizeCards();
        }
    }

    resizeCards() {
        var anchoCarta = 56;
        var anchoCartas = this.cards.length * anchoCarta;
        var cartaActual = (this.width / 2) - (anchoCartas / 2);

        for (let index = 0; index < this.cards.length; index++) {
            this.cards[index].isStatic = false;
            this.cards[index].tweener.tweenTo(cartaActual + 28, 343, 250, true, true);
            cartaActual += anchoCarta;
        }
    }

    resizeEnemyCards() {
        var anchoCarta = 56;
        var anchoCartas = this.enemyCards.length * anchoCarta;
        var cartaActual = (this.width / 2) - (anchoCartas / 2);

        for (let index = 0; index < this.enemyCards.length; index++) {
            this.tweens.add({
                targets: this.enemyCards[index],
                x: cartaActual + 28,
                y: 17,
                duration: 250
            });
            cartaActual += anchoCarta;
        }
    }

    addCard(id) {
        var card = new Card(this, id);
        this.cards.push(card);
        this.input.setDraggable(card);
        card.depth = 1;
        card.x = 575;
        card.y = 290;
        this.resizeCards();
    }

    addExistingCard(card) {
        this.cards.push(card);
        card.isStatic = false;
        this.input.setDraggable(card);
        this.resizeCards();
    }

    summon(id) {
        for (let index = 0; index < this.cards.length; index++) {
            if (this.cards[index].cardId == parseInt(id)) {
                this.cards[index].isStatic = true;
                this.input.setDraggable(this.cards[index], false);
                let summonPos = this.summons.get('player').add(this.cards[index]);
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
        enemySummon.x = 320;
        enemySummon.y = -100;
        let summonPos = this.summons.get('enemy').add(enemySummon);
        enemySummon.tweener.tweenChainTo([
            [summonPos[0], summonPos[1] - 5, 400, 'Power2'],
            [summonPos[0], summonPos[1] - 20, 400, 'Back'],
            [summonPos[0], summonPos[1], 150, 'Back']
        ])
        this.deleteEnemyCard();
    }

    addEnemyCard() {
        var card = this.add.image(65, 70, 'cards', 16);
        this.enemyCards.push(card);
        this.resizeEnemyCards();
    }

    addEnemyCardAt(x, y) {
        var card = this.add.image(x, y, 'crystalCards', 0);
        this.enemyCards.push(card);
        this.resizeEnemyCards();
    }

    playCard(id) {
        for (let index = 0; index < this.cards.length; index++) {
            if (this.cards[index].cardId == parseInt(id)) {
                this.cards[index].isStatic = true;
                this.input.setDraggable(this.cards[index], false);
                this.cards[index].tweener.tweenChainTo([
                    [320, 180, 250, 'Power2'],
                    [320, 180, 500, 'Power2'],
                    [65, 290, 250, 'Power2']
                ]);
                this.cards[index].setInteractive(false);
                this.cards.splice(index, 1);
                break;
            }
        }
        this.resizeCards();
    }

    playEnemyCard(id) {
        if (this.enemyCards.length > 0) {
            this.enemyCards[0].destroy();
            this.enemyCards.splice(0, 1);
            this.resizeEnemyCards();

            var playedCard = new Card(this, id);
            playedCard.x = 320;
            playedCard.y = -100;
            playedCard.isStatic = true;
            this.input.setDraggable(playedCard, false);
            playedCard.tweener.tweenChainTo([
                [320, 180, 250, 'Power2'],
                [320, 180, 500, 'Power2'],
                [575, 70, 250, 'Power2']
            ]);
            playedCard.setInteractive(false);
        }
    }

    discard(id) {
        for (let index = 0; index < this.cards.length; index++) {
            let card = this.cards[index];
            if (card.cardId == parseInt(id)) {
                this.input.setDraggable(card, false);
                card.depth = 2;
                card.isStatic = true;
                card.tweener.tweenChainTo([
                    [card.x, card.y - 20, 300, 'Back'],
                    [65, 290, 400, 'Power2']
                ]);
                card.setInteractive(false);
                this.cards.splice(index, 1);
                break;
            }
        }
        this.resizeCards();
    }

    discardEnemyCard(id) {
        if (this.enemyCards.length > 0) {
            this.enemyCards[0].destroy();
            this.enemyCards.splice(0, 1);
            this.resizeEnemyCards();

            var discardedCard = new Card(this, id);
            discardedCard.x = 320;
            discardedCard.y = -100;
            discardedCard.depth = 2;
            discardedCard.isStatic = true;
            this.input.setDraggable(discardedCard, false);
            discardedCard.tweener.tweenChainTo([
                [discardedCard.x, 37, 300, 'Back'],
                [575, 70, 400, 'Power2']
            ]);
            discardedCard.setInteractive(false);
        }
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
        this.description.box = this.add.sprite(320, 130, 'descBox');
        this.description.text = this.add.dynamicBitmapText(250, 100, 'dogica', description);
    }

    hideCardDescription() {
        this.description.box.destroy();
        this.description.text.destroy();
    }


}
