window.onload = function() {
    var gameConfig = {
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 640,
            height: 360
        },
        type: Phaser.AUTO,
        pixelArt: true,
        scene: [boot, preload, main_menu, lobbyScene, gameP, creditsScene, optionsScene, deckScene, gameOverScene]
    };

    game = new Phaser.Game(gameConfig);
    window.focus();

    // GLOBAL VARIABLES
    game.global = {
        DEBUG_MODE: true,
        WS_CONNECTION: false,
        socket: null,
        myPlayer: new Object(),
        finalDeck: ""
    }
}
