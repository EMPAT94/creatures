let canvas, ctx, panel;

const TIME_PER_RENDER = 6;

let seeds = [];
let grass = [];
let shrubs = [];
let berries = [];
let lambs = [];
let sheep = [];
let wolves = [];
let direwolves = [];

let hours = 0;

function main() {
  // Set the stage
  canvas = document.getElementById("environment");
  ctx = canvas.getContext("2d");
  panel = document.getElementById("panel");
  document.getElementById("btn").style.display = "none";
  canvas.style.display = "block";

  // Initialize actors

  for (let i = 0; i < 200; i++) {
    grass.push(new Grass());
  }

  for (let i = 0; i < 20; i++) {
    lambs.push(new Lamb());
  }

  for (let i = 0; i < 5; i++) {
    wolves.push(new Wolf());
  }

  // Aaaaaand action
  window.requestAnimationFrame(render);
}

function render() {
  hours += TIME_PER_RENDER;

  if (hours % (24 * 30) === 0) {
    panel.innerHTML = "day: " + hours / 720;
  }

  clearCanvas(ctx);

  // console.log(
  //   "# seeds, grass, lambs, wolves: ",
  //   seeds.length,
  //   grass.length,
  //   lambs.length,
  //   wolves.length
  // );

  if (grass.length > 1000) return;

  seeds = seeds
    .map((seed) => {
      seed.mature(TIME_PER_RENDER).show();
      if (seed.canGerminate()) {
        grass.push(new Grass({ pos: seed.pos }));
        return;
      }
      return seed;
    })
    .filter((x) => x);

  grass = grass
    .map((grass) => {
      grass.mature(TIME_PER_RENDER).show();
      if (grass.isAlive) return grass;
    })
    .filter((x) => x);

  lambs = lambs
    .map((lamb) => {
      lamb.mature(TIME_PER_RENDER).heading(grass, wolves).move();
      if (lamb.hasEaten) {
        lamb.hasEaten = false;
        seeds.push(new Seed({ pos: lamb.pos }));
      }
      if (lamb.isAlive) return lamb;
    })
    .filter((x) => x);

  wolves = wolves
    .map((wolf) => {
      wolf.mature(TIME_PER_RENDER).heading(lambs, []).move();
      if (wolf.hasEaten) {
        wolf.hasEaten = false;
        seeds.push(new Seed({ pos: wolf.pos }));
      }
      if (wolf.isAlive) return wolf;
    })
    .filter((x) => x);

  // setTimeout(() => {
  window.requestAnimationFrame(render);
  // }, 5000);
}
