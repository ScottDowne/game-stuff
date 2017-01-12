/**
 * @fileoverview  Provide the Game class. This is the top-level object that
 *    orchestrates everything else.
 * @author scott@scottlininger.com (Scott Lininger)
 */


/**
 * Constructor for the game class, the thing that runs a game.
 * @param {ace.Game} game The game to run.
 * @param {HtmlElement} div The div to run in.
 * @param {Object=} opt_settings An optional hash with settings to adopt.
 * @constructor
 * @extends {ace.BaseClass}
 */
ace.Game = function(divId, opt_settings) {
  var settings = settings || {};
  /**
   * The document.
   */
  this.document = settings['document'] || document;

  /**
   * The window.
   */
  this.window = settings['window'] || window;

  /**
   * Pointer to the Engine class.
   * @type {ace.EngineVoxel}
   */
  this.engine =  settings['engine'] || new ace.EngineVoxel(divId, opt_settings);



  this.engine.registerVoxelSprites([
    ['playerstand', 'img/player.png', 0],
    ['playerwalk1', 'img/player.png', 1],
    ['playerwalk2', 'img/player.png', 0],
    ['playerwalk3', 'img/player.png', 2],
    ['playerwalk4', 'img/player.png', 0],

    ['forest_rock_bl', 'img/forest_rock_bl.png'],
    ['forest_rock_br', 'img/forest_rock_br.png'],
    ['forest_rock_t', 'img/forest_rock_t.png'],
    ['forest_rock', 'img/forest_rock.png'],
    ['forest_rock_tl', 'img/forest_rock_tl.png'],
    ['forest_rock_tr', 'img/forest_rock_tr.png'],

    ['ow_rock_bl', 'img/ow_rock_bl.png'],
    ['ow_rock_br', 'img/ow_rock_br.png'],
    ['ow_rock', 'img/ow_rock.png'],
    ['ow_rock_t', 'img/ow_rock_t.png'],
    ['ow_rock_tl', 'img/ow_rock_tl.png'],
    ['ow_rock_tr', 'img/ow_rock_tr.png'],

    ['ow_sand', 'img/ow_sand.png'],
    ['ow_ground', 'img/ow_sand.png'],
    ['ow_path', 'img/ow_path.png']
  ], () => {
    this.engine.canvas.display = 'block';
    $('game-container').style.backgroundImage = 'none';
    if (top.onGraphicsLoaded) {
      top.onGraphicsLoaded();
    }
  });

  this.tileMap = [[
    [82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82],
    [82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82],
    [82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82],
    [82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82],
    [82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82],
    [82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82],
    [82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82],
    [82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82],
    [82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82],
    [82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82],
    [82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82]
  ], [
    [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10],
    [10,16,16,16,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,10,16,16,16],
    [10,16,16,68, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,63,10,10,16,16,68, 0, 0, 0, 0, 0, 0, 0, 0, 0,68,10,10],
    [10,16,68, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10,10,16,68, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,68,10,10],
    [10,68, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,63,10,68, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10],
    [10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10],
    [10,13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,28,10,10,13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10],
    [10,10,13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10,10,10,10,13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10],
    [10,10,10,13, 0, 0, 0, 0, 0, 0, 0, 0, 0,28,10,10,10,10,10,13, 0, 0, 0, 0, 0, 0, 0, 0, 0,28,10,10],
    [10,10,10,10,10,10,10,10,11,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,16,10,10,10,10,10,10,10],
    [10,10,10,10,10,10,10,10,16,16,16,16,16,16,16,16,10,10,10,10,10,10,10,10,16,16,16,16,16,16,16,16]
  ]];

  this.heightMap = ace.generateHeightMap(this.tileMap);

  this.tileNamesById = {
    '0': 'nothing',
    '66': 'forest_rock_t',
    '3': 'forest_rock_tl',
    '75': 'forest_rock_tr',
    '5': 'forest_rock_br',
    '8': 'forest_rock_bl',
    '10': 'forest_rock',
    '55': 'ow_rock_t',
    '13': 'ow_rock_br',
    '28': 'ow_rock_bl',
    '63': 'ow_rock_tl',
    '68': 'ow_rock_tr',
    '16': 'ow_rock',
    '82': 'ow_ground',
    '11': 'ow_path'
  };

  this.isWalkableByName = {
    'nothing': true,
    'ow_ground': true,
    'ow_path': true
  };

  /**
   * The div we're running in.
   * @type {HTMLElement}
   */
  this.div = this.document.getElementById(divId);

  /**
   * How many frames per second.
   * @type {number}
   */
  this.frameRate = settings.frameRate || 20;

  /**
   * Length of each frame in milliseconds.
   * @type {number}
   */
  this.frameLength = 1000 / this.frameRate;

  /**
   * A hash of booleans by keyCode
   * @type {Object}
   */
  this.keyIsDown_ = {};

  /**
   * A hash of booleans by keyCode. This will be reset to empty every frame.
   * @type {Object}
   */
  this.keyWasPressed_ = {};

  /**
   * Whether we're scrolling.
   */
  this.isScrolling = false;

  /**
   * The avatar.
   */
  this.avatar = new ace.Avatar(this);

  /**
   * A list of all of the active actors in this room.
   */
  this.actors = [this.avatar];

  /**
   * A hash of sounds by sound name.
   */
  this.sounds = {}

  /**
   * We'll keep track of whether it's an "blink" frame, which will
   * come up once every few frames. This is helpful since @ 20fps, one
   * frame blinking animation is too fast.
   */
  this.isBlinkFrame = false;
  this.ticksPerLogicFrame = 3;
  this.ticksPerAnimationFrame = 3;

  this.idealFrameLength = 1000 / 20;
  this.lastTimeStamp = 0;


  /**
   * This seems to come in handy, so we'll maintain it here.
   */
  this.isEvenFrame = true;

  /**
   * We'll just keep a running frame count. Cuz it's cool. And to figure out
   * the isBlinkFrame.
   */
  this.tickCount = 0;

  /**
   * Eye and target arrays for the camera.
   */
  this.cameraEye_ = vec3.fromValues(this.avatar.x - 2500, this.avatar.y - 1000, this.avatar.z + 19100);
  this.cameraTarget_ = vec3.fromValues(this.avatar.x, this.avatar.y + 2000, this.avatar.z);
  this.targetEye_ = vec3.fromValues(100, 0, 0);
  this.targetTarget_ = vec3.fromValues(this.avatar.x, this.avatar.y, this.avatar.z);
  this.cameraEyeDelta_ = vec3.fromValues(0, 0, 0);
  this.cameraTargetDelta_ = vec3.fromValues(0, 0, 0);

  /**
   * Game state.
   */
  this.currentRoom_ = this.getRoom(-1, -1, 0);

  // The current "save game" state, with everything important we've done.
  this.state = {};

  // Attempt to load saved game from localStorage.
  if (window.localStorage && window.localStorage['zelda30tribute']) {
    var doLoad = confirm('I\'m going to load your saved game, okay?\n(cancel to start over)');
    if (doLoad) {
      this.state = JSON.parse(window.localStorage['zelda30tribute']);
    }
  }


  // How quickly the camera's eye and target positions track toward
  // their targets;
  this.cameraEyeSpeed = .2;
  this.cameraTargetSpeed = .4;

  /**
   * Event handlers.
   */
  var boundOnKeyDown = ace.bind(this.onKeyDown, this);
  var boundOnKeyUp = ace.bind(this.onKeyUp, this);
  var boundOnResize = ace.bind(this.onResize, this);
  this.document.addEventListener('keydown', boundOnKeyDown);
  this.document.addEventListener('keyup', boundOnKeyUp);
  this.window.addEventListener('resize', boundOnResize);


  var boundOnTouchStart = ace.bind(this.onTouchStart_, this);
  var boundOnTouchMove = ace.bind(this.onTouchMove_, this);
  var boundOnTouchEnd = ace.bind(this.onTouchEnd_, this);
  var boundOnMouseDown = ace.bind(this.onMouseDown_, this);
  var boundOnMouseMove = ace.bind(this.onMouseMove_, this);
  var boundOnMouseUp = ace.bind(this.onMouseUp_, this);

  this.document.addEventListener('touchstart', boundOnTouchStart);
  this.document.addEventListener('touchmove', boundOnTouchMove);
  this.document.addEventListener('touchend', boundOnTouchEnd);
  this.document.addEventListener('mousedown', boundOnMouseDown);
  this.document.addEventListener('mousemove', boundOnMouseMove);
  this.document.addEventListener('mouseup', boundOnMouseUp);

  this.boundOnTick = ace.bind(this.onTick, this);
  requestAnimationFrame(this.boundOnTick);
};


