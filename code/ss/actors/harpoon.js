﻿function Harpoon(pos, ch) {
  this.pos = pos;
  this.size = new Vector(1, 1);
  this.repeatPos = pos;
  this.ch = ch;
  if (ch == "h") {
    this.speed = new Vector(20, 0);
    this.interval = 1;
    this.timeToWait = this.interval;
  } else if (ch == "i") {
    this.speed = new Vector(20, 0);
    this.interval = 2;
    this.timeToWait = this.interval;
  } else if (ch == "j") {
    this.speed = new Vector(-20, 0);
    this.interval = 1;
    this.timeToWait = this.interval;
  } else if (ch == "k") {
    this.speed = new Vector(-20, 0);
    this.interval = 2;
    this.timeToWait = this.interval;
  } else if (ch == "H") {
    this.repeat = 0;
    this.speed = new Vector(40, 0);
  }
}

Harpoon.prototype.intervalShoot = function(step, level) {
  if (this.timeToWait < 0) {
    var newPos = this.pos.plus(this.speed.times(step));
    if (!level.obstacleAt(newPos, this.size)) {
      this.pos = newPos;
    } else if (this.repeatPos) {
      this.pos = this.repeatPos;
      this.timeToWait = this.interval;
    }
  } else {
    this.timeToWait -= step;
  }
}

Harpoon.prototype.switchShoot = function (step, level) {
    if (this.repeat == 0) return;

    var newPos = this.pos.plus(this.speed.times(step));
    if (!level.obstacleAt(newPos, this.size)) {
      this.pos = newPos;
    } else if (this.repeatPos) {
      this.pos = this.repeatPos;
      this.repeat -= 1;
    }
}

Harpoon.prototype.type = "harpoon";

Harpoon.prototype.act = function(step, level) {
  if (this.ch == "H") this.switchShoot(step, level);
  else this.intervalShoot(step, level);
};
