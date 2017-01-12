
/**
 * @fileoverview  Provide the Avatar class.
 * @author scott@scottlininger.com (Scott Lininger)
 */


/**
 * Constructor for the Avatar class, the guy who walks around the map.
 * @constructor
 * @extends {ace.BaseClass}
 */
ace.Avatar = function(game, room) {
  ace.base(this, game, room);
  this.imgSrc = 'img/avatar.png';
  this.width = 16;
  this.height = 16;
  this.hitWidth = 10;
  this.hitHeight = 10;
  this.name = 'Avatar';

  this.hitPoints = 3;
  this.maxHitPoints = 3;

  this.invincibleCounter = 0;
  this.invincibleCounterOnHurt = 40;

  // Which item we think we have equipped.
  this.currentItem = 'boomerang';

/*
// Original starting location. StartScreen in overworld.js needs to match.
    this.x = 32;
    this.y = 32;
    */

  this.x = 16 * 4;
  this.y = 16 * 4;
  this.z = 0;

  // If larger than 0, we're "sword cursed" from a bubble.
  this.swordCurseCounter = 0;

  this.facing = 'down';
  this.isLeavingCave = false;

/*
  // puts you up near the top of the overworld.
   this.x = 2590;
  this.y = 1306;

  // This puts you in the lower-left

  this.x = 16 * 4;
  this.y = 16 * 4;
  this.x =  -1000 + 120
  this.y =  -1000 + 72
*/
	//this.x = 2720;
  //this.y = 1120;

  // That weird spot where you have to walk up many times
  //this.x = 2936;
  //this.y = 1187;

  // Cave way up in the corner.
  //this.x = 3674;
	//this.y = 1313;

  // Entry to dungeon 1:
	//this.x = 1924;
	//this.y = 765;

	// Fairy lake
	//this.y = 839
	//this.x = 2390

	// Top left of world
	//this.x = 1094;
	//this.y = 1301;

	// Lake above waterfall
	//this.x = 2618;
	//this.y = 1289;

  // Fairy lake
  //this.x = 894;
  //this.y = 580;

	// Jumbly rock pile.
	//this.x = 1586;
	//this.y = 870;

	// By the Zora
	//this.x = 2116;
  //this.y = 588;

  // Boulders
  //this.x = 2146
  //this.y = 1127



  this.rotZ = 0; //1892;
  this.zOffset = 0;

  this.walkSpeed = 4;
  this.diagonalWalkSpeed = 2;
  this.swordDamage = 1;
  this.showSwordCountReset = 3;
  this.shieldDownCountReset = 4;
  this.showSwordCount = 0;
  this.shieldDownCount = 0;
  this.swordLength = 33;

  this.facing = 'down';
  this.action = 'Walk';
  this.walkFrame = 0;
};
ace.inherits(ace.Avatar, ace.Actor);


/**
 * What to do every frame.
 * @param {ace.Game} The game.
 */
