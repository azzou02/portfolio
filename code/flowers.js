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

let cellCount = 5;
let flowers = [];
let sound;
let sound2;
let sound3;

function setup() {
    let canvas = createCanvas(500, 500);
    canvas.parent('p5-container');
    rectMode(CENTER);

    sound = loadSound('/assets/sounds/flower-pressed.mp3');
    sound3 = loadSound('assets/sounds/new-screen.mp3');

    createGrid();
}

function draw() {
    background(232, 210, 255);

    for (let flower of flowers) {
        flower.show();
        flower.update();
    }

}

function createGrid() {
    flowers = [];

    let margin = 20;
    let cellSize = (width - margin * 2) / cellCount;

    for (let row = 0; row < cellCount; row++) {
        for (let col = 0; col < cellCount; col++) {
            let x = margin + col * cellSize + cellSize / 2;
            let y = margin + row * cellSize + cellSize / 2;

            let newFlower = new Flower(x, y, cellSize * 0.4);
            flowers.push(newFlower);
        }
    }
}

class Flower {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.petalRotation = 0;

        this.defaultColor = color(217, 141, 240);
        this.hoverColor = color(random(colorPalette));
        this.currentPetalColor = this.defaultColor;
    }

    update() {
        this.petalRotation += 0.02;

        let distance = dist(mouseX, mouseY, this.x, this.y);
        let targetColor;
        if (distance < 2 * this.size) {
            targetColor = this.hoverColor;
        } else {
            targetColor = this.defaultColor;
        }

        this.currentPetalColor = lerpColor(this.defaultColor, targetColor, 1);

    }

    show() {
        push();

        // move the origin to the flower's position
        translate(this.x, this.y);

        // stem 
        fill(32, 199, 85);
        rect(0, this.size * 0.5, this.size * 0.1, this.size);

        // petals
        push();
        rotate(this.petalRotation);
        fill(this.currentPetalColor);
        for (let i = 0; i < 8; i++) {
            circle(this.size * 0.35, this.size * 0.35, this.size * 0.7);
            rotate(PI / 3);
        }
        pop();

        // face
        rotate(4 * (PI / 6));
        fill(245, 197, 66);
        circle(0, 0, this.size * 0.95);

        // eyes
        rotate(PI / 3);
        fill(255);
        circle(-this.size * 0.2, 0, this.size * 0.35);
        circle(this.size * 0.2, 0, this.size * 0.35);
        fill(0);
        circle(-this.size * 0.2, 0, this.size * 0.12);
        circle(this.size * 0.2, 0, this.size * 0.12);

        pop();
    }

    clicked() {
        this.defaultColor = this.hoverColor;
    }

    reset() {
        this.defaultColor = color(217, 141, 240);
    }

}

function mousePressed() {
    for (let flower of flowers) {
        let distance = dist(mouseX, mouseY, flower.x, flower.y);

        if (distance < flower.size) {
            flower.clicked();
            sound.play();
        }
    }
}

function keyPressed() {
    if (keyCode === BACKSPACE) {
        for (let flower of flowers) {
            flower.reset();
        }
    }
    if (keyCode === RETURN) {
        cellCount = int(random(1, 8));
        createGrid();
        sound3.play();
    }
}