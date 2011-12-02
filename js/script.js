// "Constants"
var DEBUG = true;
var BALL_COLOR = "#000066";
var BALL_RADIUS = 20;
var INITIAL_VEL = 2;

// -------------- JavaScript Sugar ----------------

// Crockford's prototypical constructor: return a new object which inherits from o
// see: http://javascript.crockford.com/prototypal.html
// params:
//    o: An object that the returned object should inherit from
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

// Call a function for each object in the given array
// params:
//    anArr: an array of objects
//           note: if this is not an array, this function will do nothing
//    func:  a function which will be invoked for each object in anArr,
//           we make sure that 'this' will refer to the actual object from anArr
var forAllInArray = function(anArr,func) {
  if (anArr.constructor == Array) {
    for (var i=0; i < anArr.length; i++) {
      func.call(anArr[i]);
    }
  }
};

// --------------- Physical Objects ----------------

// Create ball object
//   it will be displayed, so it needs its own draw() function
//   it can also be positioned, so has an x and y
//   it can also move, so it has a velocity
//   it is a ball, so it needs properties such as radius, color
var ball = {
  x: null,
  y: null,
  radius: BALL_RADIUS,
  color: BALL_COLOR,
  vel: INITIAL_VEL,
  draw: function(context) {
    context.save();
    context.beginPath();
    context.arc(Math.floor(this.x) - 0.5, // center.x
                Math.floor(this.y) - 0.5, // center.y
                Math.floor(this.radius),  // radius
                0, Math.PI*2);            // beginAngle, endAngle
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

// -------------- Animation -----------------

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

// Begin the Animation Run Loop
// params:
//    context: the canvas context where the animation will take place
//    objects: an array of objects to be animated -> they must all have a draw() function
var beginAnimation = function(context, objects) {

  // The Animation Run Loop
  var animationLoop = function() {
    clearContext(context);
    forAllInArray(objects, function() {
      // move object
      this.move(contextBounds(context), objects);
      // draw object
      this.draw(context);
    });
  };

  // Running the Animation Loop on an interval
  var animationInterval = setInterval(animationLoop, 25);
};

// ---------------- View / DOM ---------------

// Kick off anything that depends on the DOM
//    This means anything that needs the view must be initialized here
DomReady.ready(function() {

  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  
  // Initialization of objects which depends on view (canvas)
  positionCenter(ball, canvas);

  // Begin the animation loop
  beginAnimation(context, [ ball ]);

});

