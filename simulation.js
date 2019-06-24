/* globals */

let ctx;
let years;

let mossCollection = [];
let emonoCollection = [];
let droppingCollections = [];

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 500;

const getRandX = () => Math.random() * CANVAS_WIDTH;
const getRandY = () => Math.random() * CANVAS_HEIGHT;
const getRand10 = () => Math.random() * 10;

const getNextPos = (oldX, oldY, moveRate) => {

  const signX = Math.random() < 0.5 ? 1 : -1;
  const signY = Math.random() < 0.5 ? 1 : -1;

  let newX = oldX + (signX * moveRate);
  let newY = oldY + (signY * moveRate);

  if (newX >= CANVAS_WIDTH || newX <= 0 || newY >= CANVAS_HEIGHT || newY <= 0) {
    return ({ newX: oldX, newY: oldY });
  } else {
    return ({ newX, newY });
  }

}

const detectCollision = ({ x, y, size }, arr) => {
  for (let i = 0; i < arr.length; i++) {
    let a = arr[i];
    let dstX = a.x - x;
    let dstY = a.y - y;
    let dst = Math.sqrt(dstX * dstX + dstY * dstY);
    if (dst < (a.size + size)) return a;
  }
}

/* entities */

class Being { // All creatures and plants

  constructor({
    x, y, size, growthRate, maxSize,
    lifeLeft, aliveColor, deadColor
  }) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.growthRate = growthRate;
    this.lifeLeft = lifeLeft;
    this.aliveColor = aliveColor;
    this.deadColor = deadColor;
  }

  birth() {
    ctx.fillStyle = this.aliveColor;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
    ctx.fill();
  }

  grow() {
    this.size += this.growthRate;
    ctx.fillStyle = this.aliveColor;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
    ctx.fill();
  }

  clear() {
    ctx.fillStyle = this.deadColor;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
    ctx.fill();
  }

  die() {
    this.isDead = true;
    this.clear();
    ctx.stroke();
  }

}

class Plant extends Being {

  age() {
    this.lifeLeft -= 1;
    if (this.lifeLeft < getRand10()) this.die();
    else if (this.size < this.maxSize) this.grow();
    else return;
  }

}

class Creature extends Being {

  constructor(config) {
    super(config);
    this.moveRate = config.moveRate;
    this.food = config.food;
  }

  age() {
    this.lifeLeft -= 1;
    if (this.lifeLeft < getRand10()) this.die();
    else this.grow();
  }

  move() {
    this.clear();
    ctx.stroke();

    let { newX, newY } = getNextPos(this.x, this.y, this.moveRate);
    this.x = newX; this.y = newY;
    ctx.fillStyle = this.aliveColor;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
    ctx.fill();

    // If encounter food, eat it
    let encounteredFood = detectCollision(this, this.food);
    if (encounteredFood) this.feed(encounteredFood);
  }

  feed(being) {
    being.die();
    this.lifeLeft += being.size;
    this.leaveDroppings();
  }

  leaveDroppings() {
    droppingCollections.push({ x: this.x, y: this.y, size: this.size });
  }

}

class Moss extends Plant {

  constructor(x, y) {
    super({
      x, y, size: 0.1, growthRate: 0.1, lifeLeft: 50,
      aliveColor: "green", deadColor: "black", maxSize: 10
    });
  }

}

class Emono extends Creature {

  constructor(x, y) {
    super({
      x, y, size: 0.1, growthRate: 0.05, lifeLeft: 100,
      aliveColor: "blue", deadColor: "black", moveRate: 5,
      food: mossCollection, maxSize: 5
    });
  }

}

/* helper functions */

function ageAll() {

  mossCollection.forEach((moss, i) => {
    if (moss.isDead) {
      mossCollection.splice(i, 1);
      return;
    };
    moss.age()
  });

  emonoCollection.forEach((emono, i) => {
    if (emono.isDead) {
      emonoCollection.splice(i, 1);
      return;
    };
    emono.move();
    emono.age();
  });

}

function checkDead() {

  // If all emonos are dead
  if (emonoCollection.length === 0) return "All Emonos are dead!";


}

function populate() {
  const canvas = document.getElementById("environment");
  ctx = canvas.getContext("2d");

  for (let i = 0; i < 100; i++) {

    let moss = new Moss(getRandX(), getRandY());
    mossCollection.push(moss);
    moss.birth();

    if (i < 50) {
      let emono = new Emono(getRandX(), getRandY());
      emonoCollection.push(emono);
      emono.birth();
    }

  }

}

function germinateDroppings() {
  droppingCollections.forEach(drop => {
    let moss = new Moss(drop.x, drop.y);
    mossCollection.push(moss);
    moss.birth();
  });
}

function redraw() {
  ctx.save();
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.restore();
}

/* simulation */

window.onload = e => {

  // Onload (get user inputs)

  // Init (populate environment)
  populate();

  // Start timeline
  years = 0;
  let timeline = setInterval(() => {

    years += 10;

    let str = checkDead();
    if (str) {
      alert("Year " + years + " - " + str);
      clearInterval(timeline);
      return;
    }

    ageAll();

    germinateDroppings();

    if (years % 1000 === 0) redraw();

  }, 500);

};
