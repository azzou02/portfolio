const asciiCamSketch = (containerId) => (p) => {
    let video;
    let vidW = 64, vidH = 48, scl = 10;
    let w, h;
    let ascii = "who am i?";

    p.setup = () => {
        let canvas = p.createCanvas(vidW * scl, vidH * scl);
        canvas.parent(containerId);
        p.pixelDensity(1);

        video = p.createCapture(p.VIDEO);
        video.size(vidW, vidH);
        video.hide();

        calculateDimensions();
    };

    function calculateDimensions() {
        let scaleX = p.floor(p.windowWidth / vidW);
        let scaleY = p.floor(p.windowHeight / vidH);
        scl = p.max(1, p.min(scaleX, scaleY));

        p.resizeCanvas(vidW * scl, vidH * scl);

        w = p.width / video.width;
        h = p.height / video.height;
    }

    p.draw = () => {
        p.background(0);
        p.fill(255, 150, 238);

        video.loadPixels();
        for (let i = 0; i < video.width; ++i) {
            for (let j = 0; j < video.height; ++j) {
                let pixIdx = (i + j * video.width) * 4;
                let r = video.pixels[pixIdx + 0];
                let g = video.pixels[pixIdx + 1];
                let b = video.pixels[pixIdx + 2];

                let c = (r + g + b) / 3;
                let tIdx = p.floor(p.map(c, 0, 120, 0, ascii.length));

                let x = i * w + w / 2;
                let y = j * h + h / 2;
                let t = ascii.charAt(tIdx);
                p.textSize(w);
                p.textAlign(p.CENTER, p.CENTER);
                p.text(t, x, y);
            }
        }
    };

    p.windowResized = () => {
        calculateDimensions();
    };
};

new p5(asciiCamSketch('p5-container'));
