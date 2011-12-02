// "Constants"
var DEBUG = true;
var BALL_COLOR = "#000066";
var BALL_RADIUS = 20;
var INITIAL_VEL = 2;

// Position an object in center of canvas
// params:
//    object: An object which represents something to place on the screen.
//            Must have x and y properties. Recommended to have a draw method
//    canvas: The canvas (DOMElement) where object will eventually be drawn.
var positionCenter = function(object, canvas) {
  object.x = canvas.width / 2;
  object.y = canvas.height / 2;
}

// Return an object that represents the bounds of a given canvas context
// params:
//    context: A context obtained from a canvas element
var contextBounds = function(context) {
  return {
    xMin : 0,
    xMax : context.canvas.width,
    yMin : 0,
    yMax : context.canvas.height
  }
};

// Clear the given context completely
// params:
//    context: A context obtained from a canvas element
var clearContext = function(context) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

// Crockford's prototypical constructor: return a new object which inherits from o
// see: http://javascript.crockford.com/prototypal.html
// params:
//    o: An object that the returned object should inherit from
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

// Create ball object
var ball = {
  x: null,
  y: null,
  radius: BALL_RADIUS,
  color: BALL_COLOR,
  vel: INITIAL_VEL,
  draw: function(context) {
    context.save();
    context.beginPath();
    // params: center.x, center.y, radius, beginRadians, endRadians
    context.arc(Math.floor(this.x) - 0.5, 
                Math.floor(this.y) - 0.5, 
                Math.floor(this.radius),
                0, Math.PI*2);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
    context.restore();
  },
  move: function(bounds) {
    this.x += this.vel;
    if (this.x + this.radius >= bounds.xMax) {
      this.x = bounds.xMax - this.radius;
      this.vel = this.vel * -1;
    } else if (this.x - this.radius <= bounds.xMin) {
      this.x = bounds.xMin + this.radius;
      this.vel = this.vel * -1;
    }
  }
};

// Begin the animation run loop
var beginAnimation = function(context, objects) {
  // Helper Function
  // Iterate through all objects
  // inside func, this refers to the individual object
  var forAllObjects = function(func) {
    if (objects.constructor == Array) {
      for (var i=0; i < objects.length; i++) {
        func.call(objects[i]);
      }
    }
  };

  // The Object Animation Loop
  var animationLoop = function() {
    clearContext(context);
    forAllObjects(function() {
      // move object
      this.move(contextBounds(context), objects);
      // draw object
      this.draw(context);
    });
  };

  // Draw the objects for the first time
  forAllObjects(function() {
    this.draw(context);
  });

  // Running the Animation Loop on an interval
  var animationInterval = setInterval(animationLoop, 25);
};

// DOM is ready to be traversed, implmentation scraped from jQuery
DomReady.ready(function() {

  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  
  // Initialize position of objects
  positionCenter(ball, canvas);

  // Begin the animation loop
  // second parameter is the objects array
  beginAnimation(context, [ ball ]);

});

