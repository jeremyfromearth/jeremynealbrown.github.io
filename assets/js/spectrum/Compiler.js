(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['spectrum/Renderer', 'underscore'], function(Renderer, _) {
    var Compiler;
    return Compiler = (function() {
      function Compiler(ctx) {
        this.ctx = ctx;
        this.compile = bind(this.compile, this);
      }

      Compiler.prototype.compile = function(code) {
        var error, obj, pre, r;
        r = null;
        try {
          obj = CoffeeScript["eval"](code, {
            bare: true
          });
          pre = {};
          r = _.extend(pre, new Renderer(this.ctx));
          r = _.extend(r, obj);
          if (r != null) {
            if (r.init != null) {
              try {
                r.init();
              } catch (_error) {
                error = _error;
                this.onInitError(error);
                return;
              }
            }
            if (r.step != null) {
              try {
                r.step();
              } catch (_error) {
                error = _error;
                this.onStepError(error);
                return;
              }
            }
            if (r.render != null) {
              try {
                r.render();
              } catch (_error) {
                error = _error;
                this.onRenderError(error);
                return;
              }
            }
          }
          pre = {};
          r = {};
          r = _.extend(pre, new Renderer(this.ctx));
          r = _.extend(r, obj);
          return r;
        } catch (_error) {
          error = _error;
          return this.onCompilationError(error);
        }
      };

      Compiler.prototype.onCompilationError = function(error) {
        return console.log("onCompilationError()", error.message);
      };

      Compiler.prototype.onInitError = function(error) {
        return console.log("onInitializationError()");
      };

      Compiler.prototype.onNoMainClassError = function() {
        return console.log("onNoMainClassError()");
      };

      Compiler.prototype.onRenderError = function(error) {
        return console.log("onRenderError()", error.message);
      };

      Compiler.prototype.onStepError = function(error) {
        return console.log("onStepError()");
      };

      return Compiler;

    })();
  });

}).call(this);
