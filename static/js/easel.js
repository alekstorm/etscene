/**
* EaselJS
* Visit http://easeljs.com/ for documentation, updates and examples.
*
* Copyright (c) 2011 Grant Skinner
* 
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
* 
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
**/
// Input 0
(function(k) {
  var c = function() {
    throw"UID cannot be instantiated";
  };
  c._nextID = 0;
  c.get = function() {
    return c._nextID++
  };
  k.UID = c
})(window);
// Input 1
(function(k) {
  var c = function() {
    throw"Ticker cannot be instantiated.";
  };
  c.useInterval = true;
  c._listeners = null;
  c._pauseable = null;
  c._paused = false;
  c._inited = false;
  c._startTime = 0;
  c._pausedTime = 0;
  c._ticks = 0;
  c._pausedTickers = 0;
  c._interval = 50;
  c._lastTime = 0;
  c._times = null;
  c._tickTimes = null;
  c._rafActive = false;
  c.addListener = function(a, b) {
    c._inited || c.init();
    c.removeListener(a);
    c._pauseable[c._listeners.length] = b == null ? true : b;
    c._listeners.push(a)
  };
  c.init = function() {
    c._inited = true;
    c._times = [];
    c._tickTimes = [];
    c._pauseable = [];
    c._listeners = [];
    c._times.push(c._startTime = c._getTime());
    c.setInterval(c._interval)
  };
  c.removeListener = function(a) {
    c._listeners != null && (a = c._listeners.indexOf(a), a != -1 && (c._listeners.splice(a, 1), c._pauseable.splice(a, 1)))
  };
  c.removeAllListeners = function() {
    c._listeners = [];
    c._pauseable = []
  };
  c.setInterval = function(a) {
    c._lastTime = c._getTime();
    c._interval = a;
    if(!c.useInterval) {
      var b = k.requestAnimationFrame || k.webkitRequestAnimationFrame || k.mozRequestAnimationFrame || k.oRequestAnimationFrame || k.msRequestAnimationFrame;
      if(b) {
        b(c._handleAF);
        c._rafFunction = b;
        return
      }
    }
    setTimeout(c._handleTimeout, a)
  };
  c.getInterval = function() {
    return c._interval
  };
  c.setFPS = function(a) {
    c.setInterval(1E3 / a)
  };
  c.getFPS = function() {
    return 1E3 / c._interval
  };
  c.getMeasuredFPS = function(a) {
    if(c._times.length < 2) {
      return-1
    }
    a == null && (a = c.getFPS() >> 1);
    a = Math.min(c._times.length - 1, a);
    return 1E3 / ((c._times[0] - c._times[a]) / a)
  };
  c.setPaused = function(a) {
    c._paused = a
  };
  c.getPaused = function() {
    return c._paused
  };
  c.getTime = function(a) {
    return c._getTime() - c._startTime - (a ? c._pausedTime : 0)
  };
  c.getTicks = function(a) {
    return c._ticks - (a ? c._pausedTickers : 0)
  };
  c._handleAF = function(a) {
    console.log(c._rafFunction);
    a - c._lastTime >= c._interval - 1 && c._tick();
    (k.requestAnimationFrame || k.webkitRequestAnimationFrame || k.mozRequestAnimationFrame || k.oRequestAnimationFrame || k.msRequestAnimationFrame)(c._handleAF, c.animationTarget)
  };
  c._handleTimeout = function() {
    c._tick();
    setTimeout(c._handleTimeout, c._interval)
  };
  c._tick = function() {
    c._ticks++;
    var a = c._getTime(), b = a - c._lastTime, t = c._paused;
    t && (c._pausedTickers++, c._pausedTime += b);
    c._lastTime = a;
    for(var h = c._pauseable, e = c._listeners.slice(), d = e ? e.length : 0, f = 0;f < d;f++) {
      var g = h[f], i = e[f];
      i == null || t && g || i.tick == null || i.tick(b)
    }
    for(c._tickTimes.unshift(c._getTime() - a);c._tickTimes.length > 100;) {
      c._tickTimes.pop()
    }
    for(c._times.unshift(a);c._times.length > 100;) {
      c._times.pop()
    }
  };
  c._getTime = function() {
    return(new Date).getTime()
  };
  k.Ticker = c
})(window);
// Input 2
(function(k) {
  var c = function(b, a, h, c, d) {
    this.initialize(b, a, h, c, d)
  }, a = c.prototype;
  a.stageX = 0;
  a.stageY = 0;
  a.type = null;
  a.nativeEvent = null;
  a.onMouseMove = null;
  a.onMouseUp = null;
  a.target = null;
  a.initialize = function(b, a, h, c, d) {
    this.type = b;
    this.stageX = a;
    this.stageY = h;
    this.target = c;
    this.nativeEvent = d
  };
  a.clone = function() {
    return new c(this.type, this.stageX, this.stageY, this.target, this.nativeEvent)
  };
  a.toString = function() {
    return"[MouseEvent (type=" + this.type + " stageX=" + this.stageX + " stageY=" + this.stageY + ")]"
  };
  k.MouseEvent = c
})(window);
// Input 3
(function(k) {
  var c = function(b, a, h, c, d, f) {
    this.initialize(b, a, h, c, d, f)
  }, a = c.prototype;
  c.identity = null;
  c.DEG_TO_RAD = Math.PI / 180;
  a.a = 1;
  a.b = 0;
  a.c = 0;
  a.d = 1;
  a.tx = 0;
  a.ty = 0;
  a.alpha = 1;
  a.shadow = null;
  a.compositeOperation = null;
  a.initialize = function(b, a, h, c, d, f) {
    if(b != null) {
      this.a = b
    }
    this.b = a || 0;
    this.c = h || 0;
    if(c != null) {
      this.d = c
    }
    this.tx = d || 0;
    this.ty = f || 0
  };
  a.prepend = function(b, a, h, c, d, f) {
    var g = this.tx;
    if(b != 1 || a != 0 || h != 0 || c != 1) {
      var i = this.a, j = this.c;
      this.a = i * b + this.b * h;
      this.b = i * a + this.b * c;
      this.c = j * b + this.d * h;
      this.d = j * a + this.d * c
    }
    this.tx = g * b + this.ty * h + d;
    this.ty = g * a + this.ty * c + f
  };
  a.append = function(b, a, c, e, d, f) {
    var g = this.a, i = this.b, j = this.c, l = this.d;
    this.a = b * g + a * j;
    this.b = b * i + a * l;
    this.c = c * g + e * j;
    this.d = c * i + e * l;
    this.tx = d * g + f * j + this.tx;
    this.ty = d * i + f * l + this.ty
  };
  a.prependMatrix = function(b) {
    this.prepend(b.a, b.b, b.c, b.d, b.tx, b.ty);
    this.prependProperties(b.alpha, b.shadow, b.compositeOperation)
  };
  a.appendMatrix = function(b) {
    this.append(b.a, b.b, b.c, b.d, b.tx, b.ty);
    this.appendProperties(b.alpha, b.shadow, b.compositeOperation)
  };
  a.prependTransform = function(b, a, h, e, d, f, g, i, j) {
    if(d % 360) {
      var l = d * c.DEG_TO_RAD, d = Math.cos(l), l = Math.sin(l)
    }else {
      d = 1, l = 0
    }
    if(i || j) {
      this.tx -= i, this.ty -= j
    }
    f || g ? (f *= c.DEG_TO_RAD, g *= c.DEG_TO_RAD, this.prepend(d * h, l * h, -l * e, d * e, 0, 0), this.prepend(Math.cos(g), Math.sin(g), -Math.sin(f), Math.cos(f), b, a)) : this.prepend(d * h, l * h, -l * e, d * e, b, a)
  };
  a.appendTransform = function(b, a, h, e, d, f, g, i, j) {
    if(d % 360 == 0 && h == 1 && e == 1 && f == 0 && g == 0) {
      this.tx += b - i, this.ty += a - j
    }else {
      if(d % 360) {
        var l = d * c.DEG_TO_RAD, d = Math.cos(l), l = Math.sin(l)
      }else {
        d = 1, l = 0
      }
      f || g ? (f *= c.DEG_TO_RAD, g *= c.DEG_TO_RAD, this.append(Math.cos(g), Math.sin(g), -Math.sin(f), Math.cos(f), b, a), this.append(d * h, l * h, -l * e, d * e, 0, 0)) : this.append(d * h, l * h, -l * e, d * e, b, a);
      if(i || j) {
        this.tx -= i * this.a + j * this.c, this.ty -= i * this.b + j * this.d
      }
    }
  };
  a.rotate = function(b) {
    var a = Math.cos(b), b = Math.sin(b), c = this.a, e = this.c, d = this.tx;
    this.a = c * a - this.b * b;
    this.b = c * b + this.b * a;
    this.c = e * a - this.d * b;
    this.d = e * b + this.d * a;
    this.tx = d * a - this.ty * b;
    this.ty = d * b + this.ty * a
  };
  a.skew = function(b, a) {
    b *= c.DEG_TO_RAD;
    a *= c.DEG_TO_RAD;
    this.append(Math.cos(a), Math.sin(a), -Math.sin(b), Math.cos(b), 0, 0)
  };
  a.scale = function(b, a) {
    this.a *= b;
    this.d *= a;
    this.tx *= b;
    this.ty *= a
  };
  a.translate = function(b, a) {
    this.tx += b;
    this.ty += a
  };
  a.identity = function() {
    this.alpha = this.a = this.d = 1;
    this.b = this.c = this.tx = this.ty = 0;
    this.shadow = this.compositeOperation = null
  };
  a.invert = function() {
    var b = this.a, a = this.b, c = this.c, e = this.d, d = this.tx, f = b * e - a * c;
    this.a = e / f;
    this.b = -a / f;
    this.c = -c / f;
    this.d = b / f;
    this.tx = (c * this.ty - e * d) / f;
    this.ty = -(b * this.ty - a * d) / f
  };
  a.isIdentity = function() {
    return this.tx == 0 && this.ty == 0 && this.a == 1 && this.b == 0 && this.c == 0 && this.d == 1
  };
  a.decompose = function(b) {
    b == null && (b = {});
    b.x = this.tx;
    b.y = this.ty;
    b.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
    b.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);
    var a = Math.atan2(-this.c, this.d), h = Math.atan2(this.b, this.a);
    a == h ? (b.rotation = h / c.DEG_TO_RAD, this.a < 0 && this.d >= 0 && (b.rotation += b.rotation <= 0 ? 180 : -180), b.skewX = b.skewY = 0) : (b.skewX = a / c.DEG_TO_RAD, b.skewY = h / c.DEG_TO_RAD);
    return b
  };
  a.reinitialize = function(b, a, c, e, d, f, g, i, j) {
    this.initialize(b, a, c, e, d, f);
    this.alpha = g || 1;
    this.shadow = i;
    this.compositeOperation = j;
    return this
  };
  a.appendProperties = function(b, a, c) {
    this.alpha *= b;
    this.shadow = a || this.shadow;
    this.compositeOperation = c || this.compositeOperation
  };
  a.prependProperties = function(b, a, c) {
    this.alpha *= b;
    this.shadow = this.shadow || a;
    this.compositeOperation = this.compositeOperation || c
  };
  a.clone = function() {
    var b = new c(this.a, this.b, this.c, this.d, this.tx, this.ty);
    b.shadow = this.shadow;
    b.alpha = this.alpha;
    b.compositeOperation = this.compositeOperation;
    return b
  };
  a.toString = function() {
    return"[Matrix2D (a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + ")]"
  };
  c.identity = new c(1, 0, 0, 1, 0, 0);
  k.Matrix2D = c
})(window);
// Input 4
(function(k) {
  var c = function(b, a) {
    this.initialize(b, a)
  }, a = c.prototype;
  a.x = 0;
  a.y = 0;
  a.initialize = function(b, a) {
    this.x = b == null ? 0 : b;
    this.y = a == null ? 0 : a
  };
  a.clone = function() {
    return new c(this.x, this.y)
  };
  a.toString = function() {
    return"[Point (x=" + this.x + " y=" + this.y + ")]"
  };
  k.Point = c
})(window);
// Input 5
(function(k) {
  var c = function(b, a, c, e) {
    this.initialize(b, a, c, e)
  }, a = c.prototype;
  a.x = 0;
  a.y = 0;
  a.width = 0;
  a.height = 0;
  a.initialize = function(b, a, c, e) {
    this.x = b == null ? 0 : b;
    this.y = a == null ? 0 : a;
    this.width = c == null ? 0 : c;
    this.height = e == null ? 0 : e
  };
  a.clone = function() {
    return new c(this.x, this.y, this.width, this.height)
  };
  a.toString = function() {
    return"[Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + ")]"
  };
  k.Rectangle = c
})(window);
// Input 6
(function(k) {
  var c = function(b, a, c, e) {
    this.initialize(b, a, c, e)
  }, a = c.prototype;
  c.identity = null;
  a.color = null;
  a.offsetX = 0;
  a.offsetY = 0;
  a.blur = 0;
  a.initialize = function(b, a, c, e) {
    this.color = b;
    this.offsetX = a;
    this.offsetY = c;
    this.blur = e
  };
  a.toString = function() {
    return"[Shadow]"
  };
  a.clone = function() {
    return new c(this.color, this.offsetX, this.offsetY, this.blur)
  };
  c.identity = new c("transparent", 0, 0, 0);
  k.Shadow = c
})(window);
// Input 7
(function(k) {
  var c = function(b, a, c, e) {
    this.initialize(b, a, c, e)
  }, a = c.prototype;
  a.image = null;
  a.frameWidth = 0;
  a.frameHeight = 0;
  a.frameData = null;
  a.loop = true;
  a.totalFrames = 0;
  a.initialize = function(b, a, c, e) {
    typeof b == "string" ? (this.image = new Image, this.image.src = b) : this.image = b;
    this.frameWidth = a;
    this.frameHeight = c;
    this.frameData = e
  };
  a.toString = function() {
    return"[SpriteSheet]"
  };
  a.clone = function() {
    var b = new c(this.image, this.frameWidth, this.frameHeight, this.frameData);
    b.loop = this.loop;
    b.totalFrames = this.totalFrames;
    return b
  };
  k.SpriteSheet = c
})(window);
// Input 8
(function(k) {
  function c(b, a) {
    this.f = b;
    this.params = a
  }
  c.prototype.exec = function(b) {
    this.f.apply(b, this.params)
  };
  var a = function() {
    this.initialize()
  }, b = a.prototype;
  a.getRGB = function(b, a, c, d) {
    b != null && c == null && (d = a, c = b & 255, a = b >> 8 & 255, b = b >> 16 & 255);
    return d == null ? "rgb(" + b + "," + a + "," + c + ")" : "rgba(" + b + "," + a + "," + c + "," + d + ")"
  };
  a.getHSL = function(b, a, c, d) {
    return d == null ? "hsl(" + b % 360 + "," + a + "%," + c + "%)" : "hsla(" + b % 360 + "," + a + "%," + c + "%," + d + ")"
  };
  a.STROKE_CAPS_MAP = ["butt", "round", "square"];
  a.STROKE_JOINTS_MAP = ["miter", "round", "bevel"];
  a._ctx = document.createElement("canvas").getContext("2d");
  a.beginCmd = new c(a._ctx.beginPath, []);
  a.fillCmd = new c(a._ctx.fill, []);
  a.strokeCmd = new c(a._ctx.stroke, []);
  b._strokeInstructions = null;
  b._strokeStyleInstructions = null;
  b._fillInstructions = null;
  b._instructions = null;
  b._oldInstructions = null;
  b._activeInstructions = null;
  b._active = false;
  b._dirty = false;
  b.initialize = function() {
    this.clear();
    this._ctx = a._ctx
  };
  b.draw = function(b) {
    this._dirty && this._updateInstructions();
    for(var a = this._instructions, c = 0, d = a.length;c < d;c++) {
      a[c].exec(b)
    }
  };
  b.moveTo = function(b, a) {
    this._activeInstructions.push(new c(this._ctx.moveTo, [b, a]));
    return this
  };
  b.lineTo = function(b, a) {
    this._dirty = this._active = true;
    this._activeInstructions.push(new c(this._ctx.lineTo, [b, a]));
    return this
  };
  b.arcTo = function(b, a, e, d, f) {
    this._dirty = this._active = true;
    this._activeInstructions.push(new c(this._ctx.arcTo, [b, a, e, d, f]));
    return this
  };
  b.arc = function(b, a, e, d, f, g) {
    this._dirty = this._active = true;
    g == null && (g = false);
    this._activeInstructions.push(new c(this._ctx.arc, [b, a, e, d, f, g]));
    return this
  };
  b.quadraticCurveTo = function(b, a, e, d) {
    this._dirty = this._active = true;
    this._activeInstructions.push(new c(this._ctx.quadraticCurveTo, [b, a, e, d]));
    return this
  };
  b.bezierCurveTo = function(b, a, e, d, f, g) {
    this._dirty = this._active = true;
    this._activeInstructions.push(new c(this._ctx.bezierCurveTo, [b, a, e, d, f, g]));
    return this
  };
  b.rect = function(b, a, e, d) {
    this._dirty = this._active = true;
    this._activeInstructions.push(new c(this._ctx.rect, [b, a, e, d]));
    return this
  };
  b.closePath = function() {
    if(this._active) {
      this._dirty = true, this._activeInstructions.push(new c(this._ctx.closePath, []))
    }
    return this
  };
  b.clear = function() {
    this._instructions = [];
    this._oldInstructions = [];
    this._activeInstructions = [];
    this._strokeStyleInstructions = this._strokeInstructions = this._fillInstructions = null;
    this._active = this._dirty = false;
    return this
  };
  b.beginFill = function(b) {
    this._active && this._newPath();
    this._fillInstructions = b ? [new c(this._setProp, ["fillStyle", b])] : null;
    return this
  };
  b.beginLinearGradientFill = function(b, a, e, d, f, g) {
    this._active && this._newPath();
    e = this._ctx.createLinearGradient(e, d, f, g);
    d = 0;
    for(f = b.length;d < f;d++) {
      e.addColorStop(a[d], b[d])
    }
    this._fillInstructions = [new c(this._setProp, ["fillStyle", e])];
    return this
  };
  b.beginRadialGradientFill = function(b, a, e, d, f, g, i, j) {
    this._active && this._newPath();
    e = this._ctx.createRadialGradient(e, d, f, g, i, j);
    d = 0;
    for(f = b.length;d < f;d++) {
      e.addColorStop(a[d], b[d])
    }
    this._fillInstructions = [new c(this._setProp, ["fillStyle", e])];
    return this
  };
  b.beginBitmapFill = function(b, a) {
    this._active && this._newPath();
    var e = this._ctx.createPattern(b, a || "");
    this._fillInstructions = [new c(this._setProp, ["fillStyle", e])];
    return this
  };
  b.endFill = function() {
    this.beginFill(null);
    return this
  };
  b.setStrokeStyle = function(b, h, e, d) {
    this._active && this._newPath();
    this._strokeStyleInstructions = [new c(this._setProp, ["lineWidth", b == null ? "1" : b]), new c(this._setProp, ["lineCap", h == null ? "butt" : isNaN(h) ? h : a.STROKE_CAPS_MAP[h]]), new c(this._setProp, ["lineJoin", e == null ? "miter" : isNaN(e) ? e : a.STROKE_JOINTS_MAP[e]]), new c(this._setProp, ["miterLimit", d == null ? "10" : d])];
    return this
  };
  b.beginStroke = function(b) {
    this._active && this._newPath();
    this._strokeInstructions = b ? [new c(this._setProp, ["strokeStyle", b])] : null;
    return this
  };
  b.beginLinearGradientStroke = function(b, a, e, d, f, g) {
    this._active && this._newPath();
    e = this._ctx.createLinearGradient(e, d, f, g);
    d = 0;
    for(f = b.length;d < f;d++) {
      e.addColorStop(a[d], b[d])
    }
    this._strokeInstructions = [new c(this._setProp, ["strokeStyle", e])];
    return this
  };
  b.beginRadialGradientStroke = function(b, a, e, d, f, g, i, j) {
    this._active && this._newPath();
    e = this._ctx.createRadialGradient(e, d, f, g, i, j);
    d = 0;
    for(f = b.length;d < f;d++) {
      e.addColorStop(a[d], b[d])
    }
    this._strokeInstructions = [new c(this._setProp, ["strokeStyle", e])];
    return this
  };
  b.beginBitmapStroke = function(b, a) {
    this._active && this._newPath();
    var e = this._ctx.createPattern(b, a || "");
    this._strokeInstructions = [new c(this._setProp, ["strokeStyle", e])];
    return this
  };
  b.endStroke = function() {
    this.beginStroke(null);
    return this
  };
  b.curveTo = b.quadraticCurveTo;
  b.drawRect = b.rect;
  b.drawRoundRect = function(b, a, c, d, f) {
    this.drawRoundRectComplex(b, a, c, d, f, f, f, f);
    return this
  };
  b.drawRoundRectComplex = function(b, a, e, d, f, g, i, j) {
    this._dirty = this._active = true;
    this._activeInstructions.push(new c(this._ctx.moveTo, [b + f, a]), new c(this._ctx.lineTo, [b + e - g, a]), new c(this._ctx.arc, [b + e - g, a + g, g, -Math.PI / 2, 0, false]), new c(this._ctx.lineTo, [b + e, a + d - i]), new c(this._ctx.arc, [b + e - i, a + d - i, i, 0, Math.PI / 2, false]), new c(this._ctx.lineTo, [b + j, a + d]), new c(this._ctx.arc, [b + j, a + d - j, j, Math.PI / 2, Math.PI, false]), new c(this._ctx.lineTo, [b, a + f]), new c(this._ctx.arc, [b + f, a + f, f, Math.PI, Math.PI * 
    3 / 2, false]));
    return this
  };
  b.drawCircle = function(b, a, c) {
    this.arc(b, a, c, 0, Math.PI * 2);
    return this
  };
  b.drawImage = function() {
    this._dirty = this._active = true;
    this._activeInstructions.push(new c(this._ctx.drawImage, Array.prototype.slice.call(arguments)));
    return this
  };
  b.drawEllipse = function(b, a, e, d) {
    this._dirty = this._active = true;
    var f = e / 2 * 0.5522848, g = d / 2 * 0.5522848, i = b + e, j = a + d, e = b + e / 2, d = a + d / 2;
    this._activeInstructions.push(new c(this._ctx.moveTo, [b, d]), new c(this._ctx.bezierCurveTo, [b, d - g, e - f, a, e, a]), new c(this._ctx.bezierCurveTo, [e + f, a, i, d - g, i, d]), new c(this._ctx.bezierCurveTo, [i, d + g, e + f, j, e, j]), new c(this._ctx.bezierCurveTo, [e - f, j, b, d + g, b, d]));
    return this
  };
  b.drawPolyStar = function(b, a, e, d, f, g) {
    this._dirty = this._active = true;
    f == null && (f = 0);
    f = 1 - f;
    g == null ? g = 0 : g /= 180 / Math.PI;
    var i = Math.PI / d;
    this._activeInstructions.push(new c(this._ctx.moveTo, [b + Math.cos(g) * e, a + Math.sin(g) * e]));
    for(var j = 0;j < d;j++) {
      g += i, f != 1 && this._activeInstructions.push(new c(this._ctx.lineTo, [b + Math.cos(g) * e * f, a + Math.sin(g) * e * f])), g += i, this._activeInstructions.push(new c(this._ctx.lineTo, [b + Math.cos(g) * e, a + Math.sin(g) * e]))
    }
    return this
  };
  b.clone = function() {
    var b = new a;
    b._instructions = this._instructions.slice();
    b._activeInstructions = this._activeInstructions.slice();
    b._oldInstructions = this._oldInstructions.slice();
    if(this._fillInstructions) {
      b._fillInstructions = this._fillInstructions.slice()
    }
    if(this._strokeInstructions) {
      b._strokeInstructions = this._strokeInstructions.slice()
    }
    if(this._strokeStyleInstructions) {
      b._strokeStyleInstructions = this._strokeStyleInstructions.slice()
    }
    b._active = this._active;
    b._dirty = this._dirty;
    return b
  };
  b.toString = function() {
    return"[Graphics]"
  };
  b.mt = b.moveTo;
  b.lt = b.lineTo;
  b.at = b.arcTo;
  b.bt = b.bezierCurveTo;
  b.qt = b.quadraticCurveTo;
  b.a = b.arc;
  b.r = b.rect;
  b.cp = b.closePath;
  b.c = b.clear;
  b.f = b.beginFill;
  b.lf = b.beginLinearGradientFill;
  b.rf = b.beginRadialGradientFill;
  b.bf = b.beginBitmapFill;
  b.ef = b.endFill;
  b.ss = b.setStrokeStyle;
  b.s = b.beginStroke;
  b.ls = b.beginLinearGradientStroke;
  b.rs = b.beginRadialGradientStroke;
  b.bs = b.beginBitmapStroke;
  b.es = b.endStroke;
  b.dr = b.drawRect;
  b.rr = b.drawRoundRect;
  b.rc = b.drawRoundRectComplex;
  b.dc = b.drawCircle;
  b.di = b.drawImage;
  b.de = b.drawEllipse;
  b.dp = b.drawPolyStar;
  b._updateInstructions = function() {
    this._instructions = this._oldInstructions.slice();
    this._instructions.push(a.beginCmd);
    this._fillInstructions && this._instructions.push.apply(this._instructions, this._fillInstructions);
    this._strokeInstructions && (this._instructions.push.apply(this._instructions, this._strokeInstructions), this._strokeStyleInstructions && this._instructions.push.apply(this._instructions, this._strokeStyleInstructions));
    this._instructions.push.apply(this._instructions, this._activeInstructions);
    this._fillInstructions && this._instructions.push(a.fillCmd);
    this._strokeInstructions && this._instructions.push(a.strokeCmd)
  };
  b._newPath = function() {
    this._dirty && this._updateInstructions();
    this._oldInstructions = this._instructions;
    this._activeInstructions = [];
    this._active = this._dirty = false
  };
  b._setProp = function(b, a) {
    this[b] = a
  };
  k.Graphics = a
})(window);
// Input 9
(function(k) {
  var c = function() {
    this.initialize()
  }, a = c.prototype;
  c.suppressCrossDomainErrors = false;
  c._hitTestCanvas = document.createElement("canvas");
  c._hitTestCanvas.width = c._hitTestCanvas.height = 1;
  c._hitTestContext = c._hitTestCanvas.getContext("2d");
  a.alpha = 1;
  a.cacheCanvas = null;
  a.id = -1;
  a.mouseEnabled = true;
  a.name = null;
  a.parent = null;
  a.regX = 0;
  a.regY = 0;
  a.rotation = 0;
  a.scaleX = 1;
  a.scaleY = 1;
  a.skewX = 0;
  a.skewY = 0;
  a.shadow = null;
  a.visible = true;
  a.x = 0;
  a.y = 0;
  a.compositeOperation = null;
  a.snapToPixel = false;
  a.onPress = null;
  a.onClick = null;
  a.onDoubleClick = null;
  a.onMouseOver = null;
  a.onMouseOut = null;
  a.tick = null;
  a.filters = null;
  a._cacheOffsetX = 0;
  a._cacheOffsetY = 0;
  a._matrix = null;
  a.initialize = function() {
    this.id = UID.get();
    this._matrix = new Matrix2D
  };
  a.isVisible = function() {
    return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0
  };
  a.draw = function(b, a) {
    if(a || !this.cacheCanvas) {
      return false
    }
    b.drawImage(this.cacheCanvas, this._cacheOffsetX, this._cacheOffsetY);
    return true
  };
  a.cache = function(b, a, c, e) {
    if(this.cacheCanvas == null) {
      this.cacheCanvas = document.createElement("canvas")
    }
    var d = this.cacheCanvas.getContext("2d");
    this.cacheCanvas.width = c;
    this.cacheCanvas.height = e;
    d.setTransform(1, 0, 0, 1, -b, -a);
    d.clearRect(0, 0, c + 1, e + 1);
    this.draw(d, true);
    this._cacheOffsetX = b;
    this._cacheOffsetY = a;
    this._applyFilters()
  };
  a.updateCache = function(b) {
    if(this.cacheCanvas == null) {
      throw"cache() must be called before updateCache()";
    }
    var a = this.cacheCanvas.getContext("2d");
    a.setTransform(1, 0, 0, 1, -this._cacheOffsetX, -this._cacheOffsetY);
    b ? a.globalCompositeOperation = b : a.clearRect(0, 0, this.cacheCanvas.width + 1, this.cacheCanvas.height + 1);
    this.draw(a, true);
    if(b) {
      a.globalCompositeOperation = "source-over"
    }
    this._applyFilters()
  };
  a.uncache = function() {
    this.cacheCanvas = null;
    this._cacheOffsetX = this._cacheOffsetY = 0
  };
  a.getStage = function() {
    for(var b = this;b.parent;) {
      b = b.parent
    }
    return b instanceof Stage ? b : null
  };
  a.localToGlobal = function(b, a) {
    var c = this.getConcatenatedMatrix(this._matrix);
    if(c == null) {
      return null
    }
    c.append(1, 0, 0, 1, b, a);
    return new Point(c.tx, c.ty)
  };
  a.globalToLocal = function(b, a) {
    var c = this.getConcatenatedMatrix(this._matrix);
    if(c == null) {
      return null
    }
    c.invert();
    c.append(1, 0, 0, 1, b, a);
    return new Point(c.tx, c.ty)
  };
  a.localToLocal = function(b, a, c) {
    b = this.localToGlobal(b, a);
    return c.globalToLocal(b.x, b.y)
  };
  a.setTransform = function(b, a, c, e, d, f, g, i, j) {
    this.x = b || 0;
    this.y = a || 0;
    this.scaleX = c == null ? 1 : c;
    this.scaleY = e == null ? 1 : e;
    this.rotation = d || 0;
    this.skewX = f || 0;
    this.skewY = g || 0;
    this.regX = i || 0;
    this.regY = j || 0
  };
  a.getConcatenatedMatrix = function(b) {
    b ? b.identity() : b = new Matrix2D;
    for(var a = this;a != null;) {
      b.prependTransform(a.x, a.y, a.scaleX, a.scaleY, a.rotation, a.skewX, a.skewY, a.regX, a.regY), b.prependProperties(a.alpha, a.shadow, a.compositeOperation), a = a.parent
    }
    return b
  };
  a.drawHitMask = function(b) {
    this.draw(b)
  };
  a.hitTest = function(b, a) {
    var h = c._hitTestContext, e = c._hitTestCanvas;
    h.setTransform(1, 0, 0, 1, -b, -a);
    this.drawHitMask(h);
    h = this._testHit(h);
    e.width = 0;
    e.width = 1;
    return h
  };
  a.clone = function() {
    var b = new c;
    this.cloneProps(b);
    return b
  };
  a.toString = function() {
    return"[DisplayObject (name=" + this.name + ")]"
  };
  a.cloneProps = function(b) {
    b.alpha = this.alpha;
    b.name = this.name;
    b.regX = this.regX;
    b.regY = this.regY;
    b.rotation = this.rotation;
    b.scaleX = this.scaleX;
    b.scaleY = this.scaleY;
    b.shadow = this.shadow;
    b.skewX = this.skewX;
    b.skewY = this.skewY;
    b.visible = this.visible;
    b.x = this.x;
    b.y = this.y;
    b.mouseEnabled = this.mouseEnabled;
    b.compositeOperation = this.compositeOperation
  };
  a.applyShadow = function(b, a) {
    a = a || Shadow.identity;
    b.shadowColor = a.color;
    b.shadowOffsetX = a.offsetX;
    b.shadowOffsetY = a.offsetY;
    b.shadowBlur = a.blur
  };
  a._testHit = function(b) {
    try {
      var a = b.getImageData(0, 0, 1, 1).data[3] > 1
    }catch(h) {
      if(!c.suppressCrossDomainErrors) {
        throw"An error has occured. This is most likely due to security restrictions on reading canvas pixel data with local or cross-domain images.";
      }
    }
    return a
  };
  a._applyFilters = function() {
    if(this.filters && this.filters.length != 0 && this.cacheCanvas) {
      for(var b = this.filters.length, a = this.cacheCanvas.getContext("2d"), c = this.cacheCanvas.width, e = this.cacheCanvas.height, d = 0;d < b;d++) {
        this.filters[d].applyFilter(a, 0, 0, c, e)
      }
    }
  };
  k.DisplayObject = c
})(window);
// Input 10
(function(k) {
  var c = function() {
    this.initialize()
  }, a = c.prototype = new DisplayObject;
  a.children = null;
  a.DisplayObject_initialize = a.initialize;
  a.initialize = function() {
    this.DisplayObject_initialize();
    this.children = []
  };
  a.isVisible = function() {
    return this.visible && this.alpha > 0 && this.children.length && this.scaleX != 0 && this.scaleY != 0
  };
  a.DisplayObject_draw = a.draw;
  a.draw = function(b, a, h) {
    var e = Stage._snapToPixelEnabled;
    if(this.DisplayObject_draw(b, a)) {
      return true
    }
    for(var h = h || this._matrix.reinitialize(1, 0, 0, 1, 0, 0, this.alpha, this.shadow, this.compositeOperation), a = this.children.length, d = this.children.slice(0), f = 0;f < a;f++) {
      var g = d[f];
      if(g.isVisible()) {
        var i = false, j = g._matrix.reinitialize(h.a, h.b, h.c, h.d, h.tx, h.ty, h.alpha, h.shadow, h.compositeOperation);
        j.appendTransform(g.x, g.y, g.scaleX, g.scaleY, g.rotation, g.skewX, g.skewY, g.regX, g.regY);
        j.appendProperties(g.alpha, g.shadow, g.compositeOperation);
        if(!(g instanceof c && g.cacheCanvas == null)) {
          e && g.snapToPixel && j.a == 1 && j.b == 0 && j.c == 0 && j.d == 1 ? b.setTransform(j.a, j.b, j.c, j.d, j.tx + 0.5 | 0, j.ty + 0.5 | 0) : b.setTransform(j.a, j.b, j.c, j.d, j.tx, j.ty), b.globalAlpha = j.alpha, b.globalCompositeOperation = j.compositeOperation || "source-over", (i = j.shadow) && this.applyShadow(b, i)
        }
        g.draw(b, false, j);
        i && this.applyShadow(b)
      }
    }
    return true
  };
  a.addChild = function(b) {
    var a = arguments.length;
    if(a > 1) {
      for(var c = 0;c < a;c++) {
        this.addChild(arguments[c])
      }
      return arguments[a - 1]
    }
    b.parent && b.parent.removeChild(b);
    b.parent = this;
    this.children.push(b);
    return b
  };
  a.addChildAt = function(b, a) {
    var c = arguments.length;
    if(c > 2) {
      for(var a = arguments[e - 1], e = 0;e < c - 1;e++) {
        this.addChildAt(arguments[e], a + e)
      }
      return arguments[c - 2]
    }
    b.parent && b.parent.removeChild(b);
    b.parent = this;
    this.children.splice(a, 0, b);
    return b
  };
  a.removeChild = function(b) {
    var a = arguments.length;
    if(a > 1) {
      for(var c = true, e = 0;e < a;e++) {
        c = c && this.removeChild(arguments[e])
      }
      return c
    }
    return this.removeChildAt(this.children.indexOf(b))
  };
  a.removeChildAt = function(b) {
    var a = arguments.length;
    if(a > 1) {
      for(var c = [], e = 0;e < a;e++) {
        c[e] = arguments[e]
      }
      c.sort(function(b, a) {
        return a - b
      });
      for(var d = true, e = 0;e < a;e++) {
        d = d && this.removeChildAt(c[e])
      }
      return d
    }
    if(b < 0 || b > this.children.length - 1) {
      return false
    }
    a = this.children[b];
    if(a != null) {
      a.parent = null
    }
    this.children.splice(b, 1);
    return true
  };
  a.removeAllChildren = function() {
    for(;this.children.length;) {
      this.removeChildAt(0)
    }
  };
  a.getChildAt = function(b) {
    return this.children[b]
  };
  a.sortChildren = function(b) {
    this.children.sort(b)
  };
  a.getChildIndex = function(b) {
    return this.children.indexOf(b)
  };
  a.getNumChildren = function() {
    return this.children.length
  };
  a.contains = function(b) {
    for(;b;) {
      if(b == this) {
        return true
      }
      b = b.parent
    }
    return false
  };
  a.hitTest = function(b, a) {
    return this.getObjectUnderPoint(b, a) != null
  };
  a.getObjectsUnderPoint = function(b, a) {
    var c = [], e = this.localToGlobal(b, a);
    this._getObjectsUnderPoint(e.x, e.y, c);
    return c
  };
  a.getObjectUnderPoint = function(b, a) {
    var c = this.localToGlobal(b, a);
    return this._getObjectsUnderPoint(c.x, c.y)
  };
  a.clone = function(b) {
    var a = new c;
    this.cloneProps(a);
    if(b) {
      for(var h = a.children = [], e = 0, d = this.children.length;e < d;e++) {
        var f = this.children[e].clone(b);
        f.parent = a;
        h.push(f)
      }
    }
    return a
  };
  a.toString = function() {
    return"[Container (name=" + this.name + ")]"
  };
  a._tick = function() {
    for(var b = this.children.length - 1;b >= 0;b--) {
      var a = this.children[b];
      a._tick && a._tick();
      a.tick && a.tick()
    }
  };
  a._getObjectsUnderPoint = function(b, a, h, e) {
    var d = DisplayObject._hitTestContext, f = DisplayObject._hitTestCanvas, g = this._matrix, i = e & 1 && (this.onPress || this.onClick || this.onDoubleClick) || e & 2 && (this.onMouseOver || this.onMouseOut);
    if(this.cacheCanvas) {
      if(this.getConcatenatedMatrix(g), d.setTransform(g.a, g.b, g.c, g.d, g.tx - b, g.ty - a), d.globalAlpha = g.alpha, this.draw(d), this._testHit(d)) {
        if(f.width = 0, f.width = 1, i) {
          return this
        }
      }else {
        return null
      }
    }
    for(var j = this.children.length - 1;j >= 0;j--) {
      var l = this.children[j];
      if(l.isVisible() && l.mouseEnabled) {
        if(l instanceof c) {
          if(i) {
            if(l = l._getObjectsUnderPoint(b, a)) {
              return this
            }
          }else {
            if(l = l._getObjectsUnderPoint(b, a, h, e), !h && l) {
              return l
            }
          }
        }else {
          if(!e || i || e & 1 && (l.onPress || l.onClick || l.onDoubleClick) || e & 2 && (l.onMouseOver || l.onMouseOut)) {
            if(l.getConcatenatedMatrix(g), d.setTransform(g.a, g.b, g.c, g.d, g.tx - b, g.ty - a), d.globalAlpha = g.alpha, l.drawHitMask(d), this._testHit(d)) {
              if(f.width = 0, f.width = 1, i) {
                return this
              }else {
                if(h) {
                  h.push(l)
                }else {
                  return l
                }
              }
            }
          }
        }
      }
    }
    return null
  };
  k.Container = c
})(window);
// Input 11
(function(k) {
  var c = function(b) {
    this.initialize(b)
  }, a = c.prototype = new Container;
  c._snapToPixelEnabled = false;
  a.autoClear = true;
  a.canvas = null;
  a.mouseX = null;
  a.mouseY = null;
  a.onMouseMove = null;
  a.onMouseUp = null;
  a.onMouseDown = null;
  a.snapToPixelEnabled = false;
  a.mouseInBounds = false;
  a.tickOnUpdate = true;
  a._activeMouseEvent = null;
  a._activeMouseTarget = null;
  a._mouseOverIntervalID = null;
  a._mouseOverX = 0;
  a._mouseOverY = 0;
  a._mouseOverTarget = null;
  a.Container_initialize = a.initialize;
  a.initialize = function(b) {
    this.Container_initialize();
    this.canvas = b;
    this._enableMouseEvents(true)
  };
  a.update = function() {
    if(this.canvas) {
      this.autoClear && this.clear(), c._snapToPixelEnabled = this.snapToPixelEnabled, this.tickOnUpdate && this._tick(), this.draw(this.canvas.getContext("2d"), false, this.getConcatenatedMatrix(this._matrix))
    }
  };
  a.tick = a.update;
  a.clear = function() {
    if(this.canvas) {
      var b = this.canvas.getContext("2d");
      b.setTransform(1, 0, 0, 1, 0, 0);
      b.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
  };
  a.toDataURL = function(b, a) {
    a || (a = "image/png");
    var c = this.canvas.getContext("2d"), e = this.canvas.width, d = this.canvas.height, f;
    if(b) {
      f = c.getImageData(0, 0, e, d);
      var g = c.globalCompositeOperation;
      c.globalCompositeOperation = "destination-over";
      c.fillStyle = b;
      c.fillRect(0, 0, e, d)
    }
    var i = this.canvas.toDataURL(a);
    if(b) {
      c.clearRect(0, 0, e, d), c.putImageData(f, 0, 0), c.globalCompositeOperation = g
    }
    return i
  };
  a.enableMouseOver = function(b) {
    if(this._mouseOverIntervalID) {
      clearInterval(this._mouseOverIntervalID), this._mouseOverIntervalID = null
    }
    if(!(b <= 0)) {
      var a = this;
      this._mouseOverIntervalID = setInterval(function() {
        a._testMouseOver()
      }, 1E3 / Math.min(50, b));
      this._mouseOverX = NaN;
      this._mouseOverTarget = null
    }
  };
  a.clone = function() {
    var b = new c(null);
    this.cloneProps(b);
    return b
  };
  a.toString = function() {
    return"[Stage (name=" + this.name + ")]"
  };
  a._enableMouseEvents = function() {
    var b = this, a = k.addEventListener ? k : document;
    a.addEventListener("mouseup", function(a) {
      b._handleMouseUp(a)
    }, false);
    a.addEventListener("mousemove", function(a) {
      b._handleMouseMove(a)
    }, false);
    a.addEventListener("dblclick", function(a) {
      b._handleDoubleClick(a)
    }, false);
    this.canvas.addEventListener("mousedown", function(a) {
      b._handleMouseDown(a)
    }, false)
  };
  a._handleMouseMove = function(b) {
    if(this.canvas) {
      if(!b) {
        b = k.event
      }
      var a = this.mouseInBounds;
      this._updateMousePosition(b.pageX, b.pageY);
      if(a || this.mouseInBounds) {
        b = new MouseEvent("onMouseMove", this.mouseX, this.mouseY, this, b);
        if(this.onMouseMove) {
          this.onMouseMove(b)
        }
        if(this._activeMouseEvent && this._activeMouseEvent.onMouseMove) {
          this._activeMouseEvent.onMouseMove(b)
        }
      }
    }else {
      this.mouseX = this.mouseY = null
    }
  };
  a._updateMousePosition = function(b, a) {
    var c = this.canvas;
    do {
      b -= c.offsetLeft, a -= c.offsetTop
    }while(c = c.offsetParent);
    if(this.mouseInBounds = b >= 0 && a >= 0 && b < this.canvas.width && a < this.canvas.height) {
      this.mouseX = b, this.mouseY = a
    }
  };
  a._handleMouseUp = function(b) {
    var a = new MouseEvent("onMouseUp", this.mouseX, this.mouseY, this, b);
    if(this.onMouseUp) {
      this.onMouseUp(a)
    }
    if(this._activeMouseEvent && this._activeMouseEvent.onMouseUp) {
      this._activeMouseEvent.onMouseUp(a)
    }
    if(this._activeMouseTarget && this._activeMouseTarget.onClick && this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, true, this._mouseOverIntervalID ? 3 : 1) == this._activeMouseTarget) {
      this._activeMouseTarget.onClick(new MouseEvent("onClick", this.mouseX, this.mouseY, this._activeMouseTarget, b))
    }
    this._activeMouseEvent = this._activeMouseTarget = null
  };
  a._handleMouseDown = function(b) {
    if(this.onMouseDown) {
      this.onMouseDown(new MouseEvent("onMouseDown", this.mouseX, this.mouseY, this, b))
    }
    var a = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, this._mouseOverIntervalID ? 3 : 1);
    if(a) {
      if(a.onPress instanceof Function && (b = new MouseEvent("onPress", this.mouseX, this.mouseY, a, b), a.onPress(b), b.onMouseMove || b.onMouseUp)) {
        this._activeMouseEvent = b
      }
      this._activeMouseTarget = a
    }
  };
  a._testMouseOver = function() {
    if(!(this.mouseX == this._mouseOverX && this.mouseY == this._mouseOverY && this.mouseInBounds)) {
      var b = null;
      if(this.mouseInBounds) {
        b = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, 3), this._mouseOverX = this.mouseX, this._mouseOverY = this.mouseY
      }
      if(this._mouseOverTarget != b) {
        if(this._mouseOverTarget && this._mouseOverTarget.onMouseOut) {
          this._mouseOverTarget.onMouseOut(new MouseEvent("onMouseOut", this.mouseX, this.mouseY, this._mouseOverTarget))
        }
        if(b && b.onMouseOver) {
          b.onMouseOver(new MouseEvent("onMouseOver", this.mouseX, this.mouseY, b))
        }
        this._mouseOverTarget = b
      }
    }
  };
  a._handleDoubleClick = function(b) {
    if(this.onDoubleClick) {
      this.onDoubleClick(new MouseEvent("onDoubleClick", this.mouseX, this.mouseY, this, b))
    }
    var a = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, this._mouseOverIntervalID ? 3 : 1);
    if(a && a.onDoubleClick instanceof Function) {
      a.onDoubleClick(new MouseEvent("onPress", this.mouseX, this.mouseY, a, b))
    }
  };
  k.Stage = c
})(window);
// Input 12
(function(k) {
  var c = function(b) {
    this.initialize(b)
  }, a = c.prototype = new DisplayObject;
  a.htmlElement = null;
  a._style = null;
  a.DisplayObject_initialize = a.initialize;
  a.initialize = function(b) {
    this.DisplayObject_initialize();
    this.mouseEnabled = false;
    if(this.htmlElement = b) {
      this._style = b.style, this._style.position = "absolute", this._style.transformOrigin = this._style.webkitTransformOrigin = this._style.MozTransformOrigin = "0px 0px"
    }
  };
  a.isVisible = function() {
    return this.htmlElement != null
  };
  a.draw = function() {
    if(this.htmlElement != null) {
      var b = this._matrix, a = this.htmlElement;
      a.style.opacity = "" + b.alpha;
      a.style.visibility = this.visible ? "visible" : "hidden";
      a.style.transform = a.style.webkitTransform = a.style.oTransform = ["matrix(" + b.a, b.b, b.c, b.d, b.tx, b.ty + ")"].join(",");
      a.style.MozTransform = ["matrix(" + b.a, b.b, b.c, b.d, b.tx + "px", b.ty + "px)"].join(",");
      return true
    }
  };
  a.cache = function() {
  };
  a.uncache = function() {
  };
  a.updateCache = function() {
  };
  a.hitTest = function() {
  };
  a.localToGlobal = function() {
  };
  a.globalToLocal = function() {
  };
  a.localToLocal = function() {
  };
  a.clone = function() {
    var b = new c;
    this.cloneProps(b);
    return b
  };
  a.toString = function() {
    return"[DOMElement (name=" + this.name + ")]"
  };
  a._tick = function() {
    if(this.htmlElement != null) {
      this.htmlElement.style.visibility = "hidden"
    }
  };
  k.DOMElement = c
})(window);
// Input 13
(function(k) {
  var c = function(b) {
    this.initialize(b)
  }, a = c.prototype = new DisplayObject;
  a.image = null;
  a.snapToPixel = true;
  a.DisplayObject_initialize = a.initialize;
  a.initialize = function(b) {
    this.DisplayObject_initialize();
    typeof b == "string" ? (this.image = new Image, this.image.src = b) : this.image = b
  };
  a.isVisible = function() {
    return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && this.image && (this.image.complete || this.image.getContext)
  };
  a.DisplayObject_draw = a.draw;
  a.draw = function(b, a) {
    if(this.DisplayObject_draw(b, a)) {
      return true
    }
    b.drawImage(this.image, 0, 0);
    return true
  };
  a.clone = function() {
    var b = new c(this.image);
    this.cloneProps(b);
    return b
  };
  a.toString = function() {
    return"[Bitmap (name=" + this.name + ")]"
  };
  k.Bitmap = c
})(window);
// Input 14
(function(k) {
  var c = function(b) {
    this.initialize(b)
  }, a = c.prototype = new DisplayObject;
  a.callback = null;
  a.currentFrame = -1;
  a.currentSequence = null;
  a.currentEndFrame = null;
  a.currentStartFrame = null;
  a.nextSequence = null;
  a.paused = false;
  a.spriteSheet = null;
  a.snapToPixel = true;
  a.advanceFrequency = 1;
  a.advanceOffset = 0;
  a._advanceCount = 0;
  a.DisplayObject_initialize = a.initialize;
  a.initialize = function(b) {
    this.DisplayObject_initialize();
    this.spriteSheet = b
  };
  a.isVisible = function() {
    var b = this.spriteSheet ? this.spriteSheet.image : null;
    return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && b && this.currentFrame >= 0 && (b.complete || b.getContext)
  };
  a.DisplayObject_draw = a.draw;
  a.draw = function(b, a) {
    if(this.DisplayObject_draw(b, a)) {
      return true
    }
    var c = this.getCurrentFrameRect();
    c != null && b.drawImage(this.spriteSheet.image, c.x, c.y, c.width, c.height, 0, 0, c.width, c.height);
    return true
  };
  a.getCurrentFrameRect = function() {
    var b = this.spriteSheet.frameWidth, a = this.spriteSheet.frameHeight, c = this.spriteSheet.image.width / b | 0;
    this._normalizeCurrentFrame();
    if(this.currentFrame >= 0) {
      return new Rectangle(b * (this.currentFrame % c), a * (this.currentFrame / c | 0), b, a)
    }
  };
  a.gotoAndPlay = function(b) {
    this.paused = false;
    this._goto(b)
  };
  a.gotoAndStop = function(b) {
    this.paused = true;
    this._goto(b)
  };
  a.advance = function() {
    this.currentFrame++
  };
  a.clone = function() {
    var b = new c(this.spriteSheet);
    this.cloneProps(b);
    return b
  };
  a.toString = function() {
    return"[BitmapSequence (name=" + this.name + ")]"
  };
  a._tick = function() {
    if(this.currentFrame == -1 && this.spriteSheet.frameData) {
      this.paused = true
    }
    !this.paused && (++this._advanceCount + this.advanceOffset) % this.advanceFrequency == 0 && (this.currentFrame++, this._normalizeCurrentFrame())
  };
  a._normalizeCurrentFrame = function() {
    var b = this.spriteSheet.image, a = b.width / this.spriteSheet.frameWidth | 0, b = b.height / this.spriteSheet.frameHeight | 0;
    if(this.currentEndFrame != null) {
      if(this.currentFrame > this.currentEndFrame) {
        this.nextSequence ? this._goto(this.nextSequence) : (this.paused = true, this.currentFrame = this.currentEndFrame), this.callback && this.callback(this)
      }
    }else {
      if(a = this.spriteSheet.totalFrames || a * b, this.currentFrame >= a) {
        this.spriteSheet.loop ? this.currentFrame = 0 : (this.currentFrame = a - 1, this.paused = true), this.callback && this.callback(this)
      }
    }
  };
  a.DisplayObject_cloneProps = a.cloneProps;
  a.cloneProps = function(b) {
    this.DisplayObject_cloneProps(b);
    b.callback = this.callback;
    b.currentFrame = this.currentFrame;
    b.currentStartFrame = this.currentStartFrame;
    b.currentEndFrame = this.currentEndFrame;
    b.currentSequence = this.currentSequence;
    b.nextSequence = this.nextSequence;
    b.paused = this.paused;
    b.frameData = this.frameData;
    b.advanceFrequency = this.advanceFrequency;
    b.advanceOffset = this.advanceOffset
  };
  a._goto = function(b) {
    if(isNaN(b)) {
      if(b == this.currentSequence) {
        this.currentFrame = this.currentStartFrame
      }else {
        var a = this.spriteSheet.frameData[b];
        if(a instanceof Array) {
          this.currentFrame = this.currentStartFrame = a[0];
          this.currentSequence = b;
          this.currentEndFrame = a[1];
          if(this.currentEndFrame == null) {
            this.currentEndFrame = this.currentStartFrame
          }
          if(this.currentEndFrame == null) {
            this.currentEndFrame = this.currentFrame
          }
          this.nextSequence = a[2];
          if(this.nextSequence == null) {
            this.nextSequence = this.currentSequence
          }else {
            if(this.nextSequence == false) {
              this.nextSequence = null
            }
          }
        }else {
          this.currentSequence = this.nextSequence = null, this.currentEndFrame = this.currentFrame = this.currentStartFrame = a
        }
      }
    }else {
      this.currentSequence = this.nextSequence = this.currentEndFrame = null, this.currentStartFrame = 0, this.currentFrame = b
    }
  };
  k.BitmapSequence = c
})(window);
// Input 15
(function(k) {
  var c = function(b) {
    this.initialize(b)
  }, a = c.prototype = new DisplayObject;
  a.graphics = null;
  a.DisplayObject_initialize = a.initialize;
  a.initialize = function(b) {
    this.DisplayObject_initialize();
    this.graphics = b ? b : new Graphics
  };
  a.isVisible = function() {
    return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && this.graphics
  };
  a.DisplayObject_draw = a.draw;
  a.draw = function(b, a) {
    if(this.DisplayObject_draw(b, a)) {
      return true
    }
    this.graphics.draw(b);
    return true
  };
  a.clone = function(b) {
    b = new c(b && this.graphics ? this.graphics.clone() : this.graphics);
    this.cloneProps(b);
    return b
  };
  a.toString = function() {
    return"[Shape (name=" + this.name + ")]"
  };
  k.Shape = c
})(window);
// Input 16
(function(k) {
  var c = function(b, a, c) {
    this.initialize(b, a, c)
  }, a = c.prototype = new DisplayObject;
  c._workingContext = document.createElement("canvas").getContext("2d");
  a.text = "";
  a.font = null;
  a.color = null;
  a.textAlign = null;
  a.textBaseline = null;
  a.maxWidth = null;
  a.outline = false;
  a.lineHeight = null;
  a.lineWidth = null;
  a.DisplayObject_initialize = a.initialize;
  a.initialize = function(a, c, h) {
    this.DisplayObject_initialize();
    this.text = a;
    this.font = c;
    this.color = h ? h : "#000"
  };
  a.isVisible = function() {
    return Boolean(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && this.text != null && this.text != "")
  };
  a.DisplayObject_draw = a.draw;
  a.draw = function(a, c) {
    if(this.DisplayObject_draw(a, c)) {
      return true
    }
    this.outline ? a.strokeStyle = this.color : a.fillStyle = this.color;
    a.font = this.font;
    a.textAlign = this.textAlign ? this.textAlign : "start";
    a.textBaseline = this.textBaseline ? this.textBaseline : "alphabetic";
    for(var h = String(this.text).split(/(?:\r\n|\r|\n)/), e = this.lineHeight == null ? this.getMeasuredLineHeight() : this.lineHeight, d = 0, f = 0, g = h.length;f < g;f++) {
      var i = a.measureText(h[f]).width;
      if(this.lineWidth == null || i < this.lineWidth) {
        this._drawTextLine(a, h[f], d)
      }else {
        for(var i = h[f].split(/(\s)/), j = i[0], l = 1, k = i.length;l < k;l += 2) {
          a.measureText(j + i[l] + i[l + 1]).width > this.lineWidth ? (this._drawTextLine(a, j, d), d += e, j = i[l + 1]) : j += i[l] + i[l + 1]
        }
        this._drawTextLine(a, j, d)
      }
      d += e
    }
    return true
  };
  a.getMeasuredWidth = function() {
    return this._getWorkingContext().measureText(this.text).width
  };
  a.getMeasuredLineHeight = function() {
    return this._getWorkingContext().measureText("M").width * 1.2
  };
  a.clone = function() {
    var a = new c(this.text, this.font, this.color);
    this.cloneProps(a);
    return a
  };
  a.toString = function() {
    return"[Text (text=" + (this.text.length > 20 ? this.text.substr(0, 17) + "..." : this.text) + ")]"
  };
  a.DisplayObject_cloneProps = a.cloneProps;
  a.cloneProps = function(a) {
    this.DisplayObject_cloneProps(a);
    a.textAlign = this.textAlign;
    a.textBaseline = this.textBaseline;
    a.maxWidth = this.maxWidth;
    a.outline = this.outline;
    a.lineHeight = this.lineHeight;
    a.lineWidth = this.lineWidth
  };
  a._getWorkingContext = function() {
    var a = c._workingContext;
    a.font = this.font;
    a.textAlign = this.textAlign ? this.textAlign : "start";
    a.textBaseline = this.textBaseline ? this.textBaseline : "alphabetic";
    return a
  };
  a._drawTextLine = function(a, c, h) {
    this.outline ? a.strokeText(c, 0, h, this.maxWidth) : a.fillText(c, 0, h, this.maxWidth)
  };
  k.Text = c
})(window);
// Input 17
(function(k) {
  var c = function() {
    throw"SpriteSheetUtils cannot be instantiated";
  };
  c._workingCanvas = document.createElement("canvas");
  c._workingContext = c._workingCanvas.getContext("2d");
  c.flip = function(a, b) {
    var k = a.image, h = a.frameData, e = a.frameWidth, d = a.frameHeight, f = k.width / e | 0, g = k.height / d | 0, i = f * g, j = {}, l, n;
    for(n in h) {
      l = h[n], l instanceof Array && (l = l.slice(0)), j[n] = l
    }
    var q = [], o = 0, m = 0;
    for(n in b) {
      if(l = b[n], l = h[l[0]], l != null) {
        if(l instanceof Array) {
          var r = l[0], p = l[1];
          p == null && (p = r)
        }else {
          r = p = l
        }
        q[m] = n;
        q[m + 1] = r;
        q[m + 2] = p;
        o += p - r + 1;
        m += 4
      }
    }
    h = c._workingCanvas;
    h.width = k.width;
    h.height = Math.ceil(g + o / f) * d;
    o = c._workingContext;
    o.drawImage(k, 0, 0, f * e, g * d, 0, 0, f * e, g * d);
    g = i - 1;
    for(m = 0;m < q.length;m += 4) {
      n = q[m];
      r = q[m + 1];
      p = q[m + 2];
      l = b[n];
      for(var i = l[1] ? -1 : 1, u = l[2] ? -1 : 1, v = i == -1 ? e : 0, w = u == -1 ? d : 0, s = r;s <= p;s++) {
        g++, o.save(), o.translate(g % f * e + v, (g / f | 0) * d + w), o.scale(i, u), o.drawImage(k, s % f * e, (s / f | 0) * d, e, d, 0, 0, e, d), o.restore()
      }
      j[n] = [g - (p - r), g, l[3]]
    }
    k = new Image;
    k.src = h.toDataURL("image/png");
    return new SpriteSheet(k.width > 0 ? k : h, e, d, j)
  };
  c.frameDataToString = function(a) {
    var b = "", c = 0, h = 0, e = 0, d, f;
    for(f in a) {
      e++;
      d = a[f];
      if(d instanceof Array) {
        var g = d[0], i = d[1];
        i == null && (i = g);
        d = d[2];
        d == null && (d = f)
      }else {
        g = i = d, d = f
      }
      b += "\n\t" + f + ", start=" + g + ", end=" + i + ", next=" + d;
      d == false ? b += " (stop)" : d == f && (b += " (loop)");
      i > c && (c = i);
      g < h && (h = g)
    }
    return e + " sequences, min=" + h + ", max=" + c + b
  };
  c.extractFrame = function(a, b) {
    var k = a.image, h = a.frameWidth, e = a.frameHeight, d = k.width / h | 0;
    if(isNaN(b)) {
      var f = a.frameData[b], b = f instanceof Array ? f[0] : f
    }
    f = c._workingCanvas;
    f.width = h;
    f.height = e;
    c._workingContext.drawImage(k, b % d * h, (b / d | 0) * e, h, e, 0, 0, h, e);
    k = new Image;
    k.src = f.toDataURL("image/png");
    return k
  };
  k.SpriteSheetUtils = c
})(window);