/**
 * Contains the string "Game" for each instance of this class.
 * @type {string}
 */
ace.Game.prototype.typeName = 'Game';


/**
 * Handler for the onTouchStart event.
 * @param {event} e The event.
 * @private
 */
ace.Game.prototype.onTouchStart_ = function(e) {
  e.preventDefault();
};


/**
 * Handler for the onTouchEnd event.
 * @param {event} e The event.
 * @private
 */
ace.Game.prototype.onTouchEnd_ = function(e) {
  e.preventDefault();
};


/**
 * Handler for the onTouchMove event.
 * @param {event} e The event.
 * @private
 */
ace.Game.prototype.onTouchMove_ = function(e) {
  e.preventDefault();
};

/**
 * Handler for the onMouseDown event.
 * @param {event} e The event.
 * @private
 */
ace.Game.prototype.onMouseDown_ = function(e) {
  // Simulate a single touch.
  this.mouseIsDown = true;
  var touchEvent = {preventDefault: function() {},
                    targetTouches: [{clientX: e.clientX,
                                     clientY: e.clientY}]};
  this.onTouchStart_(touchEvent);
};


/**
 * Handler for the onMouseUp event.
 * @param {event} e The event.
 * @private
 */
ace.Game.prototype.onMouseUp_ = function(e) {
  // Simulate an ending touch.
  this.mouseIsDown = false;
  var touchEvent = {preventDefault: function() {}, targetTouches: []};
  this.onTouchEnd_(touchEvent);
};


/**
 * Handler for the onMouseMove event.
 * @param {event} e The event.
 * @private
 */
ace.Game.prototype.onMouseMove_ = function(e) {
  // Simulate a single touch.
  if (this.mouseIsDown) {
    var touchEvent = {preventDefault: function() {},
                      targetTouches: [{clientX: e.clientX,
                                       clientY: e.clientY}]};
    this.onTouchMove_(touchEvent);
  }
};



/**
 * Tests if a given window coordinate is "over" the bounding rectangle of
 * of an element.
 * @param {number} x The x position to test.
 * @param {number} y The y position to test.
 * @param {Element} el The div or whatever to test.
 */
