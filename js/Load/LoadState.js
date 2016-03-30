"use strict";

var Airship = Airship || {},
    Phaser = Phaser || {};
    
/**
 * Represents the Load State.
 * @constructor
 */
Airship.LoadState = function (game) {
  
  Phaser.State.call(this);

  // define font style
  this._fontStyle = { font: "bold 20px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
};

Airship.LoadState.prototype = Object.create(Phaser.State.prototype);
Airship.LoadState.prototype.constructor = Airship.LoadState;


/**
 * Preloading the Load State
 */  
Airship.LoadState.prototype.preload = function () {

    // add a loading text to the screen
    this.loadingLabel = this.game.add.text(this.game._width / 2, this.game._height / 2, "loading assets...", this._fontStyle);
    this.loadingLabel.anchor.setTo(0.5, 0.5);

    // load the game assets
    this.load.image('logo', 'assets/images/logo.gif');
    this.load.image('map', 'assets/images/fantasy_world_map.jpg');
    this.load.image('rectangle', 'assets/images/rectangle.png');
    this.load.image('ship', 'assets/sprites/airship.png');
    this.load.spritesheet('city', 'assets/sprites/circle.png', 24, 24, 2);
    this.load.spritesheet('soldier', 'assets/sprites/soldier.png', 32, 36, 45);
    
    // load cities json
    this.load.text("cities_data", "assets/json/cities.json");
    this.load.text("characters_data", "assets/json/characters.json");
};


/**
 * Creating the World State
 */  
Airship.LoadState.prototype.create = function () {
    // go to the Start state to start the game
    this.state.start('StartState');
};
