const colorPalette = [
  '#F6558F',
  '#FF70CB',
  '#FFADEE',
  '#3942ED',
  '#FFDD02',
  '#D1FF46',
  '#57DAF0',
  '#9CFFD9',
  '#AD6FF9'
];

// reusable sketch definition in instance mode
const makeFlowerSketch = (containerId) => (p) => {
  let cellCount = 5;
  let flowers = [];
  let soundClick;
  let soundGrid;

  class Flower {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.petalRotation = 0;
      this.defaultColor = p.color(217, 141, 240);
      this.hoverColor = p.color(p.random(colorPalette));
      this.currentPetalColor = this.defaultColor;
    }

    update() {
      this.petalRotation += 0.02;

      const distance = p.dist(p.mouseX, p.mouseY, this.x, this.y);
      const targetColor = distance < 2 * this.size ? this.hoverColor : this.defaultColor;

      // instant switch (you can lerp if you like)
      this.currentPetalColor = targetColor;
    }

    show() {
      p.push();

      p.translate(this.x, this.y);

      // stem
      p.fill(32, 199, 85);
      p.rect(0, this.size * 0.5, this.size * 0.1, this.size);

      // petals
      p.push();
      p.rotate(this.petalRotation);
      p.fill(this.currentPetalColor);
      for (let i = 0; i < 8; i++) {
        p.circle(this.size * 0.35, this.size * 0.35, this.size * 0.7);
        p.rotate(p.PI / 3);
      }
      p.pop();

      // face
      p.rotate(4 * (p.PI / 6));
      p.fill(245, 197, 66);
      p.circle(0, 0, this.size * 0.95);

      // eyes
      p.rotate(p.PI / 3);
      p.fill(255);
      p.circle(-this.size * 0.2, 0, this.size * 0.35);
      p.circle(this.size * 0.2, 0, this.size * 0.35);
      p.fill(0);
      p.circle(-this.size * 0.2, 0, this.size * 0.12);
      p.circle(this.size * 0.2, 0, this.size * 0.12);

      p.pop();
    }

    clicked(mx, my) {
      const d = p.dist(mx, my, this.x, this.y);
      if (d < this.size) {
        this.defaultColor = this.hoverColor;
        if (soundClick && soundClick.isLoaded()) soundClick.play();
      }
    }

    reset() {
      this.defaultColor = p.color(217, 141, 240);
    }
  }

  function createGrid() {
    flowers = [];
    const margin = 20;
    const squareSize = Math.min(p.width, p.height);
    const cellSize = (squareSize - margin * 2) / cellCount;

    for (let row = 0; row < cellCount; row++) {
      for (let col = 0; col < cellCount; col++) {
        const x = margin + col * cellSize + cellSize / 2;
        const y = margin + row * cellSize + cellSize / 2;
        flowers.push(new Flower(x, y, cellSize * 0.4));
      }
    }
  }

  p.setup = () => {
    const container = document.getElementById(containerId);
    const side = container.clientWidth || 400; // fallback

    const canvas = p.createCanvas(side, side);
    canvas.parent(container);

    p.rectMode(p.CENTER);

    // sounds are optional; if they 404 the sketch still runs
    soundClick = p.loadSound('/assets/sounds/flower-pressed.mp3', () => {}, () => {});
    soundGrid = p.loadSound('/assets/sounds/new-screen.mp3', () => {}, () => {});

    createGrid();
  };

  p.windowResized = () => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const side = container.clientWidth || 400;
    p.resizeCanvas(side, side);
    createGrid();
  };

  p.draw = () => {
    p.background(232, 210, 255);
    for (const f of flowers) {
      f.update();
      f.show();
    }
  };

  p.mousePressed = () => {
    for (const f of flowers) {
      f.clicked(p.mouseX, p.mouseY);
    }
  };

  p.keyPressed = () => {
    if (p.keyCode === p.BACKSPACE) {
      for (const f of flowers) f.reset();
    }
    if (p.keyCode === p.ENTER || p.keyCode === p.RETURN) {
      cellCount = p.int(p.random(1, 8));
      createGrid();
      if (soundGrid && soundGrid.isLoaded()) soundGrid.play();
    }
  };
};

// create two instances: left + right squares
new p5(makeFlowerSketch('p5-container-left'));
new p5(makeFlowerSketch('p5-container-right'));
