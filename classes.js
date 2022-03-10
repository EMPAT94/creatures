class Particle {
  path = [];
  pos = getRandomPoint();
  age = 0;
  isAlive = true;

  constructor(o) {
    this.size = o.size;
    this.range = o.range;
    this.maxSize = o.maxSize;
    this.maxAge = o.maxAge || Infinity;

    this.color = o.aliveColor;
    this.dyingColor = o.dyingColor || "grey";
    this.deadColor = o.deadColor || "white";
  }

  mature(time) {
    if (this.isAlive) {
      this.age += time;
      if (this.age > this.maxAge - 5 && this.age < this.maxAge) {
        return this._dying();
      } else if (this.age >= this.maxAge) {
        return this.die();
      }
    }
    return this;
  }

  grow(feed) {
    if (this.size < this.maxSize) this.size += feed;
    return this;
  }

  move() {
    if (this.isAlive && this.path.length) {
      this.pos = this.path.shift();
      renderParticle(ctx, this);
    }
    return this;
  }

  _dying() {
    this.color = this.dyingColor;
    return this;
  }

  die() {
    this.isAlive = false;
    this.color = this.deadColor;
    return this;
  }
}

class Grass extends Particle {
  constructor() {
    super({
      maxSize: 30,
      aliveColor: "lightgreen",
      size: 7,
      range: 0,
    });
  }

  heading() {
    // This is required coz entire canvas is re-rendered
    this.path = [this.pos];
    return this;
  }
}

class Lamb extends Particle {
  constructor() {
    super({
      maxSize: 10,
      maxAge: yearsToHours(15),
      aliveColor: "yellow",
      size: 4,
      range: 30,
    });
  }

  heading(food, predators) {
    if (!this.path.length) {
      // In order of priority:
      // 1. Run away from predators
      // 2. Run towards feed
      // 3. Move randomly with herd

      const { closest: closestPredator } = detectClosestInRange(
        this,
        predators.filter((p) => p.isAlive)
      );

      const { closest: closestfood, hasCollided: hasEaten } =
        detectClosestInRange(
          this,
          food.filter((f) => f.isAlive)
        );

      if (closestPredator) {
        this.boostRange = true;
        ({ endPos: this.endPos, angle: this.angle } = getRandomEndPos(this));
      } else if (closestfood) {
        this.endPos = closestfood.pos;
        if (hasEaten) closestfood.die();
      } else {
        ({ endPos: this.endPos, angle: this.angle } = getRandomEndPos(this));
      }
      this.boostRange = false;
      ({ path: this.path } = getNewPath(this));
    }
    return this;
  }
}

class Wolf extends Particle {
  constructor() {
    super({
      maxSize: 15,
      maxAge: yearsToHours(30),
      aliveColor: "steelblue",
      size: 5,
      range: 75,
    });
  }

  heading(food) {
    if (!this.path.length) {
      // In order of priority:
      // 1. Run towards closest food
      // 2. Move randomly

      const { closest, hasCollided } = detectClosestInRange(
        this,
        food.filter((f) => f.isAlive)
      );
      if (closest) {
        this.endPos = closest.pos;
        if (hasCollided) closest.die();
      } else {
        ({ endPos: this.endPos, angle: this.angle } = getRandomEndPos(this));
      }
      ({ path: this.path } = getNewPath(this));
    }
    return this;
  }
}
