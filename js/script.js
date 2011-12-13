// "Constants"
var DEBUG = true;
var BALL_COLOR = "#000066";
var BALL_RADIUS = 20;
var INITIAL_VEL = 2;

// -------------- JavaScript Sugar ----------------

if (!Object.create) {
  Object.create = function (o) {
    if (arguments.length > 1) {
      throw new Error('Object.create implementation only accepts the first parameter.');
    }
    function F() {}
    F.prototype = o;
    return new F();
  }
}

// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.com/#x15.4.4.18
if ( !Array.prototype.forEach ) {

  Array.prototype.forEach = function( callback, thisArg ) {

    var T, k;

    if ( this == null ) {
      throw new TypeError( " this is null or not defined" );
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0; // Hack to convert O.length to a UInt32

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if ( {}.toString.call(callback) != "[object Function]" ) {
      throw new TypeError( callback + " is not a function" );
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if ( thisArg ) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while( k < len ) {

      var kValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if ( k in O ) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[ k ];

        // ii. Call the Call internal method of callback with T as the this value and
        // argument list containing kValue, k, and O.
        callback.call( T, kValue, k, O );
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}

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
    objects.forEach(function(element) {
      // move object
      element.move(contextBounds(context), objects);
      // draw object
      element.draw(context);
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

