(function() {
  var Spectrum;

  define(['renderer', 'player', 'dispatcher', 'utils'], function(Renderer, Player, Dispatcher, Utils) {}, Spectrum = (function() {
    function Spectrum() {}

    Spectrum.Player = Player;

    Spectrum.Renderer = Renderer;

    Spectrum.Dispatcher = Dispatcher;

    Spectrum.Utils = Utils;

    return Spectrum;

  })());

}).call(this);
