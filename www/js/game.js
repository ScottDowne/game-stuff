// A factory that returns a Runner set to be a game.

ace.Game = function(divId, opt_settings) {
  return new ace.Runner(divId, opt_settings);
};
