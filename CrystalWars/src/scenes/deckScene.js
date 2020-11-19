class deckScene extends Phaser.Scene {
    constructor() {
        super("deckScene");
    }

    create() {
        deckCreated = false;

        this.popUp;
        this.finalDeck = [];

        var fondo = this.add.image(0, 0, 'collectionBackground').setOrigin(0, 0);
        var waterDeckIm = this.add.image(230, 50, 'waterDeck');
        var fireDeckIm = this.add.image(290, 50, 'fireDeck');
        var windDeckIm = this.add.image(350, 50, 'windDeck');
        var earthDeckIm = this.add.image(410, 50, 'earthDeck');

        var sound = new SoundController(this, 590, 40);

        var menu = this.add.image(290, 330, 'buttonsAtlas', 'back_1');
        menu.setInteractive();
        menu.on('pointerdown', () => mouseClickMenu(this));
        menu.on('pointerover', function() {
            menu.setTexture('buttonsAtlas', 'back_2');
        })
        menu.on('pointerout', function() {
            menu.setTexture('buttonsAtlas', 'back_1');
        })

        var confirmButton = this.add.image(350, 330, 'confirm_1');
        confirmButton.on('pointerover', function(){
            confirmButton.setTexture('confirm_2');
        })
        confirmButton.on('pointerout', function(){
            confirmButton.setTexture('confirm_1');
        })
        confirmButton.setInteractive();
        confirmButton.on('pointerdown', function() {
            var neutralN = 0;
            var aux = [];
            for (let i = 0; i < this.finalDeck.length; i++) {
                aux.push(this.finalDeck[i]);
            }
            this.finalDeck = aux;
            for (let i = 0; i < this.neutralDeck.length; i++) {
                if (this.neutralDeck[i].selected) {
                    neutralN++;
                }
            }

            if (neutralN != 3 || this.finalDeck.length != 14) {
                if(this.popUp != undefined){
                    this.popUp.popUpText.destroy();
                    this.popUp.destroy();
                }
                this.popUp = new PopUpBox(this, 320, 200, 'popUpBox', 'Debes seleccionar 1 mazo y 3 cartas neutrales.', 1500);
                this.popUp.launchPopUp();
            } else {
                for (let i = 0; i < this.neutralDeck.length; i++) {
                    if (this.neutralDeck[i].selected) {
                        this.finalDeck.push(this.neutralDeck[i].cardId);
                    }

                }
                game.global.finalDeck = "";
                for (let i = 0; i < this.finalDeck.length; i++) {
                    game.global.finalDeck += this.finalDeck[i];
                    if (i != this.finalDeck.length - 1) {
                        game.global.finalDeck += " ";
                    }
                }
                localStorage.setItem('crystalDeck', game.global.finalDeck);
                console.log(game.global.finalDeck);
                deckCreated = true;
                this.scene.start('main_menu');
            }
        }, this);

        this.cardsNames = this.cache.json.get('cardNames');
        this.cardsInfo = this.cache.json.get('info');
        this.names = [];
        this.description = new Object();
        this.cardImage;
        this.neutralDeck = [];

        waterDeckIm.setInteractive().on('pointerdown', function() {
            this.showNames(0);
        }, this)

        fireDeckIm.setInteractive().on('pointerdown', function() {
            this.showNames(1);
        }, this)

        windDeckIm.setInteractive().on('pointerdown', function() {
            this.showNames(2);
        }, this)

        earthDeckIm.setInteractive().on('pointerdown', function() {
            this.showNames(3);
        }, this)

        var xAux = 230;
        var yAux = 150;
        this.nCard = 10;
        for (let i = 41; i < 49; i++) {
            var card = new Card(this, i);
            card.deckS = true;
            card.setInteractive();
            if (i == 45) {
                xAux = 230
                yAux = 250;
            }
            card.x = xAux;
            card.y = yAux;
            xAux += 60;
            this.neutralDeck.push(card);
            this.neutralDeck[i - 41].setInteractive().on('pointerover', function() {
                this.showCardDescription(this.neutralDeck[i - 41].cardId);
            }, this);
            this.neutralDeck[i - 41].on('pointerout', function() {
                this.hideCardDescription();
            }, this);
            this.neutralDeck[i - 41].on('pointerdown', function() {
                if (this.neutralDeck[i - 41].selected) {} else {
                    this.addNeutralCard(this.neutralDeck[i - 41].cardId);
                }
            }, this);
        }
    }

    addNeutralCard(cardId) {
        if (this.nCard == 13)
            return;

        this.neutralDeck[cardId - 41].selected = true;

        var cardNum = this.nCard;
        var yOffset = 25;
        let name = this.cardsNames[cardId].name;
        var nameBox = new Object();
        nameBox.box = this.add.sprite(-100, 30 + yOffset * this.nCard, 'neutralBox').setInteractive();
        nameBox.text = this.add.dynamicBitmapText(-120, 27 + yOffset * this.nCard, 'dogica', name);
        this.names.push(nameBox);


        nameBox.box.on('pointerover', function() {
            this.showCardDescription(cardId);
            this.tweens.add({
                targets: this.names[cardNum].box,
                x: 105,
                duration: 75,
                easy: 'Power2'
            });
            this.tweens.add({
                targets: this.names[cardNum].text,
                x: 40,
                duration: 75,
                easy: 'Power2'
            });
        }, this);
        nameBox.box.on('pointerout', function() {
            this.hideCardDescription();
            this.tweens.add({
                targets: this.names[cardNum].box,
                x: 85,
                duration: 75,
                easy: 'Power2'
            });
            this.tweens.add({
                targets: this.names[cardNum].text,
                x: 20,
                duration: 75,
                easy: 'Power2'
            });
        }, this);

        this.tweens.add({
            targets: nameBox.box,
            x: 85,
            y: 30 + yOffset * this.nCard,
            duration: 300,
            ease: 'Power2'
        });
        this.tweens.add({
            targets: nameBox.text,
            x: 20,
            y: 27 + yOffset * this.nCard,
            duration: 300,
            ease: 'Power2'
        });

        this.nCard++;
    }

    showNames(dType) {
        this.nCard = 10;
        for (let i = 0; i < this.neutralDeck.length; i++) {
            this.neutralDeck[i].selected = false;
        }

        for (let i = 0; i < this.names.length; i++) {
            this.names[i].box.destroy();
            this.names[i].text.destroy();
        }
        this.names = [];
        this.finalDeck = [];

        let firstCard = dType * 10 + 1;
        let lastCard = dType * 10 + 11;
        let yOffset = 25;

        for (let i = firstCard, nCard = 0; i < lastCard; i++, nCard++) {
            let name = this.cardsNames[i].name;
            var nameBox = new Object();
            nameBox.box = this.add.sprite(-100, 30 + yOffset * nCard, 'nameBoxes', this.cardsInfo[i].element).setInteractive();
            nameBox.text = this.add.dynamicBitmapText(-120, 27 + yOffset * nCard, 'dogica', name);
            this.names.push(nameBox);

            nameBox.box.on('pointerover', function() {
                this.showCardDescription(i);
                this.tweens.add({
                    targets: this.names[nCard].box,
                    x: 105,
                    duration: 75,
                    easy: 'Power2'
                });
                this.tweens.add({
                    targets: this.names[nCard].text,
                    x: 40,
                    duration: 75,
                    easy: 'Power2'
                });
            }, this);
            nameBox.box.on('pointerout', function() {
                this.hideCardDescription();
                this.tweens.add({
                    targets: this.names[nCard].box,
                    x: 85,
                    duration: 75,
                    easy: 'Power2'
                });
                this.tweens.add({
                    targets: this.names[nCard].text,
                    x: 20,
                    duration: 75,
                    easy: 'Power2'
                });
            }, this);


            this.tweens.add({
                targets: nameBox.box,
                x: 85,
                y: 30 + yOffset * nCard,
                duration: 300,
                delay: 50 * nCard,
                ease: 'Power2'
            });
            this.tweens.add({
                targets: nameBox.text,
                x: 20,
                y: 27 + yOffset * nCard,
                duration: 300,
                delay: 50 * nCard,
                ease: 'Power2'
            });

            if (nCard < 2) {
                for (let j = 0; j < 3; j++) {
                    this.finalDeck.push(i);
                }
            } else {
                this.finalDeck.push(i);
            }
        }
    }

    showCardDescription(id) {
        try {
            this.description.box.destroy();
            this.description.text.destroy();
            this.cardImage.destroy();
        } catch {}
        this.cardImage = new Card(this, id);
        this.cardImage.scaleX = 2;
        this.cardImage.scaleY = 2;
        this.cardImage.x = 550;
        this.cardImage.y = 110;
        var description = this.cardsInfo[id].description;
        this.description.box = this.add.sprite(550, 270, this.cardsInfo[id].element, this.cardsInfo[id].lines);
        this.description.text = this.add.dynamicBitmapText(550, 270, 'dogica', description).setOrigin(0.5, 0.5);
        this.description.text.align = 1;
    }

    hideCardDescription() {
        this.cardImage.destroy();
        this.description.box.destroy();
        this.description.text.destroy();
    }

}
