(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['spectrum/Dispatcher', 'spectrum/Utils'], function(Dispatcher) {
    var Renderer;
    return Renderer = (function(superClass) {
      extend(Renderer, superClass);

      function Renderer(ctx) {
        this.ctx = ctx;
        this.width = 0;
        this.height = 0;
        this["static"] = false;
        this.looping = false;
        this.duration = 0;
        this.bg = "#CCCCCC";
        this.isFullScreen = false;
        this.stepCount = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseIsDown = false;
        this.mouseIsOver = false;
        this.mouseIsDragging = false;
      }

      Renderer.prototype.alpha = function(a) {
        return this.ctx.globalAlpha = a;
      };

      Renderer.prototype.arc = function(x, y, radius, startAngle, endAngle, solid) {
        if (solid == null) {
          solid = true;
        }
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, startAngle, endAngle);
        if (solid) {
          this.ctx.fill();
        } else {
          this.ctx.stroke();
        }
        return this.ctx.closePath();
      };

      Renderer.prototype.bezier = function(cp1x, cp1y, cp2x, cp2y, x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
        this.ctx.stroke();
        return this.ctx.closePath();
      };

      Renderer.prototype.circle = function(x, y, radius, solid) {
        if (solid == null) {
          solid = true;
        }
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.TWO_PI, false);
        if (solid) {
          this.ctx.fill();
        } else {
          this.ctx.stroke();
        }
        return this.ctx.closePath();
      };

      Renderer.prototype.circles = function(pointList, radius, solid) {
        var j, len, p, results;
        if (solid == null) {
          solid = true;
        }
        if (pointList.length === 0) {
          return;
        }
        results = [];
        for (j = 0, len = pointList.length; j < len; j++) {
          p = pointList[j];
          results.push(this.circle(p[0], p[1], radius, solid));
        }
        return results;
      };

      Renderer.prototype.clear = function() {
        this.ctx.save();
        this.ctx.globalAlpha = 1;
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.color(this.bg);
        this.rectangle(0, 0, this.width, this.height);
        return this.ctx.restore();
      };

      Renderer.prototype.color = function(color) {
        return this.ctx.fillStyle = this.ctx.strokeStyle = color;
      };

      Renderer.prototype.font = function(style) {
        return this.ctx.font = style;
      };

      Renderer.prototype.fullscreen = function() {
        return this.dispatch('fullscreen');
      };

      Renderer.prototype.grid = function(x, y, rows, columns, width, height) {
        var colWidth, i, j, k, ref, ref1, results, rowHeight, xpos, ypos;
        rowHeight = height / rows;
        colWidth = width / columns;
        for (i = j = 0, ref = rows; j <= ref; i = j += 1) {
          ypos = (Math.round(y + i * rowHeight)) + .5;
          this.line(x, ypos, x + width, ypos);
        }
        results = [];
        for (i = k = 0, ref1 = columns; k <= ref1; i = k += 1) {
          xpos = (Math.round(x + i * colWidth)) + .5;
          results.push(this.line(xpos, y, xpos, y + height));
        }
        return results;
      };

      Renderer.prototype.line = function(x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        return this.ctx.closePath();
      };

      Renderer.prototype.lineStyle = function(lineWidth, jointStyle, capStyle) {
        if (lineWidth == null) {
          lineWidth = 1.0;
        }
        if (jointStyle == null) {
          jointStyle = "round";
        }
        if (capStyle == null) {
          capStyle = "round";
        }
        this.ctx.lineWidth = lineWidth;
        this.ctx.lineJoin = jointStyle;
        return this.ctx.lineCap = capStyle;
      };

      Renderer.prototype.shape = function(pointList, solid, closed) {
        var j, len, p;
        if (solid == null) {
          solid = true;
        }
        if (closed == null) {
          closed = true;
        }
        if (pointList.length === 0) {
          return;
        }
        this.ctx.beginPath();
        for (j = 0, len = pointList.length; j < len; j++) {
          p = pointList[j];
          this.ctx.lineTo(p[0], p[1]);
        }
        if (closed) {
          this.ctx.closePath();
          if (solid) {
            return this.ctx.fill();
          } else {
            return this.ctx.stroke();
          }
        } else {
          if (solid) {
            this.ctx.fill();
          } else {
            this.ctx.stroke();
          }
          return this.ctx.closePath();
        }
      };

      Renderer.prototype.polygon = function(x, y, radius, sides, solid) {
        var angle, i, inc, j, points, ref;
        if (sides == null) {
          sides = 3;
        }
        if (solid == null) {
          solid = true;
        }
        points = [];
        inc = Math.TWO_PI / sides;
        for (i = j = 0, ref = sides; j <= ref; i = j += 1) {
          angle = i * inc;
          points.push([x + Math.cos(angle) * radius, y + Math.sin(angle) * radius]);
        }
        return this.shape(points, solid, true);
      };

      Renderer.prototype.polygonRing = function(x, y, innerRadius, outerRadius, innerSides, outerSides, arcLength, solid) {
        var inc, j, k, n, p, ref, ref1;
        if (innerSides == null) {
          innerSides = 90;
        }
        if (outerSides == null) {
          outerSides = 90;
        }
        if (arcLength == null) {
          arcLength = Math.TWO_PI;
        }
        if (solid == null) {
          solid = true;
        }
        p = {
          x: 0,
          y: 0
        };
        inc = arcLength / outerSides;
        this.ctx.beginPath();
        for (n = j = 0, ref = outerSides; j <= ref; n = j += 1) {
          p.x = x + Math.cos(inc * n) * outerRadius;
          p.y = y + Math.sin(inc * n) * outerRadius;
          this.ctx.lineTo(p.x, p.y);
        }
        inc = arcLength / innerSides;
        for (n = k = ref1 = innerSides; k >= 0; n = k += -1) {
          p.x = x + Math.cos(inc * n) * innerRadius;
          p.y = y + Math.sin(inc * n) * innerRadius;
          if (n === innerSides) {
            this.ctx.moveTo(p.x, p.y);
          }
          this.ctx.lineTo(p.x, p.y);
        }
        this.ctx.closePath();
        if (solid) {
          return this.ctx.fill();
        } else {
          return this.ctx.stroke();
        }
      };

      Renderer.prototype.randomColor = function() {
        return "rgb(" + (Math.floor(Math.random() * 256)).toString() + ',' + (Math.floor(Math.random() * 256)).toString() + ',' + (Math.floor(Math.random() * 256)).toString() + ")";
      };

      Renderer.prototype.rectangle = function(x, y, width, height, solid) {
        if (solid == null) {
          solid = true;
        }
        if (solid) {
          return this.ctx.fillRect(x, y, width, height);
        } else {
          return this.ctx.strokeRect(x, y, width, height);
        }
      };

      Renderer.prototype.restoreTransform = function() {
        return this.ctx.restore();
      };

      Renderer.prototype.rotate = function(theta) {
        return this.ctx.rotate(theta);
      };

      Renderer.prototype.roundedRectangle = function(x, y, width, height, cornerRadius, solid) {
        if (solid == null) {
          solid = true;
        }
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + cornerRadius);
        this.ctx.lineTo(x, y + height - cornerRadius);
        this.ctx.quadraticCurveTo(x, y + height, x + cornerRadius, y + height);
        this.ctx.lineTo(x + width - cornerRadius, y + height);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - cornerRadius);
        this.ctx.lineTo(x + width, y + cornerRadius);
        this.ctx.quadraticCurveTo(x + width, y, x + width - cornerRadius, y);
        this.ctx.lineTo(x + cornerRadius, y);
        this.ctx.quadraticCurveTo(x, y, x, y + cornerRadius);
        if (solid) {
          return this.ctx.fill();
        } else {
          return this.ctx.stroke();
        }
      };

      Renderer.prototype.saveTransform = function() {
        return this.ctx.save();
      };

      Renderer.prototype.shadow = function(offsetX, offsetY, blur, color) {
        this.ctx.shadowOffsetX = offsetX;
        this.ctx.shadowOffsetY = offsetY;
        this.ctx.shadowBlur = blur;
        return this.ctx.shadowColor = color;
      };

      Renderer.prototype.shadowClear = function() {
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        return this.ctx.shadowBlur = 0;
      };

      Renderer.prototype.scale = function(scaleX, scaleY) {
        return this.ctx.scale(scaleX, scaleY);
      };

      Renderer.prototype.text = function(x, y, text, solid) {
        if (solid == null) {
          solid = true;
        }
        if (solid) {
          return this.ctx.fillText(text, x, y);
        } else {
          return this.ctx.strokeText(text, x, y);
        }
      };

      Renderer.prototype.translate = function(x, y) {
        return this.ctx.translate(x, y);
      };

      Renderer.prototype.wedge = function(x, y, radius, startAngle, endAngle, solid) {
        if (solid == null) {
          solid = true;
        }
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, startAngle, endAngle);
        this.ctx.lineTo(x, y);
        this.ctx.closePath();
        if (solid) {
          return this.ctx.fill();
        } else {
          return this.ctx.stroke();
        }
      };

      return Renderer;

    })(Dispatcher);
  });

}).call(this);
