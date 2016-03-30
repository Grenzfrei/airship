"use strict";

var Airship = Airship || {},
    Phaser = Phaser || {};

/**
 * Represents the Ship Prefab.
 * @constructor
 * @param {Object} game_state - The game state object
 * @param {Object} ship_data - Collection of ship stats
 * @param {Object} ship_data.position - current x and y position of the ship
 */  
Airship.WorldState.Ship = function (game_state, ship_data) {
    
    this.game_state = game_state;
    
    // if no current ship position is given, initialise it
    var x = ship_data.position.x || 400,
        y = ship_data.position.y || 300;
    
    // crate the ship sprite
    Phaser.Sprite.call(this, this.game_state, x, y, 'ship', 1);
    this.anchor.setTo(0.5, 0.5);

    // enable physics for the ship
    this.game_state.game.physics.arcade.enable(this);
    
    // create the controls
    this.cursors = this.game_state.game.input.keyboard.createCursorKeys();
    
    // define ships speed
    this.speed = 350;
};

Airship.WorldState.Ship.prototype = Object.create(Phaser.Sprite.prototype);
Airship.WorldState.Ship.prototype.constructor = Airship.WorldState.Ship;


/**
 * Updating the Ship Prefab.
 * used for moving the ship
 */  
Airship.WorldState.Ship.prototype.update = function () {
    
    //  Reset the ships velocity (movement)
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    
    if (this.cursors.left.isDown){
      //  Move to the left
      this.body.velocity.x = -this.speed;
      // turn ship to the left
      this.angle = 90;
    
      // if ship leaves stage to the left, let it reappear from the right
      if(this.x <= 0)
      {
        this.x =  this.game_state.world._width;
      }
    }
    else if (this.cursors.right.isDown){
      //  Move to the right
      this.body.velocity.x = this.speed;
      // turn ship to the right
      this.angle = 270;
    
      // if ship leaves stage to the right, let it reappear from the left
      if(this.x >=  this.game_state.world._width)
      {
        this.x = 0;
      }
    
    }
    else if (this.cursors.up.isDown){
      //  Move to the right
      this.body.velocity.y = -this.speed;
      // turn ship to the top
      this.angle = 180;
    
      // if ship leaves stage to the top, let it reappear from the bottom
      if(this.y <= 0 )
      {
        this.y =  this.game_state.world._height;
      }
    
    }
    else if (this.cursors.down.isDown){
      //  Move to the right
      this.body.velocity.y = this.speed;
      // turn ship to the bottom
      this.angle = 0;
    
      // if ship leaves stage to the bottom, let it reappear from the top
      if(this.y >=  this.game_state.world._height)
      {
        this.y = 0;
      }
    
    }
}


