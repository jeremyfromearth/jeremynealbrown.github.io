(function() {
  define(function() {
    Array.shuffle = function(a) {
      var copy, r, result;
      result = [];
      copy = a.slice();
      console.log(copy);
      while (copy.length > 0) {
        r = Math.floor(Math.random() * copy.length);
        result.push(copy.splice(r, 1)[0]);
      }
      return result;
    };
    Array.NUMERIC = function(a, b) {
      return a - b;
    };
    Math.HALF_PI = Math.PI * .5;
    Math.QTR_PI = Math.PI * .25;
    Math.TWO_PI = Math.PI * 2;
    Math.average = function(terms) {
      return (Math.sum(terms)) / terms.length;
    };
    Math.clamp = function(n, min, max) {
      return Math.min(Math.max(n, min), max);
    };
    Math.hitTestCircle = function(px, py, x, y, r) {
      return Math.distance(px, py, x, y) <= r;
    };
    Math.hitTestRectangle = function(px, py, x, y, w, h) {
      return px >= x && px <= x + w && py >= y && py <= y + h;
    };
    Math.hitTestRing = function(px, py, x, y, r1, r2) {
      var d;
      d = Math.distance(px, py, x, y);
      return d > r1 && d < r2;
    };
    Math.hitTestTriangle = function(px, py, p1, p2, p3) {
      var A, s, sign, t, x0, x1, x2, y0, y1, y2;
      x0 = p1[0];
      y0 = p1[1];
      x1 = p2[0];
      y1 = p2[1];
      x2 = p3[0];
      y2 = p3[1];
      A = .5 * (-y1 * x2 + y0 * (-x1 + x2) + x0 * (y1 - y2) + x1 * y2);
      s = y0 * x2 - x0 * y2 + (y2 - y0) * px + (x0 - x2) * py;
      t = x0 * y1 - y0 * x1 + (y0 - y1) * px + (x1 - x0) * py;
      sign = A < 0 ? -1 : 1;
      s *= sign;
      t *= sign;
      return s > 0 && t > 0 && (s + t) < 2 * A * sign;
    };
    Math.hitTestWedge = function(px, py, x, y, r, startAngle, endAngle) {
      return false;
    };
    Math.distance = function(x1, y1, x2, y2) {
      var dx, dy;
      dx = x1 - x2;
      dy = y1 - y2;
      dx *= dx;
      dy *= dy;
      return Math.sqrt(dx + dy);
    };
    Math.hexToRGB = function(hex) {
      return [hex >> 16, (hex >> 8) & 0xff, hex & 0xff];
    };
    Math.interpolateLin = function(n, min, max) {
      return min + ((max - min) * n);
    };
    Math.normalize = function(n, min, max) {
      return (n - min) / (max - min);
    };
    Math.randomColor = function() {
      var b, g, r;
      r = Math.randomInRange(0, 255, true);
      g = Math.randomInRange(0, 255, true);
      b = Math.randomInRange(0, 255, true);
      return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    };
    Math.randomInRange = function(min, max, round) {
      var n;
      if (round == null) {
        round = false;
      }
      n = min + (max - min) * Math.random();
      if (round) {
        return Math.round(n);
      }
      return n;
    };
    Math.roundTo = function(n, decimals) {
      return Math.round(n * Math.pow(10, decimals)) / Math.pow(10, decimals);
    };
    Math.roundToMultiple = function(n, multiple) {
      return multiple * Math.round(n / multiple);
    };
    Math.toRadians = function(degrees) {
      return Math.PI * degrees / 180;
    };
    Math.sum = function(terms) {
      var i, len, n, x;
      n = 0;
      for (i = 0, len = terms.length; i < len; i++) {
        x = terms[i];
        n += x;
      }
      return n;
    };
    Math.transpose = function(n, min1, max1, min2, max2) {
      return Math.interpolateLin(Math.normalize(n, min1, max1), min2, max2);
    };
    Math.within = function(x, gt, lt) {
      return x >= gt && x <= lt;
    };
    String.alphabet = function() {
      return 'abcdefghijklmnopqrstuvwxyz';
    };
    return String.numerics = function() {
      return '0123456789';
    };
  });

}).call(this);
