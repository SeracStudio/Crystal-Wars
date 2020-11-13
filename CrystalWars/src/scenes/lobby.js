class lobbyScene extends Phaser.Scene {

    constructor() {
        super("lobbyScene")
    }

    create() {
        var create = this.add.image(0, 0, 'play');
        create.setScale(0.04)
        Phaser.Display.Align.In.Center(create, this.add.zone(320, 120, 640, 360));

        var join = this.add.image(0, 0, 'creditsButton');
        join.setScale(0.04)
        Phaser.Display.Align.In.Center(join, this.add.zone(320, 170, 640, 360));

        create.setInteractive().on('pointerover', function() {
            create.setScale(0.08);
            create.setDepth(1)
        });
        create.on('pointerout', function() {
            create.setScale(0.04);
            create.setDepth(0)
        });
        create.on('pointerdown', () => createRoom());

        join.setInteractive().on('pointerover', function() {
            join.setScale(0.08);
            join.setDepth(1)
        });
        join.on('pointerout', function() {
            join.setScale(0.04), join.setDepth(0)
        });
        join.on('pointerdown', () => joinRoom());
    }

    preload() {
        // WEBSOCKET CONFIGURATOR
        game.global.socket = new WebSocket("ws://127.0.0.1:6502/crystalwars")

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
                    this.scene.get('lobbyScene').joinMsg(msg);
                    break;
                case 'UPDATE':
                    this.scene.get('lobbyScene').updateMsg(msg);
                    break;
                case 'ERROR':
                    this.scene.get('lobbyScene').errorMsg(msg);
                    break;
                default:
                    console.dir(msg)
                    break;
            }
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
        this.scene.start('gameP');
    }

    joinMsg(msg) {
        if (game.global.DEBUG_MODE) {
            console.log('[DEBUG] JOIN message recieved')
            console.dir(msg)
        }
        game.global.myPlayer.roomID = msg.room;
        this.scene.start('gameP');
    }

    errorMsg(msg) {
        switch (msg.cause) {
            case 'PLAY':
                this.scene.get('gameP').resizeCards();
                break;
        }
    }

    updateMsg(msg) {
        switch (msg.update) {
            case 'DRAW':
                if (game.global.myPlayer.id == msg.id) {
                    this.scene.get('gameP').addCard(msg.data);
                } else {
                    this.scene.get('gameP').addEnemyCard();
                }
                break;
            case 'PLAY':
                if (game.global.myPlayer.id == msg.id) {
                    this.scene.get('gameP').deleteCard(msg.data);
                } else {
                    this.scene.get('gameP').deleteEnemyCard();
                }
                break;
            case 'HEALTH':
                if (game.global.myPlayer.id == msg.id) {
                    this.scene.get('gameP').health = parseInt(msg.data);
                } else {
                    this.scene.get('gameP').enemyHealth = parseInt(msg.data);
                }
                break;
            case 'MANA':
                if (game.global.myPlayer.id == msg.id) {
                    this.scene.get('gameP').mana = parseInt(msg.data);
                } else {
                    this.scene.get('gameP').enemyMana = parseInt(msg.data);
                }
                break;
            case 'SUMMON':
                if (game.global.myPlayer.id == msg.id) {
                    this.scene.get('gameP').summon(msg.data);
                } else {
                    this.scene.get('gameP').enemySummon(msg.data);
                }
                break;
            default:
                console.dir(msg)
                break;
        }
    }
}

function createRoom() {
    let msg = new Object();
    msg.event = 'CREATE';
    msg.deck = '2 6 6';

    game.global.socket.send(JSON.stringify(msg));
}

function joinRoom(aux) {
    let msg = new Object();
    msg.event = 'JOIN';
    msg.room = 'AAAAAA';
    msg.deck = '12 12 13 14 12';

    game.global.socket.send(JSON.stringify(msg));
}
