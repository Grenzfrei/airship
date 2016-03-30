"use strict";

var Airship = Airship || {},
    Phaser = Phaser || {};

/**
 * Represents the Game Over State.
 * @constructor
 */
Airship.GameOverState = function (game) {
  
  Phaser.State.call(this);

  // define font styles
  this._fontStyle = { font: "bold 20px Arial", fill: "#fff" };
  this._titleStyle = { font: "bold 36px Arial", fill: "#f00" };
};

Airship.GameOverState.prototype = Object.create(Phaser.State.prototype);
Airship.GameOverState.prototype.constructor = Airship.GameOverState;


/**
 * Creating the Game Over State
 */  
Airship.GameOverState.prototype.create = function () {
    
    // set the background color of the stage
    this.stage.backgroundColor = '#000';
    
    // add a gameover text to the screen
    this.subTitle = this.game.add.text(this.game._width / 2, 250, "GAME OVER", this._titleStyle);
    this.subTitle.anchor.setTo(0.5, 0.5);
    
    // add a message text to the screen
    this.userMessage = this.game.add.text(this.game._width / 2, 400, "press 'x' to go back to Menu Screen", this._fontStyle);
    this.userMessage.anchor.setTo(0.5, 0.5);
    
    // listen for the 'x' key to be pressed
    this.backKey = this.input.keyboard.addKey(Phaser.Keyboard.X);
    
    // when the w key is pressed, call the nextState function
    this.backKey.onDown.addOnce(this.nextState, this);
};
  
  
/**
 * Go to the start menu state to restart the game
 * Called when user presses the backKey
 * @callback
 */  
Airship.GameOverState.prototype.nextState = function () {
    this.state.start('StartState');
};
