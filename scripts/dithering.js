let cam;
let vidW = 288,
    vidH = 216,
    scl = 10;
let w, h;
let ditherG;
let DITHER_W;
let DITHER_H;

const bayer4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

const PINK = { r: 230, g: 60, b: 150 };
const YELLOW = { r: 250, g: 230, b: 90 };
const PURPLE = { r: 100, g: 0, b: 100 };
const TEAL = { r: 0, g: 230, b: 180 };

function setup() {
  let canvas = createCanvas(vidW * scl, vidH * scl);
  canvas.parent('p5-container');

  pixelDensity(1);
  imageMode(CENTER);
 
  DITHER_W = vidW;
  DITHER_H = vidH;

  cam = createCapture(VIDEO);
  cam.size(DITHER_W, DITHER_H);
  cam.hide();

  ditherG = createGraphics(DITHER_W, DITHER_H);
  ditherG.pixelDensity(1);

  calculateDimensions();
}

function draw() {
  background(0);
  if (cam && ditherG) {
    doDither(cam, ditherG);
    drawDither(0, 0);
  }
}

function calculateDimensions() {
  let scaleX = floor(windowWidth / vidW);
  let scaleY = floor(windowHeight / vidH);
  scl = min(scaleX, scaleY);
  scl = max(1, scl);

  let newW = vidW * scl;
  let newH = vidH * scl;
  resizeCanvas(newW, newH);

  if (cam) {
    w = width / cam.width;
    h = height / cam.height;
  }
}

function doDither(cam, dG) {
  if (!cam || !dG) return;

  cam.loadPixels();
  if (!cam.pixels.length) return;

  dG.loadPixels();

  for (let y = 0; y < cam.height; y++) {
    for (let x = 0; x < cam.width; x++) {
      const idx = (y * cam.width + x) * 4;

      const r = cam.pixels[idx + 0];
      const g = cam.pixels[idx + 1];
      const b = cam.pixels[idx + 2];

      const bright = (r + g + b) / 3;

      const bx = x % 4;
      const by = y % 4;
      const threshold = ((bayer4[by][bx] + 0.5) / 16) * 255;

    //   const v = bright > threshold ? 0 : 255;
      const useColor = bright > threshold;
      const c = useColor ? PURPLE : TEAL;
    
      tint(150);
      dG.pixels[idx + 0] = c.r;
      dG.pixels[idx + 1] = c.g;
      dG.pixels[idx + 2] = c.b;
      dG.pixels[idx + 3] = 255;
    }
  }
  dG.updatePixels();
}

function drawDither(x, y) {
  push();
  imageMode(CORNER);
  image(ditherG, x, y, width, height); // scale to canvas
  pop();
}

function windowResized() {
  calculateDimensions();
}
