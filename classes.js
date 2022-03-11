class Being {
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

    if (o.pos) this.pos = o.pos;
  }

  die() {
    this.isAlive = false;
    this.color = this.deadColor;
    return this;
  }
}

class Flora extends Being {
  mature(time) {
    this.age += time;
    if (this.size < this.maxSize) this.size += time / 10;
    return this;
  }

  show() {
    renderParticle(ctx, this);
    return this;
  }
}

class Fauna extends Being {
  mature(time) {
    if (this.isalive) {
      this.age += time;
      if (
        this.age > this.maxage - this.maxage * 0.2 &&
        this.age < this.maxage
      ) {
        return this._dying();
      } else if (this.age >= this.maxage) {
        return this.die();
      }
    }
    return this;
  }

  grow(feed) {
    if (this.size < this.maxSize) this.size += feed;
    return this;
  }

  heading(food, predators) {
    if (!this.path.length) {
      // In order of priority:
      // 1. Run away from predators
      // 2. Run towards feed
      // 3. Move randomly with herd
      this.boostRange = false;

      const { closest: closestPredator } = detectClosestInRange(
        this,
        predators.filter((p) => p.isAlive)
      );

      if (closestPredator) {
        this.boostRange = true;
        ({ endPos: this.endPos, angle: this.angle } = getRandomEndPos(this));
        ({ path: this.path } = getNewPath(this));
        return this;
      }

      const { closest: closestfood, hasCollided: hasEaten } =
        detectClosestInRange(
          this,
          food.filter((f) => f.isAlive)
        );

      if (closestfood) {
        this.endPos = closestfood.pos;
        ({ path: this.path } = getNewPath(this));
        if (hasEaten) {
          closestfood.die();
          this.hasEaten = true;
        }
        return this;
      }

      ({ endPos: this.endPos, angle: this.angle } = getRandomEndPos(this));
      ({ path: this.path } = getNewPath(this));
    }

    return this;
  }

  move() {
    if (this.isAlive && this.path.length) {
      this.pos = this.path.pop();
      renderParticle(ctx, this);
    }
    return this;
  }

  _dying() {
    this.color = this.dyingColor;
    return this;
  }
}

class Seed extends Flora {
  constructor() {
    super({
      maxAge: 24 * 30,
      aliveColor: "brown",
      size: 5,
      range: 0,
    });
  }

  canGerminate() {
    return this.age >= this.maxAge;
  }
}

class Grass extends Flora {
  constructor(o) {
    super({
      maxSize: 7,
      aliveColor: "lightgreen",
      size: 2,
      range: 0,
      ...o,
    });
  }
}

class Lamb extends Fauna {
  constructor() {
    super({
      maxSize: 10,
      maxAge: yearsToHours(15),
      aliveColor: "orange",
      size: 3,
      range: 30,
    });
  }
}

class Wolf extends Fauna {
  constructor() {
    super({
      maxSize: 13,
      maxAge: yearsToHours(30),
      aliveColor: "steelblue",
      size: 4,
      range: 50,
    });
  }
}
