let canvas, ctx;

const getRandX = () => Math.floor(Math.random() * window.innerWidth);
const getRandY = () => Math.floor(Math.random() * window.innerHeight);

let particles = [
  {
    state: {
      color: "green",
      x: getRandX(), // Current x
      y: getRandY(),
      nx: null, // Next x
      ny: null,
      angle: null, // Which direction does it favor?
    },
    path: [],
    range: 0, // How far can it see?
  },
  {
    state: {
      speed: 2,
      color: "yellow",
      x: getRandX(),
      y: getRandY(),
      angle: null, // Which direction does it favor?
    },
    path: [],
    range: 100, // How far can it see?
  },
  {
    state: {
      speed: 2,
      color: "yellow",
      x: getRandX(),
      y: getRandY(),
      angle: null, // Which direction does it favor?
    },
    path: [],
    range: 100, // How far can it see?
  },
  {
    state: {
      speed: 2,
      color: "yellow",
      x: getRandX(),
      y: getRandY(),
      angle: null, // Which direction does it favor?
    },
    path: [],
    range: 100, // How far can it see?
  },
  {
    state: {
      speed: 2,
      color: "yellow",
      x: getRandX(),
      y: getRandY(),
      angle: null, // Which direction does it favor?
    },
    path: [],
    range: 100, // How far can it see?
  },
  {
    state: {
      speed: 2,
      color: "yellow",
      x: getRandX(),
      y: getRandY(),
      angle: null, // Which direction does it favor?
    },
    path: [],
    range: 100, // How far can it see?
  },
  {
    state: {
      speed: 2,
      color: "yellow",
      x: getRandX(),
      y: getRandY(),
      angle: null, // Which direction does it favor?
    },
    path: [],
    range: 100, // How far can it see?
  },
  {
    state: {
      speed: 2,
      color: "yellow",
      x: getRandX(),
      y: getRandY(),
      angle: null, // Which direction does it favor?
    },
    path: [],
    range: 100, // How far can it see?
  },
  {
    state: {
      speed: 2,
      color: "yellow",
      x: getRandX(),
      y: getRandY(),
      angle: null, // Which direction does it favor?
    },
    path: [],
    range: 100, // How far can it see?
  },
  {
    state: {
      speed: 2,
      color: "yellow",
      x: 0,
      y: 0,
      angle: null, // Which direction does it favor?
    },
    path: [],
    range: 100, // How far can it see?
  },
  {
    state: {
      speed: 2,
      color: "yellow",
      x: 0,
      y: 0,
      angle: null, // Which direction does it favor?
    },
    path: [],
    range: 100, // How far can it see?
  },
  {
    state: {
      speed: 2,
      color: "yellow",
      x: 0,
      y: 0,
      angle: null, // Which direction does it favor?
    },
    path: [],
    range: 100, // How far can it see?
  },
  {
    state: {
      speed: 3,
      color: "slateblue",
      x: 0,
      y: 0,
      angle: null, // Which direction does it favor?
    },
    path: [],
    range: 200, // How far can it see?
  },
  // {
  //   state: {
  //     speed: 4,
  //     color: "red",
  //     x: 0,
  //     y: 0,
  //   },
  //   path: [],
  //   range: 5, // How far can it see?
  // },
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
  particles.forEach(function (p) {
    // If a particle has no heading
    if (p.path.length === 0) {
      getRandomEndPositionInRange(p);
      // Find a random destination
      const start = [p.state.x, p.state.y];
      const end = [p.state.nx, p.state.ny];
      // Calculate path
      p.path = getCurvedPath(start, end);
    }
  });
}

function renderParticles() {
  particles.forEach(function (p) {
    ctx.save();
    ctx.beginPath();
    const [x, y] = p.path.shift();
    p.state.x = x;
    p.state.y = y;
    ctx.translate(p.state.x, p.state.y);
    ctx.arc(0, 0, 10, 0, 2 * Math.PI);
    ctx.fillStyle = p.state.color;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });
}

function getRandomEndPositionInRange(p) {
  let {
    state: { x, y, angle },
    range,
  } = p;

  if (!angle) {
    p.state.angle = Math.random() * 360 * (Math.PI / 180);
  } else {
    p.state.angle =
      angle + (Chance.Equal ? -1 : 1) * Math.random() * 30 * (Math.PI / 180);
    angle = p.state.angle;
  }

  let nx = x + range * Math.cos(angle);
  if (nx < 0) {
    nx = p.range;
    p.state.angle = Math.random() * 360 * (Math.PI / 180);
  }

  if (nx > window.innerWidth) {
    nx = window.innerWidth - p.range;
    p.state.angle = Math.random() * 360 * (Math.PI / 180);
  }

  let ny = y + range * Math.sin(angle);
  if (ny < 0) {
    ny = p.range;
    p.state.angle = Math.random() * 360 * (Math.PI / 180);
  }
  if (ny > window.innerHeight) {
    ny = window.innerHeight - p.range;
    p.state.angle = Math.random() * 360 * (Math.PI / 180);
  }

  p.state.nx = nx;
  p.state.ny = ny;
}

class Chance {
  static get Rare() {
    return Math.random() <= 0.2;
  }
  static get Equal() {
    return Math.random() <= 0.4;
  }
  static get Frequent() {
    return Math.random() <= 0.7;
  }
}

function getCurvedPath(start, end, step = 0.01) {
  // Calculate control point
  // It is always in the middle of and slightly "above" or "below" line
  // const theta = (Chance.Equal ? -1 : 1) * 45 * (Math.PI / 180);
  // const { distance, angle } = getDist(start, end);

  // const P1 = [
  //   start[0] + (distance / 2),
  //   start[1] + (distance / 2)
  // ];

  let path = [start];
  for (let t = 0; t < 1; t += step) {
    path.push([
      bezierCurve(start[0], end[0], t), //, P1[0]),
      bezierCurve(start[1], end[1], t), //, P1[1]),
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

function getDist(x1, y1, x2, y2) {
  const x = x2 - x1,
    y = y2 - y1;

  return {
    distance: Math.sqrt(x * x + y * y),
    angle: Math.atan2(y, x),
  };
}
