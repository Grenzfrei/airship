"use strict";

var Airship = Airship || {},
    Phaser = Phaser || {},
    PriorityQueue;
    
/**
 * Represents the Battle State.
 * @constructor
 */
Airship.BattleState = function (game) {
  
  Phaser.State.call(this);
  
  this._titleStyle = { font: "bold 32px Arial", fill: "yellow", boundsAlignH: "center", boundsAlignV: "middle" };
  this._fontStyle = { font: "bold 16px Arial", fill: "#fff", boundsAlignH: "center"};
  this._unitFontStyle = { font: "bold 14px Arial", fill: "#fff", boundsAlignH: "left" };
};

Airship.BattleState.prototype = Object.create(Phaser.State.prototype);
Airship.BattleState.prototype.constructor = Airship.BattleState;


/**
 * Initialising the Battle State
 * @param {string} city_index - Index of the visited city
 * @param {Object} city - vobject of visited city
 * @param {number} city.troops - Number of troops in visited city
 * @param {Object} city.position - x and y position of the city
 * @param {number} city.level - level of the city troops
 * @param {Object} game_data - Collection of all game objects stats
 * @param {Object} game_data.characters - stats of the characters
 * @param {Object} game_data.ship - stats of the players ship
 * @param {Object} game_data.cities - stats of the world map cities
 */  
Airship.BattleState.prototype.init = function (city_index, city, game_data) {

    // save objects in state
    this.city_index = city_index;
    this.city = city;
    this.characters = game_data.characters;
    this.game_data = game_data;
    
    // set the background color of the stage
    this.stage.backgroundColor = '#407C40';
}


/**
 * Preloading the Battle State
 */ 
Airship.BattleState.prototype.preload = function () {
    // load experience table
    this.load.text("exp_table", "assets/json/exp_table.json");
};


/**
 * Creating the Battle State
 */ 
Airship.BattleState.prototype.create = function () {
    
    // parse experience table
    this.exp_table = JSON.parse(this.game.cache.getText("exp_table"));

    // create groups for sprite objects
    this.groups = {};
    this.groups.enemies = this.add.group(); // enemy group
    this.groups.characters = this.add.group(); // character group

    // add the enemy troops
    for (var i = 0; i < this.city.troops; i++){
        // crate a new Enemy Object from prefab
        this.groups.enemies.add(new Airship.BattleState.Enemy(this, i*100, this.city.level))
    }

    // add the characters
    for (var key in this.characters) {
        // create a new Character Object from prefab
        this.groups.characters.add(new Airship.BattleState.Character(this, this.characters[key], key));
    }

    // create units array with player and enemy units
    this.units = [];
    this.units = this.units.concat(this.groups.characters.children);
    this.units = this.units.concat(this.groups.enemies.children);
    
   // this.units = _.sortBy(this.units, 'name');
    
     // store units in a priority queue which compares the units act turn
    this.units = new PriorityQueue({comparator: function (unit_a, unit_b) {
        return unit_a.act_turn - unit_b.act_turn;
    }});
    
    // calculate act turn for each character
    this.groups.characters.forEach(function (unit) {
        unit.calculateActTurn(0);
        this.units.queue(unit);
    }, this);
    
    // calculate act turn for each enemy
    this.groups.enemies.forEach(function (unit) {
        unit.calculateActTurn(0);
        this.units.queue(unit);
    }, this);


    // start first turn of battle
    this.nextTurn();
}


/**
 * Rendering the Battle State
 */ 
Airship.BattleState.prototype.render = function () {

    this.groups.enemies.forEachAlive(function(unit) {
      this.game.debug.text('HP:' + unit.stats.health, unit.x-30, unit.y - 30, '#ffffff');
      this.game.debug.text('Act:' + unit.act_turn, unit.x-30, unit.y + 45, '#ffffff');
    }, this)

    this.groups.characters.forEachAlive(function(unit) {
      this.game.debug.text('HP:' + unit.stats.health, unit.x-30, unit.y - 30, '#ffffff');
      this.game.debug.text('Act:' + unit.act_turn, unit.x-30, unit.y - 45, '#ffffff');
    }, this)
}


