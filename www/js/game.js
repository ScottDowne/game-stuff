// A factory that returns a Runner set to be a game.

ace.Game = function(divId, opt_settings) {
  /**
   * Refreshes the info panel that shows coins, hearts, etc.
   * @param {string} soundName A friendy name, like 'sword'.
   * @param {string} src The path to the sound file.
   */
  ace.Runner.prototype.loadSound = function(soundName, src) {
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
  ace.Runner.prototype.playSound = function(soundName, settings) {
    if (this.sounds[soundName].play) {
      this.sounds[soundName].play(settings);
    }
  };


  /**
   * Pauses a sound by name.
   * @param {string} soundName A friendy name, like 'sword'.
   */
  ace.Runner.prototype.pauseSound = function(soundName) {
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
  ace.Runner.prototype.fadeSound = function(soundName, duration, targetVolume) {

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
  ace.Runner.prototype.resumeSound = function(soundName) {
    if (this.sounds[soundName].resume) {
      this.sounds[soundName].resume();
    }
  };


  /**
   * Pauses a sound by name.
   * @param {string} soundName A friendy name, like 'sword'.
   */
  ace.Runner.prototype.stopSound = function(soundName) {
    if (this.sounds[soundName].stop) {
      this.sounds[soundName].stop();
    }
  };

  /**
   * Stops the game from goin'.
   */
  ace.Runner.prototype.stop = function() {
    ace.events.removeAll(window);
    this.pauseSound('overworld');
    clearTimeout(this.timerId);
  };

  /**
   * Returns if the first letter in a string is uppercase, or really whether
   * it's an actor.
   * @param {string} str The string to check.
   * @return {boolean} Whether the first letter is uppercase.
   */
  ace.Runner.prototype.isActor_ = function(str) {
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
  ace.Runner.prototype.canExit = function(room, facing) {
    if (!room && !room.exitByFacing) {
      return true;
    }

    // TODO(scott): Finish the key logic, etc.
    var exit = room.exitByFacing[facing]
    return exit == ace.OPEN || exit == ace.BOMBABLE;
  };


  /**
   * Handles the pressing of the start button on screen.
   */
  ace.Runner.prototype.allEnemiesAreDead = function() {
    for (var i = 0; i < this.actors.length; i++) {
      if (this.actors[i].isEnemy && this.actors[i].isAlive()) {
        return false;
      }
    }
    return true;
  };

  /**
   * Disposes of all actors except the avatar.
   * @param {ace.Room} room The Room to build from.
   */
  ace.Runner.prototype.destroyOldActors = function() {
    // Start at 1 so we don't dispose the avatar. She's always first.
    while(this.actors.length > 1) {
      var actor = this.actors.pop();
      actor.dispose();
    }
  };



  /**
   * Contains the string "Game" for each instance of this class.
   * @type {string}
   */
  ace.Runner.prototype.typeName = 'Game';

  /**
   * Spawns all actors in a room.
   * @param {ace.Room} room The Room to build from.
   */
  ace.Runner.prototype.spawnRoomActors = function(room) {
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
  ace.Runner.prototype.spawn = function(type, opt_settings) {
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

  return new ace.Runner(divId, opt_settings);
};
