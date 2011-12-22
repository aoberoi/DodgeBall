// Using Module Pattern because this is a singleton object
// We are only going to have one of these, might as well encapsulate into its own closure
var DODGEBALL = function(window, document, DomReady) {

  // Defining traits that can be reused to compose behavior

  // Physical objects that have an origin and bounds
  var isPhysical = function(options) {
    // Giving each possible option a default value using logical OR operator
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.width = options.width || 0;
    this.height = options.height || 0;
  };

  // Displayed objects have the ability to be drawn
  var isDisplayed = function(options) {
    // TODO: default function allocated at every call. not optimal
    this.draw = options.draw || function() { console.log('Attempted to draw an invisible object') };
  };
  
  // Kinetic objects have velocity, mass, etc
  // i.e. these are objects that need to have collision detection
  var isKinetic = function(options) {
    this.velocity = {};
    // if velocity is not explicitly defined, we give it a default value
    if (!options.velocity) options.velocity = {};
    this.velocity.x = options.velocity.x || 0;
    this.velocity.y = options.velocity.y || 0;

    this._isKinetic = true;
  };

  // Ball object constructor
  var Ball = function(x, y, radius, color, velocity) {

    // TODO: changing the radius will not change the width and height properties
    this.radius = radius || 20;
    isPhysical.call(this, { x: x, y: y, width: radius*2, height: radius*2 });

    // TODO: draw handler gets redefined for every ball object. memory hog
    this.color = color || '#000066';
    isDisplayed.call(this, { draw: function(context) {
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
    }});

    // TODO: initial values are hard coded and get reallocated each time.
    var velocity = velocity || { x: 5, y: 5 };
    isKinetic.call(this, { velocity: velocity });
  }

  // Animation Loop
  // this object is another singleton so we can use module pattern
  var animationLoop = (function() {
    var context;
    // TODO: move this to kinetic objects namespace
    var bounds;
    var running = false;
    var displayObjects;

    // Render a single frame onto the stored context
    var render = function() {
      // Clear the drawing context
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);

      // Tell each object to draw()
      displayObjects.forEach(function(element) {
        element.draw(context);
      });
    };
    
    // Physics stuff goes down here
    // TODO: move this function to kinetic objects namespace
    // TODO: use timeDiff intelligently
    var updateKineticObjects = function(timeDiff) {
      // TODO: get this working for more than one object
      // TODO: get this working for objects other than balls
      displayObjects.forEach(function(element) {
        if (element._isKinetic) {
          element.x += element.velocity.x;
          element.y += element.velocity.y;
          if (element.x + element.radius >= bounds.xMax) {
            element.x = bounds.xMax - element.radius;
            element.velocity.x = element.velocity.x * -1;
          } else if (element.x - element.radius <= bounds.xMin) {
            element.x = bounds.xMin + element.radius;
            element.velocity.x = element.velocity.x * -1;
          }
          if (element.y + element.radius >= bounds.yMax) {
            element.y = bounds.yMax - element.radius;
            element.velocity.y = element.velocity.y * -1;
          } else if (element.y - element.radius <= bounds.yMin) {
            element.y = bounds.yMin + element.radius;
            element.velocity.y = element.velocity.y * -1;
          }
        }
      });
    };

    var loop = function(lastTime) {
      var date = new Date();
      var time = date.getTime();
      var timeDiff = time - lastTime;

      // TODO: call a generic updating function
      updateKineticObjects(timeDiff);

      render();

      if (running) {
        requestAnimFrame(function() {
          loop(time);
        });
      }
    }

    return {
      init : function(ctx, displayOs) {
        context = ctx;
        displayObjects = displayOs;
        // TODO: move this to kinetic objects namespace
        // TODO: set up event listeners to change these values as needed
        bounds = {
          xMin: 0,
          xMax: context.canvas.width,
          yMin: 0,
          yMax: context.canvas.height
        };
      },
      start : function() {
        if (!context || !displayObjects) throw new Error('Cannot start animation loop without a context');
        running = true;
        loop();
      },
      stop : function() {
        running = false;
      }
    }
  }());

  DomReady.ready(function() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
  
    // Initialization of objects which depends on view (canvas)
    var firstBall = new Ball(canvas.width / 2,
                             canvas.height / 2);

    // Begin the animation loop
    animationLoop.init(context, [ firstBall ]);
    animationLoop.start();
  });
// This is cool, put dependencies in here. minification win
}(window, document, DomReady);