ace.Avatar.prototype.onTick = function(game) {

  if (game.isStartScreen()) {
    // Don't do anything during the start screen.
    return;
  }

  if (this.hitPoints <= 0) {
    // Death animation.
    if (this.hitPoints > -999) {
      game.playSound('gameover');
      this.deathCount = 0;
      game.stopSound('underworld');
      game.stopSound('overworld');
    }
    this.hitPoints = -999;
    this.deathCount += 1;
    this.rotZ = this.deathCount / 2;
    this.draw('playerstand');

    var redLength = 75;
    game.engine.drawLight($('light-red'), this.x, this.y,512,
                          Math.min(.8, this.deathCount / redLength));

    if (this.deathCount == redLength) {
      document.getElementById('game-over-wrapper').className = 'visible';
      document.getElementById('game-over-wrapper').style.zIndex = 5000;
    }

    return;
  }

  if (this.pickingUp) {
    var dz = 16;
    if (game.currentRoom_.isSideScroll) {
      dz = 0;
    } else {
      this.rotX = 0;
    }
    var itemInfo = ace.itemInfoBySpriteName[this.pickingUp]
    if (itemInfo && itemInfo.isOneHanded) {
      this.draw('linkyay');
      this.draw(this.pickingUp, [this.x - 2, this.y + 4, this.z + dz -.5 + this.zOffset]);
    } else {
      this.draw('linkyay2');
      this.draw(this.pickingUp, [this.x, this.y, this.z + dz + this.zOffset]);
    }

    // If we're picking up a triforce piece, this counter
    // will have a number in it. We'll use that to animate
    // the appropriate light flashes.
    if (this.triforceAnimationCount) {
      this.zOffset = Math.abs(Math.cos(this.triforceAnimationCount / 4)) * 3 + 1;
      var flashFrames = {1:true, 30: true, 32: true, 40:true, 42:true, 50:true, 52:true,  70:true, 72:true};
      this.triforceAnimationCount++;
      game.engine.drawLight($('light-star'), this.x + 70, this.y+60, 200, 1, this.triforceAnimationCount / 10);
      if (flashFrames[this.triforceAnimationCount]) {
        game.engine.drawLight($('light-lantern'), this.x, this.y,500);
        game.engine.drawLight($('light-lantern'), this.x, this.y,500);
        game.engine.drawLight($('light-star'), this.x, this.y,100);
      }
      if (this.triforceAnimationCount > 170) {
        this.triforceAnimationCount = false;
        this.zOffset = 0;
      }
    }

    game.engine.drawLight($('light-lantern'), this.x, this.y,100);
    return;
  }

  if (this.raftDirection) {
    this.rotZ = ace.getRotZByFacing(this.raftDirection);
    this.z = -6;
    this.invincibleCounter = 1;
    this.renderNegativeColor = false;

    this.draw('playerstand');
    this.draw('raft', [this.x, this.y+8, -6], this.rotZ, Math.PI/2);
    var raftSpeed = 2;
    this.x += raftSpeed * ace.xMultByFacing[this.raftDirection];
    this.y += raftSpeed * ace.yMultByFacing[this.raftDirection];
    var isGround = game.getWorldZ(this.x, this.y) > -1;
    if (isGround) {
      this.raftDirection = null;
      this.invincibleCounter = 0;
    }
    return;
  }

  if (game.currentRoom_ && game.currentRoom_.isSideScroll) {
    this.rotX = -1.6;
    this.zOffset = 0;
    this.yOffset = -10;
    this.z = -1000 + 16;
  } else if (this.isInUnderworld()) {
    this.rotX = -.2;
    this.zOffset = 0;
    this.yOffset = 0;
    this.z = -1008;
  } else {
    this.rotX = -.1;
  }

  var dx = 0;
  var dy = 0;
  var isWalking = false;

  // Handle invincibility!
  if (this.invincibleCounter > 0) {
    this.invincibleCounter--;
    this.renderNegativeColor = !this.renderNegativeColor;
  } else if (this.renderNegativeColor != false) {
    this.renderNegativeColor = false;
  }

  var swordX, swordY, swordZ;
  swordX = this.x + 13 * ace.xMultByFacing[this.facing];
  swordY = this.y + 13 * ace.yMultByFacing[this.facing];
  var swordOffsetFacing = ace.getClockwiseFacing(this.facing);
  swordX -= 1 * ace.xMultByFacing[swordOffsetFacing];
  swordY -= 1 * ace.yMultByFacing[swordOffsetFacing];
  swordZ = this.z - 2;

  if (this.showSwordCount > 0) {

    this.draw('woodensword', [swordX, swordY, swordZ], this.rotZ, 0.001, 0.001);
    this.showSwordCount--;
    if (this.showSwordCount == 0) {
      //this.setFrame('Walk' + this.facing + '1');
    }
  }
  if (this.shieldDownCount > 0) this.shieldDownCount--;

  if (!this.isFrozen) {

		if (game.keyIsDown(ace.KEY_LEFT) || game.keyIsDown('a')) {
			dx -= this.walkSpeed;
			this.facing = 'left';
			isWalking = true;
		}
		if (game.keyIsDown(ace.KEY_RIGHT) || game.keyIsDown('d')) {
			dx += this.walkSpeed;
			this.facing = 'right';
			isWalking = true;
		}
		if (game.keyIsDown(ace.KEY_UP) || game.keyIsDown('w')) {
			dy += this.walkSpeed;
			this.facing = 'up';
			isWalking = true;
		}
		if (game.keyIsDown(ace.KEY_DOWN) || game.keyIsDown('s')) {
			dy -= this.walkSpeed;
			this.facing = 'down';
			isWalking = true;
		}

		// If your sword is out, you can't walk.
		// Also, of we have a zOffset, it means we're on some cave stairs.
		// In such a case, don't allow walking.
		if (isWalking && this.showSwordCount == 0 && this.zOffset >= 0) {
			//var tile = this.getTileAt(this.x, this.y, this.z);

			// It's possible to ask for the tile off screen, so assume a normal
			// walkspeed.
			var walkSpeedFactor = 1;
			var dx = Math.round(dx * walkSpeedFactor);
			var dy = Math.round(dy * walkSpeedFactor);

			if (dx != 0 && dy != 0) {
				dx = (dx / this.walkSpeed) * this.diagonalWalkSpeed;
				dy = (dy / this.walkSpeed) * this.diagonalWalkSpeed;
			}
			if (!this.canWalk(dx, 0)) {
				dx = 0;
			}
			if (!this.canWalk(0, dy)) {
				dy = 0;
			}

			this.x += dx;
			this.y += dy;
		}

		if (game.keyWasPressed('z') || game.keyWasPressed('k')) {
		  // We just spawn whatever is equipped and let the actors handle it.
      if (this.currentItem == 'boomerang') {
        if (this.hasInventory('boomerang')  && !this.isThrowingBoomerang()) {
          var opts = {x: this.x, y: this.y, facing: this.facing, z: this.z};
          game.playSound('boomerang');
					game.spawn('FlyingBoomerang', opts);
        }
      }
      if (this.currentItem == 'bomb') {

        // TODO(scott): Does LOZ limit the number of bombs you can have on the screen?
        if (this.hasInventory('bomb')) {
          var bombDx = 12 * ace.xMultByFacing[this.facing];
          var bombDy = 12 * ace.yMultByFacing[this.facing];
          var opts = {x: this.x + bombDx, y: this.y + bombDy, z: this.z};
          game.playSound('bombdrop');
          this.changeBombs(-1);
					game.spawn('Bomb', opts);
        }
      }
      if (this.currentItem == 'whistle') {
        game.playSound('flute');
        game.currentRoom_.whistleHasBeenBlown = true;
      }
      console.log(this.currentItem);

		}

    if (this.swordCurseCounter > 0) {
		  this.swordCurseCounter--;
	  }

		if ((game.keyWasPressed(ace.KEY_SPACE) || game.keyWasPressed('x') || game.keyWasPressed('l'))
		     && this.swordCurseCounter <= 0 && (this.hasInventory('itemwoodensword'))) {
			game.playSound('sword');

			this.showSwordCount = this.showSwordCountReset;
			this.shieldDownCount = this.shieldDownCountReset;
			var hitSomething = this.hitWithSword(game);

			if (!hitSomething && this.hitPoints == this.maxHitPoints) {
				game.playSound('swordshoot');
				if (this.flyingSword) {
					if (this.flyingSword.isHidden) {
						this.flyingSword.hasJustSpawned = true;
						this.flyingSword.x = this.x;
						this.flyingSword.y = this.y;
						this.flyingSword.facing = this.facing;
						this.flyingSword.unhide();
					}
				} else {
					var opts = {x: swordX, y: swordY, facing: this.facing, z: swordZ};
					this.flyingSword = game.spawn('FlyingSword', opts);
				}
			}
		}

		// Handle walking on steep things.
	  this.z = game.getWorldZ(this.x, this.y);

		if (isWalking) {
			var framesPerStep = 8;
			this.walkFrame = (this.walkFrame % framesPerStep) + 1;
		}

		// Assume the avatar is always the first one.
		for (var i = 1; i < game.actors.length; i++) {
			var actor = game.actors[i];
			if (!actor.hidden && !actor.cloudFrames && this.isTouching(actor)) {
				actor.onTouchAvatar(game);
			}
		}

		this.rotZ = ace.getRotZByFacing(this.facing);
  }

  if (this.showSwordCount > 0) {
    //this.z -= 1;
    this.draw('linkstab');
    if (game.currentRoom_.isSideScroll) {
      this.yOffset += 1;
    }
  } else if (isWalking) {
      this.draw('playerwalk' + Math.ceil(this.walkFrame/2));
  } else {
    this.walkFrame = 0;
    this.draw('playerstand');
  }

  // Now render his shadow into the light map.
  if (this.isInUnderworld()) {
    game.engine.drawLight($('light-lantern'), this.x, this.y,100);
  } else {
    //game.engine.drawLight($('shadow-round'), this.x + 8, this.y + 4,16);
  }
};