ace.Game.prototype.pointIsOverElement = function(x, y, el) {
  var bounds = el.getBoundingClientRect();

  return (x >= bounds.left && x <= bounds.right &&
          y >= bounds.top && y <= bounds.bottom);
};


/**
 * Spawns all actors in a room.
 * @param {ace.Room} room The Room to build from.
 */
ace.Game.prototype.spawnRoomActors = function(room) {
  for (var i = 0; i < room.actors.length; i++) {
    var actor = room.actors[i];

    if (actor.settings.hideIfInventory &&
        game.avatar.hasInventory(actor.settings.hideIfInventory)) {
      continue;
    }

    var z = this.getWorldZ(actor.x, actor.y);
    if (room.isInUnderworld) {
      z = -1008;
    }
    var spawnSettings = {x: actor.x, y: actor.y, z: z};
    var actorSettings = actor.settings || {};
    for (var key in actorSettings) {
      spawnSettings[key] = actorSettings[key];
    }
    var newActor = this.spawn(actor.type, spawnSettings);

    var roomName = this.getRoomUniqueName(room);
    this.state.isHiddenByActorCountNumber = this.state.isHiddenByActorCountNumber || {};

    if (newActor && this.state.isHiddenByActorCountNumber[roomName] &&
        this.state.isHiddenByActorCountNumber[roomName][newActor.actorCountNumber]) {
      newActor.hide();
      newActor.hitPoints = 0;
    }

  }
};


/**
 * Spawns a single actor.
 * @param {string} type The type (class name) of actor, like "Orc".
 * @param {Object=} opt_settings Optional settings hash.
 * @return {ace.Actor} The actor.
 */
ace.Game.prototype.spawn = function(type, opt_settings) {
  var settings = opt_settings || {};
  if (!ace[type]) {
    console.log('MISSING ACTOR TYPE: ' + type);
    return;
  }
  var newActor = new ace[type](this, null, settings);
  for (var key in settings) {
    newActor[key] = settings[key];
  }
  this.actors.push(newActor);
  newActor.spawn(this);
  return newActor;
}


/**
 * Disposes of all actors except the avatar.
 * @param {ace.Room} room The Room to build from.
 */
ace.Game.prototype.destroyOldActors = function() {
  // Start at 1 so we don't dispose the avatar. She's always first.
  while(this.actors.length > 1) {
    var actor = this.actors.pop();
    actor.dispose();
  }
};


/**
 * Stops the game from goin'.
 */
ace.Game.prototype.stop = function() {
  ace.events.removeAll(window);
  this.pauseSound('overworld');
  clearTimeout(this.timerId);
};


/**
 * Draws the room into the canvas. Blip!
 * @param {ace.Room} room The room to draw.
 */
