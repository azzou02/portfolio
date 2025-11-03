let video;
let vidW = 64,
    vidH = 48,
    scl = 10;
let w, h;
let ascii = "who am i?";


function setup() {
  let canvas = createCanvas(vidW * scl, vidH * scl);
  canvas.parent('p5-container');

  video = createCapture(VIDEO);
  video.size(vidW, vidH);
  video.hide();
  
  calculateDimensions();
}

function calculateDimensions() {
  let scaleX = floor(windowWidth / vidW);
  let scaleY = floor(windowHeight / vidH);
  scl = min(scaleX, scaleY);

  scl = max(1, scl);

  let newW = vidW * scl;
  let newH = vidH * scl;
  resizeCanvas(newW, newH);

  // calculate cell width and height 
  w = width / video.width;
  h = height / video.height;
}

function draw() {
  background(0);
  fill(255, 150, 238);

  video.loadPixels();
  for (let i = 0; i < video.width; ++i) {
    for (let j = 0; j < video.height; ++j) {
      let pixIdx = (i + j * video.width) * 4;
      let r = video.pixels[pixIdx + 0];
      let g = video.pixels[pixIdx + 1];
      let b = video.pixels[pixIdx + 2];

      let c = (r + g + b) / 3;
      let tIdx = floor(map(c, 0, 120, 0, ascii.length));

      let x = i * w + w / 2;
      let y = j * h + h / 2;
      let t = ascii.charAt(tIdx);
      textSize(w);
      textAlign(CENTER, CENTER);
      text(t, x, y);
    }
  }
  
}

function windowResized() {
  calculateDimensions();
}

