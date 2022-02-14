let canvas, ctx;

let particles = [
  {
    ox: 0,
    oy: 0,
    x: 0,
    y: 0,
    s: 1,
    c: "red",
    staggerY: 100,
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
  window.requestAnimationFrame(animationFrame);
}

function render() {
  setCanvasSize();
  clearCanvas();
  moveParticles();
  renderParticles();
}

function setCanvasSize() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}

function clearCanvas() {
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function moveParticles() {
  const x = 900,
    y = 1010;
  particles.forEach(function (p) {
    const { distance, angle } = getDist(p.ox, p.oy, x, y);

    if (p.x >= x && p.y >= y) return;

    p.x += (distance * Math.cos(angle)) / (p.s * window.innerWidth);

    if (p.staggerY) {
      const { distance: d } = getDist(p.ox, p.oy, x, y);
      p.y += (staggeredDist * Math.sin(angle)) / (p.s * window.innerHeight);
    } else {
      p.y += (distance * Math.sin(angle)) / (p.s * window.innerHeight);
    }
  });
}

function renderParticles() {
  particles.forEach(function (p) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(p.x, p.y);
    ctx.arc(0, 0, 10, 0, 2 * Math.PI);
    ctx.fillStyle = p.c;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });
}

function getDist(x1, y1, x2, y2) {
  const x = x2 - x1,
    y = y2 - y1;

  return {
    distance: Math.sqrt(x * x + y * y),
    angle: Math.atan2(y, x),
  };
}

const getRandX = () => Math.floor(Math.random() * window.innerWidth);
const getRandY = () => Math.floor(Math.random() * window.innerHeight);

function getCurvedPath(start, end) {
  const STEP = 0.05;
  const P1 = [100, 100]; // TODO

  let path = [start];

  for (let t = STEP; t < 1; t += STEP) {
    path.push([
      bezierCurve(start[0], end[0], t, P1[0]),
      bezierCurve(start[1], end[1], t, P1[1]),
    ]);
  }

  path.push(end);
  return path;
}

function bezierCurve(start, end, t, ...controls) {
  if (controls.length > 0) {
    return (
      (1 - t) * bezierCurve(start, controls[0], t, ...controls.slice(1)) +
      t * bezierCurve(controls[0], end, t, ...controls.slice(1))
    );
  }
  return (1 - t) * start + t * end;
}
