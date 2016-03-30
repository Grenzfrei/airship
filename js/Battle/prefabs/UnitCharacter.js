"use strict";

var Airship = Airship || {},
    Phaser = Phaser || {};

/**
 * Represents the Character units Prefab.
 * @constructor
 * @param {Object} game_state - The current game state object
 * @param {object} character_data - Collection of the characters data
 * @param {object} character_data.stats - collection of the characters stats
 * @param {string} character_data.name - name of the character
 * @param {object} character_data.startPosition - x and y initial position
 * @param {number} character_index - index of character for positioning
 */  
Airship.BattleState.Character = function (game_state, character_data, character_index) {

    // set character data
    for (var data in character_data) {
        this[data] = character_data[data];
    }
    
    // set the characters start positions
    this.startPosition = {x: 100 + character_index * 150, y: 350 };
    
    // initialize current health to the characters max health
    this.stats.health = character_data.stats.health || character_data.stats.max_health;
    
    // create new object from Unit Prefab
    Airship.BattleState.Unit.call(this, game_state, {x: this.startPosition.x, y: this.startPosition.y}, 'soldier', 18);
    
    // show the stats
    this.showStats();
};
Airship.BattleState.Character.prototype = Object.create(Airship.BattleState.Unit.prototype);
Airship.BattleState.Character.prototype.constructor = Airship.BattleState.Character;


/**
 * Character unit acts
 */ 
Airship.BattleState.Character.prototype.act = function () {

    // shift unit to highlight
    this.y += 10;
    
    // prompt message for player to take action
    this.game_state.message = this.game_state.add.text(400, 32, "click enemy to attack", this.game_state._fontStyle);
    this.game_state.message.anchor.setTo(0.5);
    
    // enable click on all alive enemy units
    this.game_state.groups.enemies.forEachAlive(function(unit) {
        unit.inputEnabled = true;
        unit.input.useHandCursor = true;
    }, this);
};



/**
 * Show Character unit stats
 */ 
Airship.BattleState.Character.prototype.showStats = function () {
    
    var status_text = this.name + ' Lvl ' + this.stats.current_level + '\n class: ' + this.class + '\n';
    
    // show all stats
    for (var stat in this.stats) {
        status_text += stat + ': ' + this.stats[stat] + '\n ';
    }

    // show stats of the character on the stage
    this.status_text = this.game_state.add.text(this.startPosition.x-32, this.startPosition.y+40, status_text, this.game_state._unitFontStyle);
};



/**
 * Character receives experience
 * @param {number} exp - number of experience the character receives
 * @return {boolean} - wether character has leveled or not
 */ 
Airship.BattleState.Character.prototype.receiveExperience = function (exp) {
  
    var next_level_data, stat;
    
    // increase experience
    this.stats.exp += exp;
    next_level_data = this.game_state.exp_table[this.stats.current_level - 1];
    
    // if current experience is greater than the necessary to the next level, the unit gains a level
    if (this.stats.exp >= next_level_data.required_exp) {
        this.stats.current_level += 1;
        this.stats.exp = this.stats.exp - next_level_data.required_exp;
        
        // increase unit stats according to new level
        for (stat in next_level_data.stats_increase) {
            if (next_level_data.stats_increase.hasOwnProperty(stat)) {
                this.stats[stat] += next_level_data.stats_increase[stat];
            }
        }
        
        // set full health
        this.stats.health = this.stats.max_health;
        
        // return that character has leveled
        return true;
        
    }else {
        // return that character has not leveled
        return false;
    }
};

