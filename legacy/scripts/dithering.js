const ditherCamSketch = (containerId) => (p) => {
    let cam;
    let vidW = 288, vidH = 216, scl = 10;
    let ditherG;

    // 8×8 Bayer matrix — 64 tonal levels vs 16 from 4×4
    const bayer8 = [
        [ 0, 32,  8, 40,  2, 34, 10, 42],
        [48, 16, 56, 24, 50, 18, 58, 26],
        [12, 44,  4, 36, 14, 46,  6, 38],
        [60, 28, 52, 20, 62, 30, 54, 22],
        [ 3, 35, 11, 43,  1, 33,  9, 41],
        [51, 19, 59, 27, 49, 17, 57, 25],
        [15, 47,  7, 39, 13, 45,  5, 37],
        [63, 31, 55, 23, 61, 29, 53, 21],
    ];

    const PURPLE = { r: 0, g: 0, b: 0 };
    const TEAL   = { r: 255, g: 105, b: 180 };

    p.setup = () => {
        let canvas = p.createCanvas(vidW * scl, vidH * scl);
        canvas.parent(containerId);
        p.pixelDensity(1);

        cam = p.createCapture(p.VIDEO);
        cam.size(vidW, vidH);
        cam.hide();

        ditherG = p.createGraphics(vidW, vidH);
        ditherG.pixelDensity(1);

        calculateDimensions();
    };

    p.draw = () => {
        p.background(0);
        if (cam && ditherG) {
            doDither(cam, ditherG);
            drawDither(0, 0);
        }
    };

    function calculateDimensions() {
        const el = document.getElementById(containerId);
        const w = el ? el.offsetWidth  : p.windowWidth;
        const h = el ? el.offsetHeight : p.windowHeight;
        let scaleX = p.floor(w / vidW);
        let scaleY = p.floor(h / vidH);
        scl = p.max(1, p.min(scaleX, scaleY));
        p.resizeCanvas(vidW * scl, vidH * scl);
    }

    function doDither(source, dG) {
        source.loadPixels();
        if (!source.pixels.length) return;

        // First pass: find brightness range for contrast stretch
        let minB = 255, maxB = 0;
        for (let i = 0; i < source.pixels.length; i += 4) {
            const b = luma(source.pixels[i], source.pixels[i + 1], source.pixels[i + 2]);
            if (b < minB) minB = b;
            if (b > maxB) maxB = b;
        }
        const range = maxB - minB || 1;

        dG.loadPixels();

        for (let y = 0; y < source.height; y++) {
            for (let x = 0; x < source.width; x++) {
                const idx = (y * source.width + x) * 4;

                const raw = luma(source.pixels[idx], source.pixels[idx + 1], source.pixels[idx + 2]);
                // contrast stretch + slight gamma lift to open up shadows
                const bright = Math.pow((raw - minB) / range, 0.8) * 255;

                const threshold = ((bayer8[y % 8][x % 8] + 0.5) / 64) * 255;
                const c = bright > threshold ? TEAL : PURPLE;

                dG.pixels[idx]     = c.r;
                dG.pixels[idx + 1] = c.g;
                dG.pixels[idx + 2] = c.b;
                dG.pixels[idx + 3] = 255;
            }
        }
        dG.updatePixels();
    }

    // Perceptual luminance — matches how the eye weighs R/G/B
    function luma(r, g, b) {
        return 0.299 * r + 0.587 * g + 0.114 * b;
    }

    function drawDither(x, y) {
        p.push();
        p.imageMode(p.CORNER);
        p.image(ditherG, x, y, p.width, p.height);
        p.pop();
    }

    p.windowResized = () => {
        calculateDimensions();
    };
};

new p5(ditherCamSketch('p5-container'));
