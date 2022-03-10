let canvas, ctx, panel;

const TIME_PER_RENDER = 1;

let grass = [];
let lambs = [];
let wolves = [];

let hours = 0;

function main() {
  // Set the stage
  canvas = document.getElementById("environment");
  ctx = canvas.getContext("2d");
  panel = document.getElementById("panel");
  document.getElementById("btn").style.display = "none";
  canvas.style.display = "block";

  // Initialize actors
  for (let i = 0; i < 300; i++) {
    grass.push(new Grass());
  }

  for (let i = 0; i < 100; i++) {
    lambs.push(new Lamb());
  }

  for (let i = 0; i < 1; i++) {
    wolves.push(new Wolf());
  }

  // Aaand action
  window.requestAnimationFrame(render);
}

function render() {
  hours += TIME_PER_RENDER;

  // if (hours % (24 * 30) === 0) {
  // panel.innerHTML = "month: " + hours / 720;
  // }

  clearCanvas(ctx);

  grass.forEach((a) => {
    if (a) {
      a.mature(TIME_PER_RENDER).heading().move();
      if (!a.isAlive) a = null;
    }
  });

  lambs.forEach((a) => {
    if (a) {
      a.mature(TIME_PER_RENDER).heading(grass, wolves).move();
      if (!a.isAlive) a = null;
    }
  });

  wolves.forEach((a) => {
    if (a) {
      a.mature(TIME_PER_RENDER).heading(lambs).move();
      if (!a.isAlive) a = null;
    }
  });

  // setTimeout(() => {
  window.requestAnimationFrame(render);
  // }, 100);
}
