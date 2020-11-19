class lobbyScene extends Phaser.Scene {

    constructor() {
        super("lobbyScene")
    }

    create() {
        gameMode = 'NORMAL';

        this.add.image(320, 180, 'collectionBackground');

        this.roomText = new TextBox(this, 320, 250, 'lobbyButtons', 'text_box');

        var create = this.add.image(320, 150, 'create_1');
        create.setInteractive().on('pointerdown', () => createRoom(this));
        create.on('pointerover', function() {
            create.setTexture('create_2');
        })
        create.on('pointerout', function() {
            create.setTexture('create_1');
        })

        var join = this.add.image(320, 200, 'search_1');
        join.setInteractive().on('pointerdown', () => joinRoom(this));
        join.on('pointerover', function() {
            join.setTexture('search_2');
        })
        join.on('pointerout', function() {
            join.setTexture('search_1');
        })

        var normalMode = this.add.image(260, 100, 'lobbyButtons', 'normal_mode_3');
        normalMode.selected = true;
        this.normalMode = normalMode;
        var fastMode = this.add.image(380, 100, 'lobbyButtons', 'quick_mode_1');
        fastMode.selected = false;
        this.fastMode = fastMode;

        normalMode.setInteractive().on('pointerdown', function() {
            normalMode.selected = true;
            this.fastMode.selected = false;
            this.fastMode.setTexture('lobbyButtons', 'quick_mode_1');
            normalMode.setTexture('lobbyButtons', 'normal_mode_3');
            selectNormalMode(this);
        }, this);
        normalMode.on('pointerover', function() {
            if (!normalMode.selected)
                normalMode.setTexture('lobbyButtons', 'normal_mode_2');
        })
        normalMode.on('pointerout', function() {
            if (!normalMode.selected)
                normalMode.setTexture('lobbyButtons', 'normal_mode_1');
        })

        fastMode.setInteractive().on('pointerdown', () => {
            fastMode.selected = true;
            this.normalMode.selected = false;
            this.normalMode.setTexture('lobbyButtons', 'normal_mode_1');
            fastMode.setTexture('lobbyButtons', 'quick_mode_3');
            selectNormalMode(this);
        }, this);
        fastMode.on('pointerover', function() {
            if (!fastMode.selected)
                fastMode.setTexture('lobbyButtons', 'quick_mode_2');
        })
        fastMode.on('pointerout', function() {
            if (!fastMode.selected)
                fastMode.setTexture('lobbyButtons', 'quick_mode_1');
        })
        fastMode.setInteractive().on('pointerdown', () => selectFastMode(this));

        var clearButton = this.add.image(240, 250, 'lobbyButtons', 'delete_1');
        clearButton.setInteractive().on('pointerdown', function() {
            this.roomText.roomText.destroy();
            this.roomText.roomTextString = "";
            this.roomText.roomText = this.add.dynamicBitmapText(320, 250, 'dogica', "").setOrigin(0.5, 0.5);
        }, this);
        clearButton.on('pointerover', function() {
            clearButton.setTexture('lobbyButtons', 'delete_2');
        })
        clearButton.on('pointerout', function() {
            clearButton.setTexture('lobbyButtons', 'delete_1');
        })

        var backButton = this.add.image(320, 320, 'buttonsAtlas', 'back_1');
        backButton.setInteractive().on('pointerdown', function() {
            leaveServer();
            mouseClickMenu(this)
        }, this);
        backButton.on('pointerover', function() {
            backButton.setTexture('buttonsAtlas', 'back_2');
        })
        backButton.on('pointerout', function() {
            backButton.setTexture('buttonsAtlas', 'back_1');
        })

        new SoundController(this, 590, 40);

        if (window.mobileAndTabletCheck()) {
            var roomID = prompt("Introduce el nombre de la sala a la que quieres unirte.\nAcepta sin escribir si quieres crear tú una.");
            if(roomID === null){
                this.scene.start('main_menu');
            }
            this.roomText.loadRoomID(roomID);
        }
    }

    preload() {

        // WEBSOCKET CONFIGURATOR
        game.global.socket = new WebSocket("wss://crystal-serac-wars.herokuapp.com/crystalwars");

        game.global.socket.onmessage = (message) => {
            var msg = JSON.parse(message.data)

            switch (msg.event) {
                case 'CONNECT':
                    this.scene.get('lobbyScene').connectMsg(msg);
                    break;
                case 'CREATE':
                    this.scene.get('lobbyScene').createMsg(msg);
                    break;
                case 'JOIN':
                    if (msg.room == 'FILLED') {
                        new PlaySound(this, 'errorEffect', 1);
                        new PopUpBox(this, 320, 250, 'popUpBoxError', 'La sala ya está llena.', 1500).launchPopUp();
                        break;
                    }
                    if (msg.room == 'ERROR') {
                        new PlaySound(this, 'errorEffect', 1);
                        this.scene.get('gameP').playSound('errorEffect', 0.8);
                        new PopUpBox(this, 320, 250, 'popUpBoxError', 'La sala no existe.', 1500).launchPopUp();
                        break;
                    }
                    this.scene.get('lobbyScene').joinMsg(msg);
                    break;
                case 'UPDATE':
                    this.scene.get('lobbyScene').updateMsg(msg);
                    break;
                case 'ERROR':
                    this.scene.get('lobbyScene').errorMsg(msg);
                    break;
                case 'SELECT NOTIFY':
                    this.scene.get('lobbyScene').selectNotifyMsg(msg);
                    break;
                default:
                    console.dir(msg)
                    break;
            }
        }
    }

    selectNotifyMsg(msg) {
        switch (msg.cause) {
            case 'HAND FULL':
                this.scene.get('gameP').openPopUpSelectFeedback("No puedes tener más de 6 cartas en la mano. Descarta 1.");
                break;
            case 'FIELD FULL':
                this.scene.get('gameP').openPopUpSelectFeedback("No puedes tener más de 2 invocaciones. Destruye 1.");
                break;
            default:
                let cardName = this.cache.json.get('cardNames')[msg.id].name;
                this.scene.get('gameP').openPopUpSelectFeedback(cardName + ": " + msg.cause);
                break;
        }
    }

    connectMsg(msg) {
        if (game.global.DEBUG_MODE) {
            console.log('[DEBUG] CONNECT message recieved')
            console.dir(msg)
        }
        game.global.myPlayer.id = msg.id
    }

    createMsg(msg) {
        if (game.global.DEBUG_MODE) {
            console.log('[DEBUG] CREATE message recieved')
            console.dir(msg)
        }
        game.global.myPlayer.roomID = msg.room;
        game.global.myPlayer.creator = true;
        this.scene.start('gameP');
    }

    joinMsg(msg) {
        if (game.global.DEBUG_MODE) {
            console.log('[DEBUG] JOIN message recieved')
            console.dir(msg)
        }
        game.global.myPlayer.roomID = msg.room;
        gameMode = msg.mode;
        this.scene.start('gameP');
    }

    endTurnMsg(msg) {
        if (game.global.DEBUG_MODE) {
            console.log('[DEBUG] JOIN message recieved')
            console.dir(msg)
        }
        this.scene.get('gameP').myTurn = !this.scene.get('gameP').myTurn;
        if (this.scene.get('gameP').myTurn) {
            this.scene.get('gameP').endTurnButton.setTexture('button_on_1');
            this.scene.get('gameP').turnPopFeedback();
        }
    }

    errorMsg(msg) {
        this.scene.get('gameP').playSound('errorEffect', 1);
        switch (msg.cause) {
            case 'NOT TURN':
                this.scene.get('gameP').popUpErrorFeedback("Solo puedes jugar cartas en tu turno.");
                this.scene.get('gameP').resizeCards();
                break;
            case 'NOT IN HAND':
                this.scene.get('gameP').resizeCards();
                break;
            case 'CANT PLAY':
                this.scene.get('gameP').popUpErrorFeedback("No puedes jugar esa carta.");
                this.scene.get('gameP').resizeCards();
                break;
            case 'SELECT NOT VALID':
                this.scene.get('gameP').popUpErrorFeedback("No es un objetivo válido.");
                break;
            case 'CRYSTAL BUTTON':
                this.scene.get('gameP').popUpErrorFeedbackLarge("Solo puedes usar la 'Ultima Baza' una vez por partida.");
                break;
            case 'CRYSTAL TURN':
                this.scene.get('gameP').popUpErrorFeedbackLarge("Solo puedes usar la 'Ultima Baza' en tu turno.");
                break;
        }
    }

    updateMsg(msg) {
        switch (msg.update) {
            case 'DRAW':
                if (drawCount > 6) {
                    this.scene.get('gameP').playSound('cardDraw', 0.3);
                } else {
                    drawCount++;
                }
                if (game.global.myPlayer.id == msg.id) {
                    this.scene.get('gameP').addCard(msg.data);
                } else {
                    this.scene.get('gameP').addEnemyCard();
                }
                break;
            case 'PLAY':
                this.scene.get('gameP').playSound('cardDraw', 0.3);
                if (game.global.myPlayer.id == msg.id) {
                    this.scene.get('gameP').playCard(msg.data);
                } else {
                    this.scene.get('gameP').playEnemyCard(msg.data);
                }
                break;
            case 'HEALTH':
                if (game.global.myPlayer.id == msg.id) {
                    this.scene.get('gameP').crystals.get('player').displayHealth(msg.data);
                } else {
                    this.scene.get('gameP').crystals.get('enemy').displayHealth(msg.data);
                }
                break;
            case 'MANA':
                this.scene.get('gameP').playSound('manaEffect', 0.4);
                if (game.global.myPlayer.id == msg.id) {
                    this.scene.get('gameP').mana.changeMana(parseInt(msg.data));
                } else {
                    this.scene.get('gameP').enemyMana.changeMana(parseInt(msg.data));
                }
                break;
            case 'SUMMON':
                this.scene.get('gameP').playSound('summonEffect', 0.7);
                if (game.global.myPlayer.id == msg.id) {
                    this.scene.get('gameP').summon(msg.data);
                } else {
                    this.scene.get('gameP').enemySummon(msg.data);
                }
                break;
            case 'DESTROY':
                this.scene.get('gameP').playSound('damageEffect', 0.3);
                if (game.global.myPlayer.id == msg.id) {
                    this.scene.get('gameP').summons.get('player').destroySummoning(msg.data);
                } else {
                    this.scene.get('gameP').summons.get('enemy').destroySummoning(msg.data);
                }
                break;
            case 'DISCARD':
                this.scene.get('gameP').playSound('cardDraw', 0.3);
                if (game.global.myPlayer.id == msg.id) {
                    this.scene.get('gameP').discard(msg.data);
                } else {
                    this.scene.get('gameP').discardEnemyCard(msg.data);
                }
                break;
            case 'SELECT':
                if (game.global.myPlayer.id == msg.id) {
                    this.scene.get('gameP').closePopUpSelectFeedback();
                }
                break;
            case 'PEEK':
                if (game.global.myPlayer.id == msg.id) {
                    this.scene.get('gameP').peek(msg.data);
                }
                break;
            case 'MOVE FIELD HAND':
                this.scene.get('gameP').playSound('cardDraw', 0.3);
                if (game.global.myPlayer.id == msg.id) {
                    let card = this.scene.get('gameP').summons.get('player').remove(msg.data);
                    this.scene.get('gameP').addExistingCard(card);
                } else {
                    let cardPos = this.scene.get('gameP').summons.get('enemy').destroy(msg.data);
                    this.scene.get('gameP').addEnemyCardAt(cardPos[0], cardPos[1]);
                }
                break;
            case 'MOVE GRAVEYARD HAND':
                this.scene.get('gameP').playSound('cardDraw', 0.3);
                if (game.global.myPlayer.id == msg.id) {
                    this.scene.get('gameP').addCard(msg.data);
                } else {
                    this.scene.get('gameP').addEnemyCard();
                }
                break;
            case 'FIRST':
                if (game.global.myPlayer.id == msg.id) {
                    this.scene.get('gameP').myTurn = true;
                    this.scene.get('gameP').endTurnButton.setTexture('button_on_1');
                    this.scene.get('gameP').turnPopFeedback();
                }
                if (game.global.myPlayer.creator) {
                    this.scene.get('gameP').destroyRoomID();
                }
                break;
            case 'END TURN':
                this.scene.get('lobbyScene').endTurnMsg(msg);
                break;
            case 'DECK RESET':
                if (game.global.myPlayer.id == msg.id) {
                    this.scene.get('gameP').deckReset();
                } else {
                    this.scene.get('gameP').enemyDeckReset();
                }
                break;
            case 'DECK EMPTY':
                if (game.global.myPlayer.id == msg.id) {
                    this.scene.get('gameP').playerDeck.alpha = 0;
                } else {
                    this.scene.get('gameP').enemyDeck.alpha = 0;
                }
                break;
            case 'WINNER':
                if (game.global.myPlayer.id == msg.data) {
                    this.scene.get('gameP').showVictory();
                } else {
                    this.scene.get('gameP').showDefeat();
                }
                break;
            case 'CRYSTAL BUTTON':
                if (game.global.myPlayer.id == msg.id)
                    this.scene.get('gameP').crystalButton.setTexture('quickButton_2');
                break;
            default:
                console.dir(msg)
                break;
        }
    }
}