/**
 * Hit every actor our sword is on.
 * @param {ace.game} The game game.
 */
ace.Avatar.prototype.hitWithSword = function(game) {
  var multX = ace.xMultByFacing[this.facing];
  var multY = ace.yMultByFacing[this.facing];

  var xAtTip = this.x + this.swordLength * multX;
  var yAtTip = this.y + this.swordLength * multY;

  var xAtHilt = this.x + this.swordLength / 2 * multX;
  var yAtHilt = this.y + this.swordLength / 2 * multY;

  // Avatar is always actor[0], so start at 1.
  var hitSomething = false;
  for (var i = 1; i < game.actors.length; i++) {
    var actor = game.actors[i];

		var itemCanBeStruck = (actor.hitPoints && actor.hitPoints < 0);

    if (actor.isHitAt(xAtTip, yAtTip) || actor.isHitAt(xAtHilt, yAtHilt)) {
      if (actor.name == 'coin') {
        if (itemCanBeStruck) {
					this.changeCoins(1);
					actor.hide();
				}
      } else if (actor.name == 'heart') {
        if (itemCanBeStruck) {
					this.changeHitPoints(1);
					actor.hide();
				}
      } else if (actor.name == 'key') {
				if (itemCanBeStruck) {
					this.changeKeys(1);
					actor.hide();
				}
      } else if (actor.name == 'bomb') {
				if (itemCanBeStruck) {
					this.changeBombs(1);
					actor.hide();
				}
      } else {
        if (actor.hitPoints && actor.hitPoints > 0) {
          hitSomething = true;
        }
        actor.lastSwordHitFacing = this.facing;
        hitSomething = actor.takeDamage(this.swordDamage, this.facing);
      }
    }
  }
  if (hitSomething) game.playSound('hit');
  return hitSomething;
};