ace.Game.prototype.onTick = function(timeStamp) {

  if (this.isPaused) {
    var currentItemId = 0;
    for (var i = 0; i < ace.selectableItemList.length; i++) {
	    var itemName = ace.selectableItemList[i];
	    if (itemName == this.avatar.currentItem) {
	      currentItemId = i;
	    }
	  }

	  var row = Math.floor(currentItemId / 4);
	  var col = currentItemId % 4;
    if (game.keyWasPressed(ace.KEY_LEFT) || game.keyWasPressed('a')) {
      col = col - 1;
		}
		if (game.keyWasPressed(ace.KEY_RIGHT) || game.keyWasPressed('d')) {
      col = col + 1;
		}
		if (game.keyWasPressed(ace.KEY_UP) || game.keyWasPressed('w')) {
      row = row - 1;
		}
		if (game.keyWasPressed(ace.KEY_DOWN) || game.keyWasPressed('s')) {
      row = row + 1;
		}
		row = (row + 2) % 2;
		col = (col + 4) % 4;
		currentItemId = row * 4 + col;
		game.avatar.currentItem = ace.selectableItemList[currentItemId];

    this.keyWasPressed_ = {};
    requestAnimationFrame(this.boundOnTick);

    return;
  }


  var isLogicFrame = false;
  var elapsed = timeStamp - this.lastTimeStamp;

  if (elapsed >= this.idealFrameLength) {
    isLogicFrame = true;
  }

  if (!isLogicFrame) {
    requestAnimationFrame(this.boundOnTick);
    return;
  }

  this.lastTimeStamp = timeStamp;

  this.tickCount++;
  this.isBlinkFrame = (this.tickCount % this.ticksPerAnimationFrame) == 0;
  this.isEvenFrame = (this.tickCount % 2) == 0;

  if (this.isScrolling) {
    if (this.scroller.scrollLeft == this.targetScrollLeft &&
        this.scroller.scrollTop == this.targetScrollTop) {
      this.isScrolling = false;
      this.drawRoom(this.targetScrollRoom);
    } else {
      this.scroller.scrollLeft += this.targetScrollDx;
      this.scroller.scrollTop += this.targetScrollDy;
    }

  } else {

    this.engine.clearLightMap();
    for (var i = 0; i < this.actors.length; i++) {
      if (!this.actors[i].isHidden) {
        this.actors[i].onTick(this);
      }
    }
    this.engine.onTick();

    var newRoom = this.getRoom(this.avatar.x, this.avatar.y, this.avatar.z);
    if (newRoom != this.currentRoom_) {
      // Remove all of the actors for now.
      // And store a list of hidden actors, so things don't respawn.
      this.currentRoom_.isHiddenByActorCountNumber = {};

      var roomName = this.getRoomUniqueName(this.currentRoom_);
      this.state.isHiddenByActorCountNumber =
          this.state.isHiddenByActorCountNumber || {};
      this.state.isHiddenByActorCountNumber[roomName] =
          this.state.isHiddenByActorCountNumber[roomName] || {};

      var actorsToDisappear = [];
      for (var i = 1; i < this.actors.length; i++) {
        var actor = this.actors[i];
        if (actor.isHidden) {
          this.state.isHiddenByActorCountNumber[roomName][actor.actorCountNumber] = true;
        } else if (!newRoom.isInUnderworld && actor.isEnemy && !actor.cloudFrames) {
          // Remember which actors to show clouds for.
          actorsToDisappear.push({x: actor.x, y: actor.y, z: actor.z});
        }
      }


      this.actors = [this.actors.shift()];
      this.avatar.flyingSword = null;


      if (newRoom.song !== this.currentRoom_.song) {
        game.stopSound('underworld');
        game.stopSound('overworld');
        if (newRoom.song != null) {
          setTimeout(function() {
            game.playSound(newRoom.song, {'loops': 99999, volume:50});
          }, 1500);
        }
      }

      if (newRoom.isInUnderworld != this.currentRoom_.isInUnderworld) {
        if (newRoom.isInUnderworld) {
          this.engine.canvas.style.backgroundColor = 'black';
          // Deal with any hangover of animating our camera speed.
					game.cameraEyeSpeed = game.idealCameraEyeSpeed;
					game.cameraTargetSpeed = game.idealCameraTargetSpeed;
          this.engine.setLightDirection(ace.UNDERWORLD_LIGHT_DIRECTION);
        } else {
          // Whenever we come out of a cave, reset the overworld.
          game.resetOverworld();
          this.engine.setLightDirection(ace.OVERWORLD_LIGHT_DIRECTION);
          // Also, if we've been in the first dungeon and we're
          // now coming out, activate the classic glitch, which you'll
          // find implemented in lockeddoor.js
          if (top.hasBeenInFirstDungeonEntrance) {
            top.readyForDungeon1Glitch = true;
          }
        }
      }

      console.log('ENTERING ROOM:' + newRoom.x + ',' + newRoom.y);
      //console.log(newRoom);
      this.currentRoom_ = newRoom;
      this.spawnRoomActors(this.currentRoom_);

      // Show a cloud for any old overworld enemies hanging around.
      for (var i = 0; i < actorsToDisappear.length; i++) {
        this.spawn('Cloud', actorsToDisappear[i]);
      }
    }

    var avatarGridX = Math.floor(this.avatar.x / ace.TILE_SIZE);
    var avatarGridY = Math.floor(this.avatar.y / ace.TILE_SIZE);

    // If the screen is wider, we need to render more sprites.
    var screenRatio = this.engine.canvas.width / this.engine.canvas.height;
    var scale = screenRatio / 1.5;

    // Also, if we're at high altitudes, render more.
    var altitudeCorrection = Math.ceil(this.avatar.z / 15);

    var xTileSeek = Math.ceil(9 * scale);
    var yTileSeek = 8;
    for (var gridZ = 0; gridZ < 2; gridZ++) {
      for (var gridY = avatarGridY - (yTileSeek - 1); gridY < avatarGridY + yTileSeek + altitudeCorrection; gridY++) {
        for (var gridX = avatarGridX - xTileSeek; gridX < avatarGridX + xTileSeek; gridX++) {
          var tile = this.getTileAt(gridX, gridY, gridZ);
          if (tile && this.engine.spriteHasBeenRegistered(tile.name) && !ace[tile.name]) {
            // Not sure yet why we need the + 8 other than it works.
            // Seems like it's offsetting some other offset that's no longer needed.
            // I just need to track that down.
            var worldZ = (gridZ * ace.TILE_SIZE);
            var worldX = (gridX * ace.TILE_SIZE) + 8;
            var worldY = (gridY * ace.TILE_SIZE) + 8;
            //console.log(gridZ, gridX, gridY);
            this.engine.drawSingleSprite(tile.name,
                [worldX, worldY, worldZ], 0, null);
          }
        }
      }
    }

    this.updateCamera();
  }

  // Reset key press hash.
  this.keyWasPressed_ = {};
  this.onResize();
  requestAnimationFrame(this.boundOnTick);

};

/**
 * Updates the camera dynamically.
 * @param {ace.Room} room The room to draw.
 */
