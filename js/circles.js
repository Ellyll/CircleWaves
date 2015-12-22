"use strict";

var circlesApp = (function circles() {
  
  function _init() {
    var canvas = document.getElementById('circlesCanvas');
    var context = canvas.getContext('2d');
    _maximiseCanvas(canvas);

    var radius = 15;
    var spacing = 10;
    var angleStep = Math.PI / 4;
    var wavePoints = _generateWavePoints(radius, canvas.width, canvas.height, spacing, angleStep);
        
    if (!(wavePoints && wavePoints.length > 0) ) {
      throw "Canvas too small";
    }
    
    var radiansPerMillisecond = (2*Math.PI/1000)/5;
    
    requestAnimationFrame(function(currentTime) { _draw( currentTime, currentTime, radiansPerMillisecond, wavePoints, context); });
  }
  
  function _draw(currentTime, lastTime, rotationSpeed, wavePoints, context) {
    var newWavePoints = _updateWavePoints(currentTime, lastTime, rotationSpeed, wavePoints);
    _drawWavePoints(newWavePoints, context);
    var newLastTime = currentTime;

    requestAnimationFrame(function (newCurrentTime) { _draw(newCurrentTime, newLastTime, rotationSpeed, newWavePoints, context); });
  }
  
  function _updateWavePoints(currentTime, lastTime, rotationSpeed, wavePoints) {
      var deltaTime = currentTime - lastTime;
      var deltaAngle = deltaTime * rotationSpeed;
      var newWavePoints = wavePoints.map(function (wp) {
        var newAngle = wp.angle+deltaAngle;
        if (newAngle > Math.PI*2) {
          newAngle -= Math.PI*2;
        }
        if (newAngle < 0) {
          newAngle += Math.PI*2;
        }
        return _makeWavePoint(wp.x, wp.y, wp.radius, newAngle);
      });
      return newWavePoints;
  }
    
  function _drawWavePoint(wavePoint, context) {
    var x = wavePoint.x + Math.cos(wavePoint.angle)*wavePoint.radius;
    var y = wavePoint.y + Math.sin(wavePoint.angle)*wavePoint.radius;

    var radiusOfDot = 2;
    
    context.beginPath();
    context.arc(x, y, radiusOfDot, 0, 2 * Math.PI, false);
    context.fillStyle = 'white';
    context.fill();
  }
  
  function _drawWavePoints(wavePoints, context) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    
    for (var i=0; i < wavePoints.length; i++) {
      _drawWavePoint(wavePoints[i], context);
    }
  }
  
  function _generateWavePoints(radius, canvasWidth, canvasHeight, spacing, angleStep) {
    var diameter = radius * 2;
    var y = diameter;
    var angle = 0;
    var wavePoints = [];
    while ((y + diameter + spacing) < canvasHeight) {
      var x = diameter;
      while ((x + diameter + spacing) < canvasWidth) {
        wavePoints.push(_makeWavePoint(x, y, radius, angle));
        x += diameter + spacing;
        angle += angleStep;
      }
      y += diameter + spacing;
    }
    return wavePoints;
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
