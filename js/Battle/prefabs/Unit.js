"use strict";

var Airship = Airship || {},
    Phaser = Phaser || {};
    
/**
 * Represents the Unit Prefab.
 * @constructor
 * @param {Object} game_state - The current game state object
 * @param {object} position - The x and y position for the sprite
 * @param {string} spritesheet - name of the spritesheet to use for the sprite
 * @param {number} frame - number of the frame to use from the spritesheet
 */  
Airship.BattleState.Unit = function (game_state, position, spritesheet, frame) {
    
    this.game_state = game_state;
    
    // create new Sprite Object
    Phaser.Sprite.call(this, game_state.game, position.x, position.y, spritesheet, frame);
    this.anchor.setTo(0.5);

    // set act turn of unit to 0
    this.act_turn = 0;
};
Airship.BattleState.Unit.prototype = Object.create(Phaser.Sprite.prototype);
Airship.BattleState.Unit.prototype.constructor = Airship.BattleState.Unit;


/**
 * Unit receives damage
 * @param {number} damage - number of damage received
 */ 
Airship.BattleState.Unit.prototype.receive_damage = function (damage) {
    
    // subtract damage from current health of unit
    this.stats.health -= damage;
    
    // unit dies if health is below 0
    if (this.stats.health <= 0) {
        this.stats.health = 0;
        this.die();
    }
};


/**
 * Unit attacks
 * @param {object} target - The targetet unit
 * @param {number} wait_time - number of seconds to wait until next turn
 */ 
Airship.BattleState.Unit.prototype.attack = function (target, wait_time) {
    
    var damage, damage_multiplier, action_message_text, attack_message, tweenTo, tweenBack;

    // calculate the damage
    damage_multiplier = this.game_state.game.rnd.realInRange(0.8, 1.2);
    damage = Math.round( damage_multiplier * (4 * this.stats.attack - 2 * target.stats.defense) );
    target.receive_damage(damage);

    // show attack message
    action_message_text = damage + " damage";
    attack_message = new Airship.BattleState.ActionMessage(this.game_state, action_message_text, wait_time);

    // animate the unit to the target and back
    tweenTo = this.game_state.game.add.tween(this).to( { x: target.x, y: target.y }, 50, Phaser.Easing.BackIn, false);
    tweenBack = this.game_state.game.add.tween(this).to( { x: this.startPosition.x, y: this.startPosition.y }, 50, Phaser.Easing.BackOut, false);
    tweenTo.chain(tweenBack);
    tweenTo.start();
};


/**
 * Unit dies
 */ 
Airship.BattleState.Unit.prototype.die = function () {
    this.status_text.destroy();
    Phaser.Sprite.prototype.kill.call(this);
};


/**
 * Calculate act turn of the unit
 * @param {number} current_turn - number of the current turn
 */ 
Airship.BattleState.Unit.prototype.calculateActTurn = function (current_turn) {
    // calculate the act turn based on the unit speed
    this.act_turn = current_turn + Math.ceil(100 / this.stats.speed);
}
