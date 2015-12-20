"use strict";

var circlesApp = (function circles() {
  var canvas;
  var context;
  var radius = 10;
  var wavePoints = [];
  
  function _init() {
    canvas = document.getElementById('circlesCanvas');
    context = canvas.getContext('2d');
    console.log('window', window.innerWidth, window.innerHeight);
    _maximiseCanvas(canvas);
    console.log('window', window.innerWidth, window.innerHeight);
    console.log('canvas', canvas.width, canvas.height);
    
	  var height = context.canvas.height;
    var width = context.canvas.width;
    var diameter = radius * 2;
    
    if ( height < diameter || width < diameter) {
      throw "Canvas too small";
    }
    
    var spacing = 5;
    var y = diameter;
    var angle = 0;
    while (y+diameter+spacing < height) {
      var x = diameter;
      while(x+diameter+spacing < width) {
        wavePoints.push(_makeWavePoint(x, y, radius, angle));
        x += diameter+spacing;
        angle += Math.PI / 4;
      }
      y += diameter+spacing;
    }

    var radiansPerMillisecond = (2*Math.PI/500)/10;
    var lastTime = null;

    function _draw(currentTime) {
      if (!lastTime) lastTime = currentTime;
      var deltaTime = currentTime - lastTime;
      var deltaAngle = deltaTime * radiansPerMillisecond;
      wavePoints = wavePoints.map(function (wp) {
        var newAngle = wp.angle+deltaAngle;
        if (newAngle > Math.PI*2) {
          newAngle -= Math.PI*2;
        }
        if (newAngle < 0) {
          newAngle += Math.PI*2;
        }
        return _makeWavePoint(wp.x, wp.y, wp.radius, newAngle);
      });
      _drawWavePoints(wavePoints, context);
      lastTime = currentTime;
      requestAnimationFrame(_draw);
    }
    
    requestAnimationFrame(_draw);
  }
    
  function _drawWavePoint(wavePoint, context) {
    var x = wavePoint.x + Math.cos(wavePoint.angle)*wavePoint.radius;
    var y = wavePoint.y + Math.sin(wavePoint.angle)*wavePoint.radius;

    var radius = 2;
    
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'white';
    context.fill();
  }
  
  function _drawWavePoints(wavePoints, context) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    
    for (var i=0; i < wavePoints.length; i++) {
      _drawWavePoint(wavePoints[i], context);
    }
  }
  
  function _makeWavePoint(x, y, radius, angle) {
    return {
      _x: x,
      _y: y,
      _radius: radius,
      _angle: angle,
      get x() { return this._x; },
      get y() { return this._y; },
      get radius() { return this._radius; },
      get angle() { return this._angle; }
    };
  }
  
  function _maximiseCanvas(canvas) {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
  }
  
  return {
	  init: _init
  };
})();
