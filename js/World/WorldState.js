"use strict";

var Airship = Airship || {},
    Phaser = Phaser || {};

/**
 * Represents the World State.
 * @constructor
 */
Airship.WorldState = function () { 
  Phaser.State.call(this);
};

Airship.WorldState.prototype = Object.create(Phaser.State.prototype);
Airship.WorldState.prototype.constructor = Airship.WorldState;

/**
 * Initialising the World State
 * @param {Object} game_data - Collection of all game objects stats
 * @param {Object} game_data.characters - stats of the characters
 * @param {Object} game_data.ship - stats of the players ship
 * @param {Object} game_data.cities - stats of the world map cities
 */  
Airship.WorldState.prototype.init = function (game_data) {
  
  var characters_data = JSON.parse(this.game.cache.getText("characters_data"));
  
  // initialize object for storing all game stats if not already set
  this.game_data = game_data || {};
  
  // parse cities data json if there is no cities saved in game_data
  this.game_data.cities = this.game_data.cities || JSON.parse(this.game.cache.getText("cities_data"));
  
  // parse characters data json if there is no characters saved in game_data
  if(!this.game_data.characters) {
    this.game_data.characters = {};
    this.game_data.characters[0] = characters_data[0];
  }

  // if ship data is not already in game data, create ship data object
  if(!this.game_data.ship) 
  {
    this.game_data.ship = { 
      position: {}
    };
  }
};



/**
 * Creating the World State
 */  
Airship.WorldState.prototype.create = function () {
  
    // enable the Arcade Physics system
    this.physics.startSystem(Phaser.Physics.ARCADE);

    // load the background WorldState
    this.add.sprite(0, 0, 'map');
    
    // crate collection of groups
    this.groups = {};

    // add a group for the cities
    this.groups.cities = this.add.group();

    // create city prefabs from city data
    for (var city in this.game_data.cities)
    {
        this.groups.cities.add(new Airship.WorldState.City(this, this.game_data.cities[city]))
    }
    
    // add a ship (player) object to the center of the stage
    this.ship = new Airship.WorldState.Ship(this, this.game_data.ship);
    this.game.add.existing(this.ship);
}


/**
 * Updating the World State
 */  
Airship.WorldState.prototype.update = function () {
    //  Collide the ship with the cities
    this.game.physics.arcade.overlap(this.ship, this.groups.cities, this.visitCity, null, this);
}


/**
 * Rendering the World State
 */  
Airship.WorldState.prototype.render = function () {
    // Draw debug tools
    //game.debug.bodyInfo(this.ship, 32, 32);
    //game.debug.body(this.ship);
}


/**
 * Called when ship hits a city
 * @callback
 * @param {Object} ship - The players ship
 * @param {Object} city - The city that is hit 
 */
Airship.WorldState.prototype.visitCity = function (ship, city) {
  
    // debug message with name (key) of collided sprite
    this.game.debug.text('Truppen: ' + city.troops, city.x -40, city.y - 10);
    
    // go to battle when user presses enter and city has troops
    if (this.input.keyboard.isDown(Phaser.Keyboard.ENTER) && city.troops > 0)
    {
      // get index of the city which is visited
      var city_index = this.groups.cities.getChildIndex(city);
      
      // store the ships position in game data for later reference
      this.game_data.ship.position = {
          x: this.ship.x,
          y: this.ship.y
      };
           
      // go to the battle state
      this.state.start('BattleState', true, false, city_index, city, this.game_data);
    }
}