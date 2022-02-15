let canvas, ctx;

const getRandX = () => Math.floor(Math.random() * window.innerWidth);
const getRandY = () => Math.floor(Math.random() * window.innerHeight);

let particles = [
  {
    color: "red",
    pos: getRandomPoint(),
    size: 10,
    angle: null,
    path: [],
    range: 500,
  },
  {
    color: "blue",
    pos: getRandomPoint(),
    size: 10,
    angle: null,
    path: [],
    range: 300,
  },
  {
    color: "green",
    pos: getRandomPoint(),
    size: 10,
    angle: null,
    path: [],
    range: 10,
  },
  {
    color: "yellow",
    pos: getRandomPoint(),
    size: 10,
    angle: null,
    path: [],
    range: 50,
  },
];

function main() {
  document.getElementById("btn").style.display = "none";
  canvas = document.getElementById("environment");
  ctx = canvas.getContext("2d");
  window.requestAnimationFrame(animationFrame);
}

function animationFrame() {
  render();
  // setTimeout(() => {
  window.requestAnimationFrame(animationFrame);
  // }, 100);
}

function render() {
  setCanvasSize(ctx);
  clearCanvas(ctx);
  moveParticles();
}

function moveParticles() {
  particles.forEach(function (p) {
    // If a particle has no heading, make new path
    if (p.path.length === 0) {
      const { path, angle } = getNewPath(p);
      p.path = path;
      p.angle = angle;
    }

    // Update new path position on canvas
    p.pos = p.path.shift();
    renderParticle(ctx, p);
  });
}
