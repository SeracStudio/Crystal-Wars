window.onload = function () {

    config = {
        width: 1024,
        height: 600,
        scene: [lobbyScene]
    }

    game = new Phaser.Game(config)

    window.focus()

    // GLOBAL VARIABLES
    game.global = {
        FPS: 30,
        DEBUG_MODE: true,
        WS_CONNECTION: false,
        socket: null,
        myPlayer: new Object(),
        otherPlayers: [],
        projectiles: []
    }
}