/**
 * Next turn of the Battle
 */ 
Airship.BattleState.prototype.nextTurn = function () {
    
    // if all enemies are dead, end the battle
    if (this.groups.enemies.countLiving() === 0) {
        this.endBattle();
        return;
    }
    
    // if all player characters are dead, game is over
    if (this.groups.characters.countLiving() === 0) {
        this.gameOver();
        return;
    }
    
    
     // first unit in queue takes the next turn
    this.current_unit = this.units.dequeue();
    // if the unit is alive, it acts, otherwise goes to the next turn
    if (this.current_unit.alive) {
        this.current_unit.act();
        // change piority queque according to new act turn
        this.current_unit.calculateActTurn(this.current_unit.act_turn);
        this.units.queue(this.current_unit);
    } else {
        this.nextTurn();
    }
};


/**
 * Called when all characters are dead
 * @callback
 */ 
Airship.BattleState.prototype.gameOver = function () {
    // go to the Game Over State
    this.game.state.start("GameOverState", true, false);
};


/**
 * Called when all enemies are dead
 * @callback
 */ 
Airship.BattleState.prototype.endBattle = function () {
    
    // set troops of defeated city to 0 in the game data collection
    this.game_data.cities[this.city_index].troops = 0;
    
    // set health of dead characters to 1 in game data collection
    for (var char in this.game_data.characters) {
        this.game_data.characters[char].health = 0 ? 1 : this.game_data.characters[char].health;
    }
    
    var received_experience = 0,
        rewards_text = '';
    
    // total experience = sum of experience for each enemy
    this.groups.enemies.forEach(function (enemy) {
        received_experience += enemy.reward.exp;
    }, this);
    
    // set rewards text for experience received
    rewards_text += 'Experience received: ' + received_experience + '\n';
    
    // receive battle reward
    this.groups.characters.forEach(function (character) {
        
        // receive experience from enemy
        var level_up = character.receiveExperience(received_experience),
            char_index = this.groups.characters.getChildIndex(character);
        
        // show level up message if character leveled up
        if(level_up){
            rewards_text += character.name + ' level up \n';
        }

        // save current party stats
        this.game_data.characters[char_index].stats = character.stats;
    }, this);
    
    // check if city has a new character unit
    if(this.city.character) {
        // parse character database
        var character_db = JSON.parse(this.game.cache.getText("characters_data")),
            new_character = _.findWhere(character_db, {name: this.city.character});
            
        rewards_text += '\n New Character added: ' + new_character.name + ', class: ' + new_character.class + '\n';
        
        switch(new_character.class) {
            case 'sword':
                rewards_text += '"Sword" class units are effective against "gun" class units \n';
                break;
            case 'shield':
                rewards_text += '"Shield" class units receive less damage from every unit class,\n but more damage from "gun" class units \n';
                break;
            case 'gun':
                rewards_text += '"Gun" class units are effective against "shield" class units, but receive more damage from "sword" class units \n';
                break;
        }
        
        this.game_data.characters[_.size(this.game_data.characters)] = new_character;
    }
    
    // create and show the rewards message
    this.message = this.add.text(this.game._width / 2, 32, "You won the battle!", this._titleStyle);
    this.message.anchor.setTo(0.5, 0);
    this.reward_message = this.add.text(this.game._width / 2, 80, rewards_text, this._fontStyle);
    this.reward_message.anchor.setTo(0.5, 0);

    // add a message text to the screen
    this.userMessage = this.game.add.text(this.game._width / 2, 500, "press 'x' to exit", this._fontStyle);
    this.userMessage.anchor.setTo(0.5, 0);
    
    // when the x key is pressed, call the nextState function
    this.exit_key = this.input.keyboard.addKey(Phaser.Keyboard.X);
    this.exit_key.onDown.addOnce(this.nextState, this);
};


/**
 * Called when the timer is killed
 * @callback
 */ 
Airship.BattleState.prototype.nextState = function () {
     // go back to WorldState 
    this.game.state.start("WorldState", true, false, this.game_data);
};


   