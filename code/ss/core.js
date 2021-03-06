
function trackKeys(codes) {
  var pressed = Object.create(null);
  function handler(event) {
    if (codes.hasOwnProperty(event.keyCode)) {
      var down = event.type == "keydown";
      pressed[codes[event.keyCode]] = down;
      event.preventDefault();
    }
  }
  addEventListener("keydown", handler);
  addEventListener("keyup", handler);
  return pressed;
}
var arrows = trackKeys(arrowCodes);

function runAnimation(frameFunc) {
  var lastTime = null;
  function frame(time) {
    var stop = false;
    if (lastTime != null) {
      var timeStep = Math.min(time - lastTime, 100) / 1000;
      stop = frameFunc(timeStep) === false;
    }
    lastTime = time;
    if (!stop)
      requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

var running = true;
var preInputPause = false;
function runLevel(level, Display, andThen) {
  var display = new Display(document.getElementById("viewport"), level);
  var uidisplay = new UICanvas();
  uidisplay.init(document.getElementById("viewport"), level);

  runAnimation(function(step) {
    if (!preInputPause && arrows.pause) running = !running;
    if (running) {
      //display.updateHud();
      uidisplay.updateHud();
      level.animate(step, arrows);
      display.drawFrame(step);
      if (level.isFinished()) {
        display.clear();
        uidisplay.clear();
        if (andThen)
          andThen(level.status);
        return false;
      }
    } else {
       uidisplay.paused();
    }
    preInputPause = arrows.pause;
  });
}

function runGame(plans, Display) {
  stats = new Statistics();

  sound = new Sound();
  sound.displayControls("audio-controls");

  function startLevel(n) {
    runLevel(new Level(plans[n]), Display, function(status) {
      if (status == "lost") {
        stats.playerDied();
        uidisplay = new UICanvas();
        uidisplay.setDeaths(stats.deaths);

        //TODO: Generates several new UI and Player level
        /*if (stats.deaths == 3) {
          stats.deaths = 0;
          startLevel(0);
        }*/
        startLevel(n);
      } else if (n < plans.length - 1) {
        startLevel(n + 1);
      } else {
        console.log("You win!");
      }
    });
  }
  startLevel(0);
}
