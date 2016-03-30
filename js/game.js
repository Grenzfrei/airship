"use strict";

var Airship = Airship || {},
    Phaser = Phaser || {};

// create new phaser game object with height: 800px and height: 600px
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');

// Add the game states
game.state.add('LoadState', Airship.LoadState);
game.state.add('StartState', Airship.StartState);
game.state.add('WorldState', Airship.WorldState);
game.state.add('BattleState', Airship.BattleState);
game.state.add('GameOverState', Airship.GameOverState);

// start the loading state to load the game
game.state.start('LoadState');
