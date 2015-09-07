(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(function() {
    var Player;
    return Player = (function() {
      Player.FS_RESIZE = 'fs_resize';

      Player.FS_NO_RESIZE = 'fs_no_resize';

      function Player(canvas) {
        this.canvas = canvas;
        this.toggleFullScreen = bind(this.toggleFullScreen, this);
        this.stop = bind(this.stop, this);
        this.step = bind(this.step, this);
        this.setRenderer = bind(this.setRenderer, this);
        this.setFullWindow = bind(this.setFullWindow, this);
        this.play = bind(this.play, this);
        this.render = bind(this.render, this);
        this.pause = bind(this.pause, this);
        this.onWindowResize = bind(this.onWindowResize, this);
        this.onWindowMouseEvent = bind(this.onWindowMouseEvent, this);
        this.onWindowKeyboardEvent = bind(this.onWindowKeyboardEvent, this);
        this.loop = bind(this.loop, this);
        this.init = bind(this.init, this);
        this.getAnimationCallback = bind(this.getAnimationCallback, this);
        this.stepCount = 0;
        this.playing = false;
        this.renderer = null;
        this.isFullWindow = false;
        this.isFullScreen = false;
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;
        this.fullScreenMode = Player.FS_RESIZE;
        window.addEventListener("keyup", this.onWindowKeyboardEvent, true);
        window.addEventListener("keydown", this.onWindowKeyboardEvent, true);
        window.addEventListener("mousedown", this.onWindowMouseEvent, true);
        window.addEventListener("mousemove", this.onWindowMouseEvent, true);
        window.addEventListener("mouseout", this.onWindowMouseEvent, true);
        window.addEventListener("mouseover", this.onWindowMouseEvent, true);
        window.addEventListener("mouseup", this.onWindowMouseEvent, true);
        window.addEventListener("resize", this.onWindowResize, true);
        this.loop();
      }

      Player.prototype.getAnimationCallback = function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || setTimeout(callback, 1000 / 60);
      };

      Player.prototype.init = function() {
        if (this.renderer != null) {
          this.renderer.stepCount = this.stepCount;
          this.renderer.width = this.canvas.clientWidth;
          this.renderer.height = this.canvas.clientHeight;
          if (this.renderer.init != null) {
            return this.renderer.init();
          }
        }
      };

      Player.prototype.loop = function() {
        this.getAnimationCallback()(this.loop);
        if (this.renderer != null) {
          if (this.playing) {
            if (!this.renderer["static"]) {
              this.step();
              return this.render();
            } else {
              if (this.stepCount === 0) {
                this.step();
                return this.render();
              }
            }
          }
        }
      };

      Player.prototype.onWindowKeyboardEvent = function(event) {
        if (this.renderer != null) {
          switch (event.type) {
            case 'keydown':
              if (this.renderer.onKeyDown != null) {
                return this.renderer.onKeyDown(event.keyCode, event.altKey, event.ctrlKey, event.shiftKey, event.timeStamp);
              }
              break;
            case 'keyup':
              if (this.renderer.onKeyUp != null) {
                return this.renderer.onKeyUp(event.keyCode, event.altKey, event.ctrlKey, event.shiftKey, event.timeStamp);
              }
          }
        }
      };

      Player.prototype.onWindowMouseEvent = function(event) {
        var r, x, y;
        if (this.renderer != null) {
          r = this.canvas.getBoundingClientRect();
          x = event.clientX - r.left;
          y = event.clientY - r.top;
          this.renderer.mouseX = x;
          this.renderer.mouseY = y;
          if (event.target === this.canvas) {
            switch (event.type) {
              case "mousedown":
                this.renderer.mouseIsDown = true;
                if (this.renderer.onMouseDown != null) {
                  return this.renderer.onMouseDown(x, y);
                }
                break;
              case 'mousemove':
                if (this.renderer.mouseIsDown) {
                  this.renderer.mouseIsDragging = true;
                }
                if (this.renderer.onMouseMove != null) {
                  return this.renderer.onMouseMove(x, y);
                }
                break;
              case 'mouseout':
                if (this.renderer.onMouseOut != null) {
                  this.renderer.mouseIsOver = false;
                  return this.renderer.onMouseOut(x, y);
                }
                break;
              case 'mouseover':
                if (this.renderer.onMouseOver != null) {
                  this.renderer.mouseIsOver = true;
                  return this.renderer.onMouseOver(x, y);
                }
                break;
              case 'mouseup':
                this.renderer.mouseIsDown = false;
                this.renderer.mouseIsDragging = false;
                if (this.renderer.onMouseUp != null) {
                  return this.renderer.onMouseUp(x, y);
                }
            }
          } else {
            switch (event.type) {
              case "mouseup":
                this.renderer.mouseIsDown = false;
                this.renderer.mouseIsDragging = false;
                if (this.renderer.onMouseUp != null) {
                  return this.renderer.onMouseUp(-1, -1);
                }
            }
          }
        }
      };

      Player.prototype.onWindowResize = function(event) {
        if (this.isFullWindow) {
          if (this.canvas.width !== window.innerWidth) {
            this.canvas.width = window.innerWidth;
          }
          if (this.canvas.height !== window.innerHeight) {
            return this.canvas.height = window.innerHeight;
          }
        }
      };

      Player.prototype.pause = function() {
        return this.playing = false;
      };

      Player.prototype.render = function() {
        if (this.renderer.clear != null) {
          this.renderer.clear();
        }
        if (this.renderer.render != null) {
          return this.renderer.render();
        }
      };

      Player.prototype.play = function() {
        return this.playing = true;
      };

      Player.prototype.setFullWindow = function(full) {
        this.isFullWindow = full;
        if (full != null) {
          return this.onWindowResize();
        }
      };

      Player.prototype.setRenderer = function(newRenderer) {
        if (this.renderer != null) {
          this.renderer.removeListener('fullscreen', this.toggleFullscreen);
        }
        this.renderer = newRenderer;
        this.renderer.width = this.canvas.clientWidth;
        this.renderer.height = this.canvas.clientHeight;
        this.renderer.isFullScreen = this.isFullScreen;
        return this.renderer.addListener('fullscreen', this.toggleFullScreen);
      };

      Player.prototype.step = function() {
        if (this.renderer.looping && this.renderer.duration > 0) {
          if (this.stepCount > this.renderer.duration) {
            this.stepCount = 0;
          }
        }
        this.renderer.stepCount = this.stepCount;
        this.stepCount++;
        this.width = this.renderer.width = this.canvas.clientWidth;
        this.height = this.renderer.height = this.canvas.clientHeight;
        if (this.renderer.step != null) {
          return this.renderer.step();
        }
      };

      Player.prototype.stop = function() {
        this.stepCount = 0;
        this.playing = false;
        this.ctx.clearRect(0, 0, this.width, this.height);
        if (this.renderer != null) {
          if (this.renderer.clear != null) {
            return this.renderer.clear();
          }
        }
      };

      Player.prototype.toggleFullScreen = function() {
        if (this.isFullScreen) {
          this.isFullScreen = false;
          if (document.webkitCancelFullScreen != null) {
            document.webkitCancelFullScreen();
          }
          if (document.mozCancelFullScreen != null) {
            document.mozCancelFullScreen();
          }
          if (document.cancelFullScreen != null) {
            document.cancelFullScreen();
          }
          if (document.msCancelFullScreen != null) {
            document.msCanceFullScreen();
          }
        } else {
          this.isFullScreen = true;
          if (this.canvas.webkitRequestFullScreen != null) {
            this.canvas.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
          }
          if (this.canvas.mozRequestFullScreen != null) {
            this.canvas.mozRequestFullScreen();
          }
          if (this.canvas.requestFullScreen != null) {
            this.canvas.requestFullScreen();
          }
          if (this.canvas.msRequestFullScreen != null) {
            this.canvas.msRequestFullScreen();
          }
        }
        if (this.renderer != null) {
          return this.renderer.isFullScreen = this.isFullScreen;
        }
      };

      return Player;

    })();
  });

}).call(this);
