class Particle {
  path = [];
  pos = getRandomPoint();
  age = 0;
  isAlive = true;

  constructor(o) {
    this.maxSize = o.maxSize;
    this.color = o.color;
    this.size = o.size;
    this.range = o.range;
  }

  age(time) {
    this.age += time;
  }

  grow(feed) {
    this.size += feed;
  }

  heading() {
    if (!this.path.length) {
      if (!this.range) {
        this.path = [this.pos];
        return this;
      }

      ({ endPos: this.endPos, angle: this.angle } = getRandomEndPos(this));

      this.path = getNewPath(this).path;
    }
    return this;
  }

  move() {
    if (this.path.length) {
      this.pos = this.path.shift();
      renderParticle(ctx, this);
    }
  }

  die() {
    this.isAlive = false;
  }
}

class Grass extends Particle {
  constructor() {
    super({ maxSize: 30, color: "lightgreen", size: 7, range: 0 });
  }
}

class Lamb extends Particle {
  constructor() {
    super({ maxSize: 10, color: "yellow", size: 4, range: 50 });
  }

  heading() {
    // In order of priority:
    // 1. Run away from predators
    // 2. Run towards feed
    // 3. Move randomly with herd
    return super.heading();
  }
}

class Wolf extends Particle {
  constructor() {
    super({ maxSize: 15, color: "steelblue", size: 5, range: 100 });
  }

  heading() {
    // In order of priority:
    // 1. Run towards feed
    // 2. Move randomly away from others wolves
    return super.heading();
  }
}