ace.Game.prototype.updateCamera = function() {
  // Handle camera stuff here.
  var eyeFixY = 0;
  var eyeFixZ = 0;
  var fovDegrees = 45;



  // If we're blocked by the big green mountain, move eye up.
  if (this.avatar.x > 3060 && this.avatar.x < 3330 &&
      this.avatar.y > 880 && this.avatar.y < 1032) {
    eyeFixY = 120;
    eyeFixZ = 50;
  }
  var quantizedZ = Math.round(this.avatar.z / 8) * 8;
  var eyeX = this.avatar.x;
  var eyeY = this.avatar.y - 200 + eyeFixY;
  var eyeZ = quantizedZ + 220 + eyeFixZ;



  var cameraMinSensitivity = .3;
  var targetX = this.avatar.x;
  var targetY = this.avatar.y;

  // If we're in the underworld, everything is different.
  if (this.avatar.isInUnderworld()) {

    var relativeY = Math.abs(-1000 - this.avatar.y) / 3;
    var eyeZ = quantizedZ + 200 + eyeFixZ;
    eyeY += 100; // - relativeY * 2;

    fovDegrees = 60;
    cameraMinSensitivity = 0
    this.cameraEyeSpeed = .4;
  }

  var targetOffset = this.currentRoom_.cameraTargetOffset;
  var eyeOffset = this.currentRoom_.cameraEyeOffset;
  if (targetOffset) {
    targetX += targetOffset[0];
    targetY += targetOffset[1];
    quantizedZ += targetOffset[2];
    eyeX += eyeOffset[0];
    eyeY += eyeOffset[1];
    eyeZ += eyeOffset[2];
  }

  vec3.set(this.targetEye_, eyeX, eyeY, eyeZ);
  vec3.set(this.targetTarget_, targetX, targetY, quantizedZ);

  vec3.subtract(this.cameraEyeDelta_, this.targetEye_, this.cameraEye_);
  vec3.subtract(this.cameraTargetDelta_, this.targetTarget_, this.cameraTarget_);
  vec3.scale(this.cameraEyeDelta_, this.cameraEyeDelta_, this.cameraEyeSpeed);
  vec3.scale(this.cameraTargetDelta_, this.cameraTargetDelta_, this.cameraTargetSpeed);


  if (vec3.length(this.cameraEyeDelta_) > cameraMinSensitivity ||
      this.needsCameraRefresh_) {
    vec3.add(this.cameraEye_, this.cameraEye_, this.cameraEyeDelta_);
    vec3.add(this.cameraTarget_, this.cameraTarget_, this.cameraTargetDelta_);
    this.engine.setCamera(this.cameraEye_, this.cameraTarget_, fovDegrees);
    this.needsCameraRefresh_ = false;
  }

  // If we're "zoomAnimating" the camera, everything is different.
  if (this.isZoomAnimating) {
    this.zoomAnimatingFrames = this.zoomAnimatingFrames || 1;
    this.zoomAnimatingFrames++;
    var rotZ = this.zoomAnimatingFrames / 30;
    var rotX = .4;
    var distance = (100 + 500 - this.zoomAnimatingFrames) / 2;
    var eye = this.cameraEye_;

    eye[0] = this.cameraTarget_[0] + Math.sin(rotZ) *
      distance * Math.sin(rotX);
    eye[1] = this.cameraTarget_[1] + Math.cos(rotZ) *
        distance * Math.sin(rotX);
    eye[2] = this.cameraTarget_[2] + Math.cos(rotX) *
        distance;
    this.engine.setCamera(eye, this.cameraTarget_, fovDegrees);
  }

};


/**
 * Scrolls us to an adjacent room.
 * @param {string} facing The relative direction of the room to move to.
 */
ace.Game.prototype.scrollRoom = function(facing) {
  this.isScrolling = true;
  var fx = ace.xMultByFacing[facing];
  var fy = ace.yMultByFacing[facing];
  this.targetScrollLeft = this.canvasWidth + this.canvasWidth * fx;
  this.targetScrollTop = this.canvasHeight + this.canvasHeight * fy;
  this.targetScrollDx = this.map.tileSize * fx;
  this.targetScrollDy = this.map.tileSize * fy;
  this.avatar.x -= this.canvasWidth * fx;
  this.avatar.y -= this.canvasHeight * fy;
  var col = (this.map.width + this.room.x + fx) % this.map.width;
  var row = (this.map.height + this.room.y + fy) % this.map.height;
  this.targetScrollRoom = this.map.rooms[col][row];
};


/**
 * Returns whether a given key is currently down.
 * @param {number} keyCode The code to check.
 * @return {boolean} Whether it's down.
 */
ace.Game.prototype.keyIsDown = function(keyCode) {
  return this.keyIsDown_[keyCode];
};


/**
 * Returns whether a given key was pressed this last frame.
 * @param {number} keyCode The code to check.
 * @return {boolean} Whether it was pressed.
 */
ace.Game.prototype.keyWasPressed = function(keyCode) {
  return this.keyWasPressed_[keyCode];
};

/**
 * Refreshes the info panel that shows coins, hearts, etc.
 * @param {string} soundName A friendy name, like 'sword'.
 * @param {string} src The path to the sound file.
 */
ace.Game.prototype.loadSound = function(soundName, src) {
  // The following lines (kinda) work for HTML5 audio. After much
  // frustration, using soundManager2 instead.
  //
  // var audioElement = document.createElement('audio');
  // audioElement.setAttribute('src', src);
  // this.sounds[soundName] = audioElement;

  // Here's the SoundManager2 stuff.
  this.sounds[soundName] = soundManager.createSound({
    id: soundName,
    url: src
  });
  if (this.sounds[soundName].load) {
    this.sounds[soundName].load();
  }
};


/**
 * Plays a sound.
 * @param {string} soundName A friendy name, like 'sword'.
 */
ace.Game.prototype.playSound = function(soundName, settings) {
  if (this.sounds[soundName].play) {
    this.sounds[soundName].play(settings);
  }
};


/**
 * Pauses a sound by name.
 * @param {string} soundName A friendy name, like 'sword'.
 */
ace.Game.prototype.pauseSound = function(soundName) {
  if (this.sounds[soundName].pause) {
    this.sounds[soundName].pause();
  }
};


/**
 * Fades out a sound by name.
 * @param {string} soundName A friendy name, like 'sword'.
 * @param {number} duration Milliseconds of fade.
 * @param {number} targetVolume The target volume.
 */
