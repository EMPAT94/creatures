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

function getNewPath({ pos, endPos }) {
  const STEP = 0.01;
  const START = pos;
  const END = endPos;

  const path = [START];
  for (let t = 0; t < 1; t += STEP) {
    path.push([
      bezierCurve(START[0], END[0], t), //, P1[0]),
      bezierCurve(START[1], END[1], t), //, P1[1]),
    ]);
  }
  path.push(END);

  return { path };

  function bezierCurve(start, end, t, ...controls) {
    if (controls.length > 0) {
      return (
        (1 - t) * bezierCurve(start, controls[0], t, ...controls.slice(1)) +
        t * bezierCurve(controls[0], end, t, ...controls.slice(1))
      );
    }
    return (1 - t) * start + t * end;
  }
}

function getDistAndAngBtwnPoints([x1, y1], [x2, y2]) {
  const x = x2 - x1,
    y = y2 - y1;

  return {
    distance: Math.sqrt(x * x + y * y),
    angle: Math.atan2(y, x),
  };
}

function getRandomEndPos({
  pos: [x, y],
  angle = Math.random() * 360 * (Math.PI / 180),
  range,
}) {
  angle += (Chance.Equal ? -1 : 1) * Math.random() * 30 * (Math.PI / 180);

  let nx = x + range * Math.cos(angle);

  if (nx < 0) {
    nx = range;
    angle = Math.random() * 360 * (Math.PI / 180); // TODO Change angle
  } else if (nx > window.innerWidth) {
    nx = window.innerWidth - range;
    angle = Math.random() * 360 * (Math.PI / 180);
  }

  let ny = y + range * Math.sin(angle);

  if (ny < 0) {
    ny = range;
    angle = Math.random() * 360 * (Math.PI / 180);
  } else if (ny > window.innerHeight) {
    ny = window.innerHeight - range;
    angle = Math.random() * 360 * (Math.PI / 180);
  }

  return { endPos: [nx, ny], angle };
}

function getRandomPoint() {
  return [
    Math.floor(Math.random() * window.innerWidth),
    Math.floor(Math.random() * window.innerHeight),
  ];
}

function clearCanvas(ctx) {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
}

function renderParticle(ctx, p) {
  ctx.save();
  ctx.beginPath();
  ctx.translate(p.pos[0], p.pos[1]);
  ctx.arc(0, 0, p.size, 0, 2 * Math.PI);
  ctx.fillStyle = p.color;
  ctx.fill();
  // ctx.strokeStyle = p.color;
  // ctx.stroke();
  ctx.restore();
}

function detectClosestInRange(from = {}, to = []) {
  let closest;
  let hasCollided = false;
  let _minDist = Infinity;

  to.forEach((p) => {
    const dist = getDistAndAngBtwnPoints(from.pos, p.pos).distance;
    if (dist < from.range && _minDist > dist) {
      closest = p;
      _minDist = dist;
    }
  });

  if (_minDist < from.size) hasCollided = true;

  return { closest, hasCollided };
}
