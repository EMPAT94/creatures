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

function getNewPath({ pos, angle, range }) {
  // Calculate control point
  // It is always in the middle of and slightly "above" or "below" line
  // const theta = (Chance.Equal ? -1 : 1) * 45 * (Math.PI / 180);
  // const { distance, angle } = getDist(start, end);

  // const P1 = [
  //   start[0] + (distance / 2),
  //   start[1] + (distance / 2)
  // ];

  const STEP = 0.01;
  const START = pos;

  const { endPos, angle: newAngle } = getRandomEndPositionInRange({
    pos,
    angle,
    range,
  });
  const END = endPos;

  const path = [START];
  for (let t = 0; t < 1; t += STEP) {
    path.push([
      bezierCurve(START[0], END[0], t), //, P1[0]),
      bezierCurve(START[1], END[1], t), //, P1[1]),
    ]);
  }
  path.push(END);

  return { path, angle: newAngle };

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

function getDistAndAngBwPoints([x1, y1], [x2, y2]) {
  const x = x2 - x1,
    y = y2 - y1;

  return {
    distance: Math.sqrt(x * x + y * y),
    angle: Math.atan2(y, x),
  };
}

function getRandomEndPositionInRange({
  pos: [x, y],
  angle = Math.random() * 360 * (Math.PI / 180),
  range,
}) {
  angle += (Chance.Equal ? -1 : 1) * Math.random() * 30 * (Math.PI / 180);

  let nx = x + range * Math.cos(angle);

  if (nx < 0) {
    nx = range;
    angle = Math.random() * 360 * (Math.PI / 180);
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
