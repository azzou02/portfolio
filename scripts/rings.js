// Instance-mode wrapper: one sketch per container
const makeCircleGridSketch = (containerId) => (p) => {
  let bgColor = 255;
  const cellCount = 6;
  const margin = 10;

  // keep square canvas sized to container
  const setupCanvas = () => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const side = container.clientWidth || 600;
    p.resizeCanvas(side, side);
  };

  p.setup = () => {
    const container = document.getElementById(containerId);
    const side = container?.clientWidth || 600;

    const canvas = p.createCanvas(side, side);
    canvas.parent(containerId);

    p.frameRate(30);
    bgColor = 255;
  };

  p.windowResized = () => {
    setupCanvas();
  };

  p.draw = () => {
    p.background(bgColor);

    let cellSize = (p.width - margin * 2) / cellCount;

    for (let row = 0; row < cellCount; row++) {
      for (let col = 0; col < cellCount; col++) {
        let x = margin + col * cellSize + cellSize / 2;
        let y = margin + row * cellSize + cellSize / 2;
        oscillateCircle(x, y);
      }
    }
  };

  p.mousePressed = () => {
    bgColor = (bgColor === 255) ? 0 : 255;
  };

  function oscillateCircle(x, y) {
    p.noStroke();
    p.fill(0); // outer circle (will get covered by inner ones sometimes)
    p.circle(x, y, 60);

    if (p.frameCount % 2 === 0) {
      p.fill(p.random(255), p.random(255), p.random(255));
      p.circle(x, y, 45);

      p.fill(p.random(255), p.random(255), p.random(255));
      p.circle(x, y, 30);

      p.fill(p.random(255), p.random(255), p.random(255));
      p.circle(x, y, 15);
    }
  }
};

// create two instances for left and right squares
new p5(makeCircleGridSketch('p5-container-left'));
new p5(makeCircleGridSketch('p5-container-right'));
