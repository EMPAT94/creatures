let canvas, ctx;

let actors = [];
let hour = 0;

function main() {
  // Set the stage
  document.getElementById("btn").style.display = "none";
  canvas = document.getElementById("environment");
  ctx = canvas.getContext("2d");

  // Initialize actors
  for (let i = 0; i < 5; i++) {
    actors.push(new Grass());
  }

  for (let i = 0; i < 1; i++) {
    actors.push(new Lamb());
  }

  for (let i = 0; i < 1; i++) {
    actors.push(new Wolf());
  }

  // Aaand action
  window.requestAnimationFrame(animationFrame);
}

function animationFrame() {
  hour += 1;
  render(actors);
  // setTimeout(() => {
  window.requestAnimationFrame(animationFrame);
  // }, 100);
}

function render(actors = []) {
  clearCanvas(ctx);
  simulate(actors);
}

function simulate(actors) {
  actors.forEach(function (a) {
    a.heading().move();
  });
}
