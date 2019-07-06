"use strict";

/* globals */

let ctx;
let years = 0;

let mossCollection = [];
let emonoCollection = [];
let jeagerCollection = [];
let droppingCollections = [];

let CANVAS_WIDTH = 1000;
let CANVAS_HEIGHT = 500;

const getRandX = () => Math.floor(Math.random() * CANVAS_WIDTH);
const getRandY = () => Math.floor(Math.random() * CANVAS_HEIGHT);
const getRand10 = () => Math.random() * 10;
const getRand5 = () => (Math.random() * 10) % 5;

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

    if (this.lifeLeft < 30) this.aliveColor = "grey";

    if (this.lifeLeft < getRand10()) this.die();
    else if (this.size < this.maxSize) this.grow();
    else if (!this.hasReproduced) this.reproduce();

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
      x, y, size: 0.1, growthRate: 0.08,
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

  reproduce() {
    this.hasReproduced = true;
    let numChild = getRand5();

    for (let i = 0; i < numChild; i++) {
      let emono = new Emono(this.x, this.y);
      emonoCollection.push(emono);
      emono.birth();
    }

  }

}

class Jeager extends Creature {

  constructor(x, y) {
    super({
      x, y, size: 0.5, growthRate: 0.03, lifeLeft: 250,
      aliveColor: "red", deadColor: "black", moveRate: 3,
      food: emonoCollection, maxSize: 8
    });
  }

  reproduce() {
    this.hasReproduced = true;
    let numChild = 1;
    if (getEqualChance()) numChild = 2;

    for (let i = 0; i < numChild; i++) {
      let jeager = new Jeager(this.x, this.y);
      jeagerCollection.push(jeager);
      jeager.birth();
    }

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

  jeagerCollection.forEach((jeager, i) => {
    if (jeager.isDead) {
      jeagerCollection.splice(i, 1);
    } else {
      jeager.move();
      jeager.age();
    }
  });

}

function checkDead() {
  if (emonoCollection.length === 0) return "All Emonos are dead!";
  if (jeagerCollection.length === 0) return "All Jeagers are dead!";
}

function populate() {

  const num_moss = document.getElementById("num_moss").value;
  const num_emono = document.getElementById("num_emono").value;
  const num_jeager = document.getElementById("num_jeager").value;

  if (num_moss > 500 || num_moss > 500 || num_jeager > 500) {
    return alert("Number must be less than 500");
  }

  document.getElementById("instructions").hidden = true;
  document.getElementById("environment").hidden = false;

  ctx = document.getElementById("environment").getContext("2d");

  for (let i = 0; i < num_moss; i++) {
    let moss = new Moss(getRandX(), getRandY());
    mossCollection.push(moss);
    moss.birth();
  }

  for (let i = 0; i < num_emono; i++) {
    let emono = new Emono(getRandX(), getRandY());
    emonoCollection.push(emono);
    emono.birth();
  }

  for (let i = 0; i < num_jeager; i++) {
    let jeager = new Jeager(getRandX(), getRandY());
    jeagerCollection.push(jeager);
    jeager.birth();
  }

  window.requestAnimationFrame(updateEnvironment);

}

function germinateDroppings() {
  droppingCollections.forEach((drop, i) => {
    if (getFrequentChance()) {
      let moss = new Moss(drop.x, drop.y);
      mossCollection.push(moss);
      moss.birth();

      if (getRareChance()) {
        // TODO: Add Musk here
        let moss = new Moss(drop.x, drop.y);
        moss.moveRate = 5;
        setNewPos.call(moss);
        mossCollection.push(moss);
        moss.birth();
      }
    }
    droppingCollections.splice(i, 1);
  });
}

function updateEnvironment() {

  years += 10;

  let str = checkDead();
  if (str) {
    alert("Year " + years + " - " + str);
    return;
  }

  if (years >= 20000) {
    alert("Year 20000 - You win!");
    return;
  }

  ageAll();
  germinateDroppings();

  window.requestAnimationFrame(updateEnvironment);

}

