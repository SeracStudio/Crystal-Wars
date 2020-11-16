var cursors;

class lobbyScene extends Phaser.Scene {

    constructor() {
        super("LobbyScene");
    }

    init() {
        if (game.global.DEBUG_MODE) {
            console.log("[DEBUG] Entering **LOBBY** scene");
        }
    }

    preload() {
        // WEBSOCKET CONFIGURATOR
        game.global.socket = new WebSocket("ws://127.0.0.1:6502/crystalwars")

        game.global.socket.onmessage = (message) => {
            var msg = JSON.parse(message.data)

            switch (msg.event) {
                case 'CONNECT':
                    this.scene.get('LobbyScene').connectMsg(msg);
                    break;
                case 'CREATE':
                    this.scene.get('LobbyScene').createMsg(msg);
                    break;
                case 'JOIN':
                    this.scene.get('LobbyScene').joinMsg(msg);
                    break;
                default:
                    console.dir(msg)
                    break;
            }
        }
    }

    create() {
        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        var cKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        var fKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        var gKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
		var hKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
		var jKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
		var kKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
		var lKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
		var tKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
		var yKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y);
		var uKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);

        if (Phaser.Input.Keyboard.JustDown(cKey)) {
            this.createRoom();
        } else if (Phaser.Input.Keyboard.JustDown(fKey)) {
            this.joinRoom();
        } else if (Phaser.Input.Keyboard.JustDown(gKey)){
        	let msg = new Object();
       	 	msg.event = 'PLAY';
        	msg.id = '2';

        	game.global.socket.send(JSON.stringify(msg));
        }else if (Phaser.Input.Keyboard.JustDown(hKey)){
        	let msg = new Object();
       	 	msg.event = 'PLAY';
        	msg.id = '6';

        	game.global.socket.send(JSON.stringify(msg));
        }
        else if (Phaser.Input.Keyboard.JustDown(jKey)){
        	let msg = new Object();
       	 	msg.event = 'PLAY';
        	msg.id = '4';

        	game.global.socket.send(JSON.stringify(msg));
        }
        else if (Phaser.Input.Keyboard.JustDown(kKey)){
        	let msg = new Object();
       	 	msg.event = 'END TURN';

        	game.global.socket.send(JSON.stringify(msg));
        }
        else if (Phaser.Input.Keyboard.JustDown(lKey)){
        	let msg = new Object();
       	 	msg.event = 'SELECT';
       	 	msg.id = '6';

        	game.global.socket.send(JSON.stringify(msg));
        }
        else if (Phaser.Input.Keyboard.JustDown(tKey)){
        	let msg = new Object();
       	 	msg.event = 'PLAY';
        	msg.id = '12';

        	game.global.socket.send(JSON.stringify(msg));
        }else if (Phaser.Input.Keyboard.JustDown(yKey)){
        	let msg = new Object();
       	 	msg.event = 'PLAY';
        	msg.id = '14';

        	game.global.socket.send(JSON.stringify(msg));
        }
        else if (Phaser.Input.Keyboard.JustDown(uKey)){
        	let msg = new Object();
       	 	msg.event = 'PLAY';
        	msg.id = '13';

        	game.global.socket.send(JSON.stringify(msg));
        }
    }

    createRoom() {
        let msg = new Object();
        msg.event = 'CREATE';
        msg.deck = '2 4 6';

        game.global.socket.send(JSON.stringify(msg));
    }

    joinRoom() {
        let msg = new Object();
        msg.event = 'JOIN';
        msg.room = 'AAAAAA';
        msg.deck = '12 12 13 14 12';

        game.global.socket.send(JSON.stringify(msg));
    }

    notifyReady(){
        let msg = new Object();
        msg.event = 'READY';
        msg.room = game.global.myPlayer.roomID;

        game.global.socket.send(JSON.stringify(msg));
    }

    // WEBSOCKET MESSAGES PROTOCOL:
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
        this.notifyReady();
    }

    joinMsg(msg) {
        if (game.global.DEBUG_MODE) {
            console.log('[DEBUG] JOIN message recieved')
            console.dir(msg)
        }
        game.global.myPlayer.roomID = msg.room;
        this.notifyReady();
    }
}
