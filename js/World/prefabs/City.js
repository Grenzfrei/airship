"use strict";

var Airship = Airship || {},
    Phaser = Phaser || {};
    
    
/**
 * Represents the City Prefab.
 * @constructor
 * @param {Object} game_state - The game state object
 * @param {Object} city_data - Collection of city stats
 * @param {number} city_data.troops - number of troops in the city
 * @param {Object} city_data.position - x and y posiction of the city
 */  
Airship.WorldState.City = function (game_state, city_data) {
    
    // set city data
    for (var data in city_data) {
        this[data] = city_data[data];
    }
    
    // determin frame of sprite based on wether city has troops
    // no troops: green
    // troops: red
    var frame = this.troops > 0 ? 0 : 1;

    // create city as new Sprite Object
    Phaser.Sprite.call(this, game_state, city_data.position.x, city_data.position.y, 'city', frame);

    // enable physics for collision
    game_state.physics.arcade.enable(this);
};

Airship.WorldState.City.prototype = Object.create(Phaser.Sprite.prototype);
Airship.WorldState.City.prototype.constructor = Airship.WorldState.City;