function createRoom(scene) {
    let msg = new Object();
    msg.event = 'CREATE';
    msg.mode = gameMode;

    game.global.finalDeck = localStorage.getItem('crystalDeck');
    if (game.global.finalDeck == "") {
        msg.deck = "1 1 1 2 2 2 3 4 5 6 7 8 9 10 41 46 48";
    } else {
        msg.deck = game.global.finalDeck;
    }
	
	if (msg.deck == null) {
        msg.deck = "1 1 1 2 2 2 3 4 5 6 7 8 9 10 41 46 48";
    }

    game.global.socket.send(JSON.stringify(msg));
}

function joinRoom(aux) {
    let msg = new Object();
    msg.event = 'JOIN';
    msg.room = aux.roomText.roomTextString;

    game.global.finalDeck = localStorage.getItem('crystalDeck');
    if (game.global.finalDeck == null) {
        msg.deck = "1 1 1 2 2 2 3 4 5 6 7 8 9 10 41 46 48";
    } else {
        msg.deck = game.global.finalDeck;
    }

    if (msg.deck == null) {
        msg.deck = "1 1 1 2 2 2 3 4 5 6 7 8 9 10 41 46 48";
    }

    game.global.socket.send(JSON.stringify(msg));
}

function leaveServer() {
    let msg = new Object();
    msg.event = 'LEAVE';

    game.global.socket.send(JSON.stringify(msg));
}

var gameMode;

function selectNormalMode(scene) {
    gameMode = 'NORMAL';
}

function selectFastMode(scene) {
    gameMode = 'FAST';
}