/**
 * Applies damage to my this.hitPoints value.
 * @param {number} damage The damage to apply.
 */
ace.Avatar.prototype.takeDamage = function(damage) {
  if (this.invincibleCounter > 0) {
    return;
  }
  game.playSound('hurt');
  this.invincibleCounter = this.invincibleCounterOnHurt;
  this.hitPoints -= damage;

  // If there's a ?debug on the query string, don't allow
  // link to die.
  if (('' + window.location).indexOf('debug') > -1 && this.hitPoints < .5) {
    this.hitPoints = .5;
  }

  if (damage != 0) {
    this.refreshHealthBeeps();
  }
};



/**
 * Return whether I have my shield up.
 * @param {string} The direction the attack is *moving*.
 * @return {boolean} Whether my shield is up.
 */
ace.Avatar.prototype.shieldIsUp = function(direction) {
  var isFacingAttack = ace.areOppositeFacings(this.facing, direction);
  return (isFacingAttack && this.shieldDownCount == 0);
};


/**
 * Changes the number of coins I have
 * @param {number} coins The count.
 */
ace.Avatar.prototype.changeCoins = function(coins) {
  game.state.coins += coins;
  game.playSound('coin');
};


/**
 * Changes the number of hitPoints I have. This is subtlely different
 * than takeDamage. Use it for positive improvements.
 * @param {number} points The count.
 */
ace.Avatar.prototype.changeHitPoints = function(points) {
  this.hitPoints = Math.min(this.hitPoints += points, this.maxHitPoints);
  game.playSound('heart');
  this.refreshHealthBeeps();
};


/**
 * Play the health beep if we're almost dead.
 */
ace.Avatar.prototype.refreshHealthBeeps = function() {
  if (this.hitPoints <= 1 && this.hitPoints > 0) {
    game.stopSound('health');
    game.playSound('health', {'loops': 9999999, volume:100});
  } else {
    game.stopSound('health');
  }
};


/**
 * Changes the number of hitPoints I have. This is subtlely different
 * than takeDamage. Use it for positive improvements.
 * @param {number} points The count.
 */
ace.Avatar.prototype.changeMaxHitPoints = function(points) {
  this.maxHitPoints += points;
  this.hitPoints = this.maxHitPoints;
  game.state.maxHitPoints = this.maxHitPoints;
  game.playSound('item');
  this.refreshHealthBeeps();
};


