/* globals */

let ctx;
let years;

let mossCollection = [];
let emonoCollection = [];
let droppingCollections = [];

let CANVAS_WIDTH = 1000;
let CANVAS_HEIGHT = 500;

const getRandX = () => Math.floor(Math.random() * CANVAS_WIDTH);
const getRandY = () => Math.floor(Math.random() * CANVAS_HEIGHT);
const getRand10 = () => Math.random() * 10;

const getEqualChance = () => Math.random() < 0.5;
const getFrequentChance = () => Math.random() < 0.7;
const getRareChance = () => Math.random() < 0.1;

const detectCollision = ({ x, y, size }, arr) => {
  for (let i = 0; i < arr.length; i++) {
    let a = arr[i];
    let dstX = a.x - x;
    let dstY = a.y - y;
    let dst = Math.sqrt(dstX * dstX + dstY * dstY);
    if (dst < (a.size + size)) return a;
  }
}

function setNewPos() {

  this.dir = this.dir || {};

  if (this.x <= 0) this.dir.x = 1;
  else if (this.x >= CANVAS_WIDTH) this.dir.x = -1;
  else if (!this.dir.x) {
    if (getEqualChance()) this.dir.x = 1;
    else this.dir.x = -1;
  }

  if (this.y <= 0) this.dir.y = 1;
  else if (this.y >= CANVAS_HEIGHT) this.dir.y = -1;
  else if (!this.dir.y) {
    if (getEqualChance()) this.dir.y = 1;
    else this.dir.y = -1;
  }

  if (this.dir.x) {
    if (getRareChance()) this.dir.x *= -1;
    this.x += this.dir.x * this.moveRate;
  }
  if (this.dir.y) {
    if (getRareChance()) this.dir.y *= -1;
    this.y += this.dir.y * this.moveRate;
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
    this.aliveColor = aliveColor;
    this.deadColor = deadColor;
    this.maxSize = maxSize;
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
    if (this.size < this.maxSize) this.grow();
  }

}

class Creature extends Being {

  constructor(config) {
    super(config);
    this.moveRate = config.moveRate;
    this.food = config.food;
    this.lifeLeft = config.lifeLeft;
  }

  age() {
    this.lifeLeft -= 1;
    if (this.lifeLeft < getRand10()) this.die();
    else if (this.size < this.maxSize) this.grow();
    else if (!this.hasReproduced) this.reproduce();
  }

  reproduce() {
    this.hasReproduced = true;
    let numChild = getRand10();

    for (let i = 0; i < numChild; i++) {
      let emono = new Emono(this.x, this.y);
      emonoCollection.push(emono);
      emono.birth();
    }

  }

  move() {
    this.clear();
    ctx.stroke();

    setNewPos.call(this);
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
      x, y, size: 0.1, growthRate: 0.1,
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
    } else {
      moss.age();
    }
  });

  emonoCollection.forEach((emono, i) => {
    if (emono.isDead) {
      emonoCollection.splice(i, 1);
    } else {
      emono.move();
      emono.age();
    }
  });

}

function checkDead() {

  // If all emonos are dead
  if (emonoCollection.length === 0) return "All Emonos are dead!";


}

function populate() {

  for (let i = 0; i < 300; i++) {

    let moss = new Moss(getRandX(), getRandY());
    mossCollection.push(moss);
    moss.birth();

    if (i < 1) {
      let emono = new Emono(getRandX(), getRandY());
      emonoCollection.push(emono);
      emono.birth();
    }

  }

}

function germinateDroppings() {
  droppingCollections.forEach((drop, i) => {
    if (getFrequentChance()) {
      let moss = new Moss(drop.x, drop.y);
      mossCollection.push(moss);
      moss.birth();
    }
    droppingCollections.splice(i, 1);
  });
}

/* simulation */

window.onload = e => {

  const canvas = document.getElementById("environment");
  ctx = canvas.getContext("2d");

  // Onload (get user inputs)

  // Init (populate environment)
  populate();

  // Start timeline
  years = 0;

  function updateEnvironment() {

    years += 10;

    let str = checkDead();
    if (str) {
      alert("Year " + years + " - " + str);
      return;
    }

    ageAll();
    germinateDroppings();

    window.requestAnimationFrame(updateEnvironment);
  }

  window.requestAnimationFrame(updateEnvironment);

};
