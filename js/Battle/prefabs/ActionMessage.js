"use strict";

var Airship = Airship || {},
    Phaser = Phaser || {};

/**
 * Represents the ActionMessage Prefab.
 * @constructor
 * @param {Object} game_state - The current game state object
 * @param {string} message_text - The text to be displaed
 * @param {number} wait_time - number of seconds to wait before killing message
 */  
Airship.BattleState.ActionMessage = function (game_state, message_text, wait_time) {
    
    // get the game state from the constructor
    this.game_state = game_state;

    // create message text
    this.game_state.message = this.game_state.add.text(400, 32, message_text, this.game_state._fontStyle);
    this.game_state.message.anchor.setTo(0.5);

    // start timer to destroy the message
    this.kill_timer = this.game_state.game.time.create();
    this.kill_timer.add(Phaser.Timer.SECOND * wait_time, this.kill, this);
    this.kill_timer.start();
};

Airship.BattleState.ActionMessage.prototype = Object.create(Phaser.Text.prototype);
Airship.BattleState.ActionMessage.prototype.constructor = Airship.BattleState.ActionMessage;


/**
 * Called when timer is killed
 * @callback
 */  
Airship.BattleState.ActionMessage.prototype.kill = function () {
    // when the message is destroyed, call next turn
    this.game_state.message.kill();
    this.game_state.nextTurn();
};
