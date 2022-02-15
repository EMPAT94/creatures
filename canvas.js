function setCanvasSize(ctx) {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}

function clearCanvas(ctx) {
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
}

function renderParticle(ctx, { pos, color, size }) {
  ctx.save();
  ctx.beginPath();
  ctx.translate(pos[0], pos[1]);
  ctx.arc(0, 0, size, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function detectCollision(from, ...to) {
  return "todo";
}
