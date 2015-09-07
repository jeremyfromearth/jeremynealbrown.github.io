(function() {
  define(function() {
    var Dispatcher;
    return Dispatcher = (function() {
      function Dispatcher() {}

      Dispatcher.prototype.callbacks = {};

      Dispatcher.prototype.addListener = function(eventName, callback) {
        var base, list;
        list = (base = this.callbacks)[eventName] || (base[eventName] = []);
        if (list.indexOf(callback) < 0) {
          return this.callbacks[eventName].push(callback);
        }
      };

      Dispatcher.prototype.removeListener = function(eventName, callback) {
        var i, index, j, list, ref;
        index = -1;
        list = this.callbacks[eventName];
        for (i = j = 0, ref = list.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
          console.log(i);
          if (list[i] === callback) {
            index = i;
          }
        }
        return list.splice(index, 1);
      };

      Dispatcher.prototype.dispatch = function(eventName, data) {
        var callback, chain, j, len, results;
        chain = this.callbacks[eventName];
        if (chain != null) {
          results = [];
          for (j = 0, len = chain.length; j < len; j++) {
            callback = chain[j];
            results.push(callback(data));
          }
          return results;
        }
      };

      return Dispatcher;

    })();
  });

}).call(this);