ace.Game.prototype.fadeSound = function(soundName, duration, targetVolume) {

  // Add a fade method to soundManager, then call it.
  if (typeof soundManager !== 'undefined')
    soundManager.fadeTo = function(id, dur, toVol, callback) {
      dur      = dur || 1000;
      toVol    = toVol || 0;
      callback = typeof callback == 'function' ? callback : function(){};
      var s    = soundManager.getSoundById(id);
      var k    = 50; // TODO(scott): This is hardcoded right now for songs.

      var t    = dur/Math.abs(k - toVol),
          i    = setInterval(function(){
                k = k > toVol ? k - 1 : k + 1;
                s.setVolume(k);
                if(k == toVol){
                        callback.call(this);
                  clearInterval(i);
                  i = null;
                }
        }, t);
    }
  soundManager.fadeTo(soundName, duration, targetVolume);
};



/**
 * Pauses a sound by name.
 * @param {string} soundName A friendy name, like 'sword'.
 */
ace.Game.prototype.resumeSound = function(soundName) {
  if (this.sounds[soundName].resume) {
    this.sounds[soundName].resume();
  }
};


/**
 * Pauses a sound by name.
 * @param {string} soundName A friendy name, like 'sword'.
 */
ace.Game.prototype.stopSound = function(soundName) {
  if (this.sounds[soundName].stop) {
    this.sounds[soundName].stop();
  }
};


/**
 * Handles the screen resizing.
 * @param {event} e The event.
 */
ace.Game.prototype.onResize = function() {
  var w = this.window.innerWidth;
   var h = this.window.innerHeight;
  var topPadding = 0;

  if (w < 460 || h < 500) {
    topPadding = 50;
    if (w > h) {
    }
  } else {
  }

  h = this.window.innerHeight - topPadding;

  var ratio = w / h;
  var viewport = {w: w,
                  h: h};

  var minHeight = Math.floor(w * 0.9);
  if (minHeight < h) {
    viewport.top = Math.floor((h - minHeight) / 2);
    viewport.h = minHeight;
  }

  // TODO(scott): Auto size based on performance.
  this.engine.onResize(viewport, 1, 1, topPadding); //this.state.canvasScale);
  this.needsCameraRefresh_ = true;
};


/**
 * Handles the key down.
 * @param {event} e The event.
 */
ace.Game.prototype.onKeyDown = function(e) {
  this.keyIsDown_[e.keyCode] = true;

  var letter = String.fromCharCode(e.keyCode).toLowerCase();
  this.keyIsDown_[letter] = true;

  e.preventDefault();
};


/**
 * Handles the key up.
 * @param {event} e The event.
 */
ace.Game.prototype.onKeyUp = function(e) {
  this.keyIsDown_[e.keyCode] = false;
  this.keyWasPressed_[e.keyCode] = true;

  var letter = String.fromCharCode(e.keyCode).toLowerCase();
  this.keyIsDown_[letter] = false;
  this.keyWasPressed_[letter] = true;

  e.preventDefault();
};


/**
 * Gets height of the terrain at a given x/y world position.
 * @param {number} x The world x coordinate.
 * @param {number} y The world y coordinate.
 * @return {number} The z-altitude at the spot.
 */
ace.Game.prototype.getWorldZ = function(x, y) {
  // This being static is not great, but works for now.
  var worldWidth = 4096;
  var worldHeight = 1408;

  if (x > worldWidth || y > worldHeight || y < 0 || x < 0) {
    return 0;
  }
  var gridX = Math.floor(x / ace.TILE_SIZE);
  var gridY = Math.floor(y / ace.TILE_SIZE);
  var row = this.heightMap[gridY] || [];
  var val = row[gridX];
  return val || 0;
};


/**
 * Returns a random spot inside the current room.
 * @return {object} A simple data structure with x and y.
 */
ace.Game.prototype.randomSpotInRoom = function(worldX, worldY) {
  var baseX = Math.floor(worldX / ace.OVERWORLD_ROOM_PIXEL_WIDTH) *
      ace.OVERWORLD_ROOM_PIXEL_WIDTH;
  var baseY = Math.floor(worldY / ace.OVERWORLD_ROOM_PIXEL_HEIGHT) *
      ace.OVERWORLD_ROOM_PIXEL_HEIGHT;

  // Inset for the walls of the underworld.
  baseX += 32;
  baseY += 32;

  // Now add randomness.
  baseX += ace.randomInt(ace.OVERWORLD_ROOM_PIXEL_WIDTH - 64);
  baseY += ace.randomInt(ace.OVERWORLD_ROOM_PIXEL_HEIGHT - 64);
  return {x: baseX, y: baseY};

};


/**
 * Gets a tile ID at a given x, y, z coordinate.
 * @param {number} tileX The tile x coordinate.
 * @param {number} tileY The tile y coordinate.
 * @param {number} tileZ The tile y coordinate.
 * @return {object} A simple data structure with ID and name.
 */
ace.Game.prototype.getTileAt = function(tileX, tileY, tileZ) {
  var tileId;
  if (!this.tileMap[tileZ] || !this.tileMap[tileZ][tileY] || !this.tileMap[tileZ][tileY][tileX]) {
    return;
  } else {
    tileId = this.tileMap[tileZ][tileY][tileX];
  }

  var tileName = this.tileNamesById[tileId];
  var isWalkable = this.isWalkableByName[tileName] || false;

  return {
    'id': tileId,
    'name': tileName,
    'isWalkable': isWalkable,
    'isWalkableByEnemies': isWalkable,
    'walkSpeedFactor': 1
  };

};



