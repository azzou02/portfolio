// Instance-mode wrapper
const walkingPeopleSketch = (containerId) => (p) => {
    let persons = [];
    let personsFront = [];
    let personsBack = [];

    let defaultPersonImage;
    let defaultBackPersonImage;
    let defaultFrontPersonImage;

    let personY, personFrontY, personBackY;
    let posX = 15;
    
    let spacing = 200;
    let frontSpacing = 365;
    let backSpacing = 145;

    let animationFrames = [];
    let animIndex = 0;
    let animDelay = 10;
    let animCounter = 0;
    let pauseFrames = 265;
    let isPaused = false;

    p.preload = () => {
        animationFrames = [
            p.loadImage("/assets/mass-sketch/mass3.png"),
            p.loadImage("/assets/mass-sketch/mass4.png"),
            p.loadImage("/assets/mass-sketch/mass5.png"),
            p.loadImage("/assets/mass-sketch/mass6.png"),
            p.loadImage("/assets/mass-sketch/mass7.png"),
            p.loadImage("/assets/mass-sketch/mass7.png"),
            p.loadImage("/assets/mass-sketch/mass6.png"),
            p.loadImage("/assets/mass-sketch/mass5.png"),
            p.loadImage("/assets/mass-sketch/mass4.png"),
            p.loadImage("/assets/mass-sketch/mass3.png"),
        ];

        defaultPersonImage = p.loadImage("/assets/mass-sketch/person.png");
        defaultBackPersonImage = p.loadImage("/assets/mass-sketch/person.png");
        defaultFrontPersonImage = p.loadImage("/assets/mass-sketch/person-reverse.png");
    };

    p.setup = () => {
        // 1. Select the container
        const container = document.getElementById(containerId);
        
        // 2. Create canvas using current dimensions (or fallback)
        const w = container.clientWidth;
        const h = container.clientHeight || 400;
        
        const canvas = p.createCanvas(w, h);
        canvas.parent(containerId);

        p.imageMode(p.CENTER);

        // Resize images 
        defaultPersonImage.resize(210, 0);
        defaultBackPersonImage.resize(150, 0);
        defaultFrontPersonImage.resize(360, 0);

        for (let i = 0; i < 14; ++i) personsBack[i] = defaultBackPersonImage;
        for (let i = 0; i < 10; ++i) persons[i] = defaultPersonImage;
        for (let img of animationFrames) img.resize(210, 0);
        for (let i = 0; i < 6; ++i) personsFront[i] = defaultFrontPersonImage;

        recalcHeights();

        // 3. NEW: ResizeObserver watches for container size changes
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                // Only resize if dimensions actually changed
                if (width !== p.width || height !== p.height) {
                    p.resizeCanvas(width, height);
                    recalcHeights();
                }
            }
        });
        
        resizeObserver.observe(container);
    };

    function recalcHeights() {
        personY = p.height / 1.75;
        personBackY = p.height / 3;
        personFrontY = p.height / 0.9;
    }

    p.draw = () => {
        p.background(0); // Ensure background clears every frame

        const LOOP_DISTANCE = persons.length * spacing;
        if (posX > LOOP_DISTANCE) posX -= LOOP_DISTANCE;

        // Animation logic
        if (!isPaused) {
            animCounter++;
            if (animCounter >= animDelay) {
                animCounter = 0;
                animIndex++;
                if (animIndex >= animationFrames.length) {
                    animIndex = animationFrames.length - 1;
                    isPaused = true;
                    setTimeout(() => {
                        animIndex = 0;
                        isPaused = false;
                    }, pauseFrames * (1000 / 60));
                }
            }
        }

        // Back layer
        for (let i = 0; i < personsBack.length; ++i) {
            p.push();
            p.translate(p.width, 0);
            p.scale(-1, 1);
            p.tint(164, 113, 191, 250);
            p.image(personsBack[i], posX + i * backSpacing, personBackY);
            p.image(personsBack[i], posX + i * backSpacing - LOOP_DISTANCE, personBackY);
            p.pop();
        }

        // Middle layer
        for (let i = 0; i < persons.length; ++i) {
            let img = i === 3 ? animationFrames[animIndex] : persons[i];
            p.image(img, posX + i * spacing, personY);
            p.image(img, posX + i * spacing - LOOP_DISTANCE, personY);
        }

        // Front layer
        for (let i = 0; i < personsFront.length; ++i) {
            p.push();
            p.translate(p.width, 0);
            p.scale(-1, 1);
            p.blendMode(p.BLEND);
            p.noTint();
            p.image(personsFront[i], posX + i * frontSpacing, personFrontY);
            p.image(personsFront[i], posX + i * frontSpacing - LOOP_DISTANCE, personFrontY);
            p.blendMode(p.ADD);
            p.tint(255, 180);
            p.image(personsFront[i], posX + i * frontSpacing, personFrontY);
            p.image(personsFront[i], posX + i * frontSpacing - LOOP_DISTANCE, personFrontY);
            p.blendMode(p.BLEND);
            p.pop();
        }

        posX += 0.5;
    };
    
    // Note: p.windowResized is removed because ResizeObserver handles it better
};

new p5(walkingPeopleSketch('p5-container-full'));