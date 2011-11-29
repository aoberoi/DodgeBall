// "Constants"
var BALL_COLOR = "#000066";
var BALL_RADIUS = 20;

// DOM is ready to be traversed, implmentation scraped from jQuery
DomReady.ready(function() {

  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');

  // Compute center of canvas
  var center = { x: canvas.width/2, y: canvas.height/2 };

  // Create ball object
  var ball = {
    x: center.x,
    y: center.y,
    radius: BALL_RADIUS,
    color: BALL_COLOR
  };

  // Draw the ball
  // params: center.x, center.y, radius, beginRadians, endRadians
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
  context.fillStyle = ball.color;
  context.fill();


});