/**
 * Gets a grid x,y at a given pixel x, y coordinate.
 * @param {number} worldX The world x coordinate.
 * @param {number} worldY The world y coordinate.
 * @return {object} A simple data structure with x and y;
 */
ace.Game.prototype.getGridXY = function(worldX, worldY) {
  var tileX = Math.floor(worldX / ace.TILE_SIZE);
  var tileY = Math.floor(worldY / ace.TILE_SIZE);
  return {
    'x': tileX,
    'y': tileY
  };
};


/**
 * Returns if the first letter in a string is uppercase, or really whether
 * it's an actor.
 * @param {string} str The string to check.
 * @return {boolean} Whether the first letter is uppercase.
 */
ace.Game.prototype.isActor_ = function(str) {
  var letter = str.substr(0,1);
  return letter == letter.toUpperCase();
};

/**
 * Returns whether an actor can exit in a given direction inside
 * a given room.
 * @param {ace.Room} room The room to check.
 * @param {string} facing One of our standard facing strings, like
 *     'up', or 'right'
 * @return {boolean} Whether the exit in that direction is "walkable".
 */
ace.Game.prototype.canExit = function(room, facing) {
  if (!room && !room.exitByFacing) {
    return true;
  }

  // TODO(scott): Finish the key logic, etc.
  var exit = room.exitByFacing[facing]
  return exit == ace.OPEN || exit == ace.BOMBABLE;
};


/**
 * Returns a little data structure describing the "room" we're in.
 * @param {number} x The global x position to check.
 * @param {number} y The global y position to check.
 * @param {number} z The global z position to check.
 * @return {Object} A data structure like {x:1, y:20}
 */
ace.Game.prototype.getRoom = function(x, y, z) {
  this.cachedOverworldRooms_ = this.cachedOverworldRooms_ || {};

  // Otherwise, construct a room record on the fly from our tile map.
  var rx = Math.floor(x / ace.OVERWORLD_ROOM_PIXEL_WIDTH);
  var ry = Math.floor(y / ace.OVERWORLD_ROOM_PIXEL_HEIGHT);
  var name = rx + ',' + ry
  if (!this.cachedOverworldRooms_[name]) {
    var room = {'x': rx, 'y': ry, 'song': 'overworld', 'name': rx + ',' + ry};
    room.actors = [];

    var baseX = rx * ace.OVERWORLD_ROOM_PIXEL_WIDTH;
    var baseY = ry * ace.OVERWORLD_ROOM_PIXEL_HEIGHT;
    var roomActorInfo = ace.overworldActorInfo[rx + ',' + ry] || {};

    var hasSpawnedByActorName = {};

    for (var gridX = 0; gridX < ace.OVERWORLD_ROOM_TILE_WIDTH; gridX++) {
      for (var gridY = 0; gridY < ace.OVERWORLD_ROOM_TILE_HEIGHT; gridY++) {
        var worldX = baseX + gridX * ace.TILE_SIZE + 8;
        var worldY = baseY + gridY * ace.TILE_SIZE + 8;
        // This is all busted.
        var actorTile = this.getTileAt(worldX, worldY, 0);
        if (actorTile) {
          if (ace[actorTile.name]) {
            var actor = {};
            actor['type'] = actorTile.name;
            actor['x'] = worldX;
            actor['y'] = worldY;
            actor['settings'] = {};

            if (roomActorInfo[actorTile.name]) {
              hasSpawnedByActorName[actorTile.name] = true;
              for (var key in roomActorInfo[actorTile.name]) {
                actor['settings'][key] = roomActorInfo[actorTile.name][key];
              }
            }

            room.actors.push(actor);
          } else if (actorTile.name.indexOf('_') == -1) {
  				  console.log('COULD NOT FIND actor:' + actorTile.name);
  				}
        }
      }
    }

    for (var actorName in roomActorInfo) {
      if (!hasSpawnedByActorName[actorName]) {
        var actor = {};
        actor['type'] = actorName;
        actor['x'] = 0;
        actor['y'] = 0;
        actor['settings'] = {};

        for (var key in roomActorInfo[actorName]) {
          actor['settings'][key] = roomActorInfo[actorName][key];
        }
        room.actors.push(actor);
      }

    }


    this.cachedOverworldRooms_[name] = room;
  }
  return this.cachedOverworldRooms_[name];
};



/**
 * Sets where the camera is.
 * @param {number} x The global x position.
 * @param {number} y The global y position.
 * @param {number} z The global z position.
 */
ace.Game.prototype.setCameraEye = function(x, y, z) {
  this.cameraEye_ = [x, y, z];
};



/**
 * Sets where the camera targets.
 * @param {number} x The global x position.
 * @param {number} y The global y position.
 * @param {number} z The global z position.
 */
ace.Game.prototype.setCameraTarget = function(x, y, z) {
  this.cameraTarget_ = [x, y, z];
};


/**
 * Animates the camera to the start position of the game.
 */
