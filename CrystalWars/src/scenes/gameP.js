class gameP extends Phaser.Scene {

    constructor() {
        super("gameP")
    }

    create() {
        this.isGameActive = true;
        this.playSound('healEffect', 0.5);

        if (gameMode == 'FAST') {
            this.crystalButton = this.add.sprite(134, 180, 'quickButton_1').setInteractive();
            this.crystalButton.on('pointerdown', function() {
                this.activateCrystalButton();
            }, this);
        }

        this.emitter0 = this.add.particles('crystalParticle').createEmitter({
            speed: {
                min: -200,
                max: 200
            },
            angle: {
                min: 0,
                max: 360
            },
            scale: {
                start: 1,
                end: 1
            },
            quantity: 75,
            blendMode: 'SCREEN',
            lifespan: 500,
        });
        this.emitter0.stop();

        this.emitter1 = this.add.particles('crystalParticle2').createEmitter({
            speed: {
                min: -100,
                max: 100
            },
            angle: {
                min: -135,
                max: -45
            },
            scale: {
                start: 1,
                end: 1
            },
            quantity: 100,
            blendMode: 'SCREEN',
            lifespan: 500,
        });
        this.emitter1.stop();

        this.surrenderButton = this.add.sprite(24, 24, 'buttonsAtlas', 'back_1').setInteractive();
        this.surrenderButton.on('pointerdown', function() {
            leaveServer();
            this.scene.start('main_menu');
        }, this);
        this.surrenderButton.on('pointerover', function(){
            this.surrenderButton.setTexture('buttonsAtlas', 'back_2');
        }, this)
        this.surrenderButton.on('pointerout', function(){
            this.surrenderButton.setTexture('buttonsAtlas', 'back_1');
        }, this)

        this.endTurnButton = this.add.sprite(515, 180, 'button_off_1').setInteractive();
        this.myTurn = false;

        this.endTurnButton.on('pointerdown', function() {
            if (!this.isGameActive) return;

            if (this.myTurn) {
                this.endTurnButton.setTexture('button_on_2');
                this.endTurn();
            } else {
                this.endTurnButton.setTexture('button_off_2');
            }
        }, this);
        this.endTurnButton.on('pointerup', function() {
            if (!this.isGameActive) return;

            if (this.myTurn) {
                this.endTurnButton.setTexture('button_on_1');
            } else {
                this.endTurnButton.setTexture('button_off_1');
            }
        }, this);

        this.selectPopUp;

        this.playerDeck = this.add.sprite(575, 276, 'fullDeck');
        this.playerDeck.depth = 5;
        this.enemyDeck = this.add.sprite(66, 75, 'fullDeck');
        this.enemyDeck.depth = 5;
        this.cards = [];
        this.enemyCards = [];
        this.graveyard = [];
        this.enemyGraveyard = [];
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
            if (!this.isGameActive) return;
            this.hideCardDescription();
            gameObject.tweener.stopTween();
            if (!gameObject.isStatic) {
                gameObject.x = dragX;
                gameObject.y = dragY;
                gameObject.depth = 2;
            }
        }, this);

        this.input.on('dragend', function(pointer, handCard) {
            if (!this.isGameActive) return;
            if (this.cards.includes(handCard)) {
                handCard.depth = 1;
                this.cardReleased(handCard);
            }
        }, this);

        this.input.on('gameobjectover', function(pointer, gameObject) {
            if (!this.isGameActive) return;
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
            if (!this.isGameActive) return;
            try {
                gameObject.isPointerOver = false;
                //gameObject.y = 343;
                gameObject.tweener.tweenTo(gameObject.x, 343, 350);
                this.hideCardDescription();
            } catch {

            }
        }, this);

        this.cardsInfo = this.cache.json.get('info');
        console.log(this.cardsInfo);

        this.description = new Object();

        if (game.global.myPlayer.creator) {
            this.roomBox = this.add.sprite(320, 180, 'roomTextBox');

            let roomString = "";
            for (let i = 0; i < game.global.myPlayer.roomID.length; i++) {
                roomString += game.global.myPlayer.roomID.charAt(i) + "";
            }

            this.roomText = this.add.dynamicBitmapText(320, 180, 'dogica', roomString, 32).setOrigin(0.5, 0.5);
        }

        new SoundController(this, 605, 20);

        this.notifyReady();
    }

    destroyRoomID() {
        this.roomBox.destroy();
        this.roomText.destroy();
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

    activateCrystalButton() {
        let msg = new Object();
        msg.event = 'CRYSTAL BUTTON';

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
        var card = this.add.image(65, 70, 'crystalCards', 0);
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
                    [66, 279, 250, 'Power2']
                ]);
                this.cards[index].setInteractive(false);
                this.graveyard.push(this.cards.splice(index, 1)[0]);
                for (let i = 0; i < this.graveyard.length; i++) {
                    console.log(this.graveyard[i]);
                    this.graveyard[i].depth = 2;
                    if (i == this.graveyard.length - 1) {
                        this.graveyard[i].depth = 3;
                    }
                }
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
                [575, 78, 250, 'Power2']
            ]);
            playedCard.setInteractive(false);
            this.enemyGraveyard.push(playedCard);
            for (let i = 0; i < this.enemyGraveyard.length; i++) {
                this.enemyGraveyard[i].depth = 2;
                if (i == this.enemyGraveyard.length - 1) {
                    this.enemyGraveyard[i].depth = 3;
                }
            }
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
                    [66, 279, 400, 'Power2']
                ]);
                card.setInteractive(false);
                this.graveyard.push(this.cards.splice(index, 1)[0]);
                for (let i = 0; i < this.graveyard.length; i++) {
                    this.graveyard[i].depth = 2;
                    if (i == this.graveyard.length - 1) {
                        console.log(this.graveyard[i]);
                        this.graveyard[i].depth = 3;
                    }
                }
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
                [575, 78, 400, 'Power2']
            ]);
            discardedCard.setInteractive(false);
            this.enemyGraveyard.push(discardedCard);
            for (let i = 0; i < this.enemyGraveyard.length; i++) {
                this.enemyGraveyard[i].depth = 2;
                if (i == this.enemyGraveyard.length - 1) {
                    this.enemyGraveyard[i].depth = 3;
                }
            }
        }
    }


    peek(id) {
        var playedCard = new Card(this, id);
        playedCard.x = 320;
        playedCard.y = -100;
        playedCard.isStatic = true;
        this.input.setDraggable(playedCard, false);
        playedCard.tweener.tweenChainTo([
            [133, 179, 500, 'Power2'],
            [133, 179, 5000, 'Power2'],
            [320, -100, 500, 'Power2']
        ]);
        playedCard.setInteractive(false);
    }

    deleteEnemyCard() {
        if (this.enemyCards.length > 0) {
            this.enemyCards[0].destroy();
            this.enemyCards.splice(0, 1);
            this.resizeEnemyCards();
        }
    }

    deckReset() {
        for (let i = 0; i < this.graveyard.length; i++) {
            this.tweens.add({
                targets: this.graveyard[i],
                x: 575,
                y: 279,
                duration: 300,
                delay: 50 * i,
                ease: 'Power2',
                onComplete: function() {
                    for (var obj of this.targets) {
                        obj.destroy();
                    }
                }
            });
        }

        this.graveyard = [];
        this.playerDeck.alpha = 1;
    }

    enemyDeckReset() {
        for (let i = 0; i < this.enemyGraveyard.length; i++) {
            this.tweens.add({
                targets: this.enemyGraveyard[i],
                x: 66,
                y: 78,
                duration: 300,
                delay: 50 * i,
                onComplete: function() {
                    for (var obj of this.targets) {
                        obj.destroy();
                    }
                }
            });
        }

        this.enemyGraveyard = [];
        this.enemyDeck.alpha = 1;
    }

    showCardDescription(id) {
        this.hideCardDescription();

        var description = this.cardsInfo[id].description;
        console.log(this.cardsInfo[id].lines);
        this.description.box = this.add.sprite(320, 135, this.cardsInfo[id].element, this.cardsInfo[id].lines);
        this.description.box.depth = 5;
        this.description.text = this.add.dynamicBitmapText(320, 135, 'dogica', description).setOrigin(0.5, 0.5);
        this.description.text.depth = 6;
        this.description.text.align = 1;
    }

    hideCardDescription() {
        if (this.description.box == undefined || this.description.text == undefined)
            return;

        this.description.box.destroy();
        this.description.text.destroy();
    }

    showVictory() {
        leaveServer();

        var victory = this.add.sprite(320, -200, 'victory');
        victory.depth = 7;
        var continueButton = this.add.sprite(320, -100, 'continue');
        continueButton.depth = 6;
        this.isGameActive = false;

        this.tweens.add({
            targets: victory,
            x: 320,
            y: 85,
            duration: 3000,
            ease: 'Bounce'
        });
        this.tweens.add({
            targets: continueButton,
            x: 320,
            y: 230,
            duration: 3000,
            ease: 'Bounce'
        });

        continueButton.setInteractive().on('pointerover', function() {
            continueButton.setTexture('continue_2');
        })
        continueButton.on('pointerout', function() {
            continueButton.setTexture('continue');
        })
        continueButton.on('pointerdown', function() {
            this.scene.start('main_menu');
        }, this)
    }

    showDefeat() {
        leaveServer();

        let defeat = this.add.sprite(320, -200, 'defeat');
        defeat.depth = 7;
        let continueButton = this.add.sprite(320, -100, 'continue');
        continueButton.depth = 6;
        this.isGameActive = false;

        this.tweens.add({
            targets: defeat,
            x: 320,
            y: 85,
            duration: 3000,
            ease: 'Bounce'
        });
        this.tweens.add({
            targets: continueButton,
            x: 320,
            y: 230,
            duration: 3000,
            ease: 'Bounce'
        });

        continueButton.setInteractive().on('pointerover', function() {
            continueButton.setTexture('continue_2');
        })
        continueButton.on('pointerout', function() {
            continueButton.setTexture('continue');
        })
        continueButton.on('pointerdown', function() {
            this.scene.start('main_menu');
        }, this)
    }

    turnPopFeedback() {
        var popUp = new PopUpBox(this, 320, 180, 'popUpBoxError', 'TU TURNO', 1500, 16);
        popUp.launchPopUp();
        popUp.depth = 5;
        popUp.popUpText.depth = 6;
    }

    popUpErrorFeedback(msg) {
        var popUp = new PopUpBox(this, 320, 265, 'popUpBoxError', msg, 1500);
        popUp.launchPopUp();
        popUp.depth = 5;
        popUp.popUpText.depth = 6;
    }

    popUpErrorFeedbackLarge(msg) {
        var popUp = new PopUpBox(this, 320, 265, 'popUpBoxError2', msg, 1500);
        popUp.launchPopUp();
        popUp.depth = 5;
        popUp.popUpText.depth = 6;
    }

    openPopUpSelectFeedback(msg) {
        this.selectPopUp = new PopUpBox(this, 320, 265, 'popUpBox', msg, 1500);
        this.selectPopUp.open();
        this.selectPopUp.depth = 5;
        this.selectPopUp.popUpText.depth = 6;
    }

    closePopUpSelectFeedback() {
        this.selectPopUp.closeNow();
    }

    playSound(sound, volume) {
        new PlaySound(this, sound, volume);
    }
}