/**
 * Changes the number of keys I have.
 * @param {number} points The count.
 */
ace.Avatar.prototype.changeKeys = function(keys) {
  game.state.keys += keys;
  if (keys > 0) {
    game.playSound('heart');
  }
};

/**
 * Changes the number of bombs I have.
 * @param {number} points The count.
 */
ace.Avatar.prototype.changeBombs = function(bombs) {
  game.state.bombs += bombs;
  if (bombs > 0) {
    game.playSound('heart');
  }
};

/**
 * Whether the avatar is at max hits.
 * @return {boolean} True if we're at max hit points.
 */
ace.Avatar.prototype.isMaxHitPoints = function() {
  return this.hitPoints >= this.maxHitPoints;
};




/**
 * Whether the avatar has a given inventory item.
 * @return {boolean} True if we have that item.
 */
ace.Avatar.prototype.hasInventory = function(item) {
  if (item == 'bomb') {
    return game.state.bombs;
  }
  return game.state.inventory[item];
};


/**
 * Whether we're currently throwing a boomerang.
 * @return {boolean} True if we're throwing one.
 */
ace.Avatar.prototype.isThrowingBoomerang = function() {
  for (var i = 0; i < game.actors.length; i++) {
    if (game.actors[i].name.indexOf('FlyingBoomerang') > -1 &&
        game.actors[i].isHidden == false) {
      return true;
    }
  }
  return false;
};


/**
 * Whether the avatar is at max hits.
 * @return {boolean} True if we're at max hit points.
 */
ace.Avatar.prototype.pickUp = function(item, teleportTo) {

	if (item == 'compass') {
	  game.state.hasCompassByDungeon = game.state.hasCompassByDungeon || {};
	  game.state.hasCompassByDungeon[game.currentDungeon_.name] = true;
	  game.playSound('item');
	  return;
	}
	if (item == 'map') {
	  game.state.hasMapByDungeon = game.state.hasMapByDungeon || {};
	  game.state.hasMapByDungeon[game.currentDungeon_.name] = true;
	  game.playSound('item');
	  return;
	}

	var pause = 2000;
	if (item == 'triforcepiece') {
	  game.stopSound('underworld');
	  game.playSound('triforce');
	  pause = 8500;
	  this.triforceAnimationCount = 1;
	} else {
		game.playSound('fanfare');
	  game.playSound('item');
	}
  game.state.inventory[item] = game.state.inventory[item] || 0;
  game.state.inventory[item]++;

  this.pickingUp = item;
  this.facing = 'down';

  if (item == 'magicalboomerang') {
    this.pickingUp = 'boomerang_blue';
  }

  var oldEyeOffset = game.currentRoom_.cameraEyeOffset;
  var oldTargetOffset = game.currentRoom_.cameraTargetOffset;

  // Things are different when side scrolling.
  if (game.currentRoom_.isSideScroll) {
    game.currentRoom_.cameraEyeOffset = [0,90,-130];
    this.rotZ = -.3;
  } else {
    game.currentRoom_.cameraEyeOffset = [-50,65,-190];
    game.currentRoom_.cameraTargetOffset = [0, 0, 15];
    this.rotZ = -1;
  }

  // To make him float just a hair off the ground.
  this.zOffset = .5;
  this.walkFrame = 1;

  setTimeout(function() {
		game.currentRoom_.cameraEyeOffset = oldEyeOffset;
		game.currentRoom_.cameraTargetOffset = oldTargetOffset;
		game.avatar.rotZ = 0;
		game.avatar.zOffset = 0;
  }, pause);

  setTimeout(function() {
  	game.avatar.pickingUp = false;
  }, pause + 200);

  if (teleportTo) {
		setTimeout(function() {
			game.avatar.x = teleportTo[0];
			game.avatar.y = teleportTo[1];
			game.avatar.z = teleportTo[2];
			game.avatar.isLeavingCave = true;
			game.setCameraEye(game.avatar.x, game.avatar.y, game.avatar.z + 1);
			game.setCameraTarget(game.avatar.x, game.avatar.y, game.avatar.z);
		}, pause + 200);
	}
};


/**
 * Sets the avatar a sailing.
 * @param {string} The direction to go.
 */
ace.Avatar.prototype.takeRaft = function(direction) {
  if (!this.raftDirection) {
    this.raftDirection = direction;
    game.playSound('secret');
  }
};