ace.Game.prototype.zoomToStart = function() {
  this.document.body.style.backgroundColor = 'black';
  var speedScale = 3;
  this.idealCameraEyeSpeed = .2 * speedScale;
  this.idealCameraTargetSpeed = .4 * speedScale;
  this.cameraEyeSpeed = 0.02;
  this.cameraTargetSpeed = 0.02;
  //this.cameraEyeSpeed = 0.2;
  //this.cameraTargetSpeed = 0.2;



  this.zoomToStartTimer = setInterval(function() {
    game.cameraEyeSpeed = (game.cameraEyeSpeed * 40 + game.idealCameraEyeSpeed) / 41;
    game.cameraTargetSpeed = (game.cameraTargetSpeed * 40 + game.idealCameraTargetSpeed) / 41;
    var hasSavedGame = game.state.lastOverworldLocation;

    if (Math.abs(game.cameraEyeSpeed - game.idealCameraEyeSpeed) < .35 || hasSavedGame) {
      if (hasSavedGame) {
        game.continue(true);
      }
      game.idealCameraEyeSpeed = .2;
      game.idealCameraTargetSpeed = .4;
      game.cameraEyeSpeed = game.idealCameraEyeSpeed;
      game.cameraTargetSpeed = game.idealCameraTargetSpeed;
      clearInterval(game.zoomToStartTimer);
      game.engine.canvas.style.backgroundColor = 'black';
    }
  }, 150);

};



/**
 * Animates the camera through the logo.
 */
ace.Game.prototype.zoomThroughLogo = function() {
  this.document.body.style.backgroundColor = 'black';
  //var idealEye = [1891, -2200, 2430];
  var idealEye = [1891 - 120, -2200, 2130];
  var dX = idealEye[0] - this.cameraEye_[0];
  var dY = idealEye[1] - this.cameraEye_[1];
  var dZ = idealEye[2] - this.cameraEye_[2];
  var zoomFraction = 170;
  dX = dX / zoomFraction;
  dY = dY / zoomFraction;
  dZ = dZ / zoomFraction;

  var frames = 0;
  clearInterval(game.zoomThroughLogoTimer);
  game.zoomThroughLogoTimer = setInterval(function() {
    game.cameraEye_[0] += dX;
    game.cameraEye_[1] += dY;
    game.cameraEye_[2] += dZ * 1.2;

    game.cameraTarget_[2] -= dZ * 12;
    frames++;
    if (frames > 30) {
      game.cameraEye_[2] = 200;// = [2000, -1000, 100];
      game.cameraEye_[1] += 1000;// = [2000, -1000, 100];
      game.cameraTarget_[1] += 1000;// = [2000, -1000, 100];
      game.cameraTarget_[2] -= 1000;// = [2000, -1000, 100];
      clearInterval(game.zoomThroughLogoTimer);
      game.zoomToStart();
    }
  }, 1000/20);

};

/**
 * Whether we're on the start screen.
 */
ace.Game.prototype.isStartScreen = function() {
  return this.cameraEye_[1] <= -3820;
};



/**
 * Handles the pressing of the start button on screen.
 */
ace.Game.prototype.allEnemiesAreDead = function() {
  for (var i = 0; i < this.actors.length; i++) {
    if (this.actors[i].isEnemy && this.actors[i].isAlive()) {
      return false;
    }
  }
  return true;
};

/**
 * Handles the "continue" button from the menu.
 */
ace.Game.prototype.continue = function(isRestoringFromSavedGame) {
  if (this.state.lastOverworldLocation) {
    this.avatar.x = this.state.lastOverworldLocation[0];
    this.avatar.y = this.state.lastOverworldLocation[1];
    this.avatar.z = this.state.lastOverworldLocation[2];
    this.avatar.isLeavingCave = true;
  } else {
    this.avatar.x = this.x = 1892;
    this.avatar.y = 84;
    this.avatar.z = 0;
    this.avatar.isLeavingCave = false;
  }
  this.avatar.hitPoints = 3;
  this.avatar.zOffset = 0;
  this.avatar.yOffset = 0;
  this.avatar.facing = 'down';
  this.avatar.invincibleCounter = 0;
  this.avatar.maxHitPoints = game.state.maxHitPoints || 3;

  this.resetOverworld();
  game.setCameraEye(game.avatar.x, game.avatar.y, game.avatar.z);
  game.setCameraTarget(game.avatar.x, game.avatar.y, game.avatar.z);
};


/**
 * Handles the "reset" button from the menu.
 */
ace.Game.prototype.reset = function() {
  window.location.reload();
};


/**
 * Handles the "save" button from the menu.
 */
ace.Game.prototype.save = function() {
  if (!window.localStorage) {
    alert('Sorry, your browser does not support localStorage, which is needed to save your game.');
    return;
  }

  var stateString = JSON.stringify(this.state);
  window.localStorage['zelda30tribute'] = stateString;
  alert('Your game is saved! When you return to this page, you\'ll be in business.');
};



/**
 * Resets all of the badguys in the overworld.
 */
ace.Game.prototype.resetOverworld = function() {
  for (var key in this.cachedOverworldRooms_) {
    var room = this.cachedOverworldRooms_[key];
    var roomName = this.getRoomUniqueName(room);
    this.state.isHiddenByActorCountNumber = this.state.isHiddenByActorCountNumber || {};
    this.state.isHiddenByActorCountNumber[roomName] = {};
    //room.isHiddenByActorCountNumber = {};
  }
};

/**
 * Gets a string that uniquely identifies this room across all rooms,
 * in the form 'foo,4,5' where the first bit is the dungeon name
 * and the next two are roomX and roomY position.
 */
ace.Game.prototype.getRoomUniqueName = function(room) {
  var dungeonName = room.dungeonName || 'Overworld';
  return dungeonName + ',' + room.x + ',' + room.y;
};
