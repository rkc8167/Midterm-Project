// this is to list out the art market segment data and their properties 
const artMarketData = {
    ultra: {
        name: "Ultra high (>$10m)",
        volume: 140,        // % growth in lots sold
        value: 190,         // % growth in sales value
        color: [255, 107, 134], // change to pink 
        size: 150,
        active: true
    },
    high: {
        name: "High ($1m–$10m)",
        volume: 55,       // % growth in lots sold
        value: 65,       // % growth in sales value
        color: [74, 222, 128], // change to green 
        size: 100,
        active: true
    },
    mid: {
        name: "Mid ($250k–$1m)",
        volume: 25,     // % growth in lots sold
        value: 18,      // % growth in sales value        
        color: [167, 139, 250], // change to purple 
        size: 60,
        active: true
    },
    middle: {
        name: "Middle ($50k–$250k)",
        volume: 15,    // % growth in lots sold
        value: 8,      // % growth in sales value
        color: [251, 191, 36], // change to yellow 
        size: 50,
        active: true
    },
    low: {
        name: "Low end (<$50k)",
        volume: 105,  // % growth in lots sold
        value: 12,    // % growth in sales value
        color: [251, 146, 60], // change to orange 
        size: 45,
        active: true
    }
};

// this sets up and declares the global variables 

let canvas;
let hoveredSegment = null;

// this sets up the canvas for the scatterplot diagram 
function setup() {
    canvas = createCanvas(900, 500);
    canvas.parent('canvas-container');
    setupControls();
}

// this will run my frame in every loop 
function draw() {
    background(255);
    drawGrid();
    drawAxes();
    drawBubbles();
    drawLabels();
}

// this will draw a grid for my scatterplot diagram 
function drawGrid() {
    stroke(240);
    strokeWeight(1);

    // this is to draw vertical lines 
    for (let x = 80; x <= width - 80; x += (width - 160) / 8) {
        line(x, 60, x, height - 80);
    }
    // this is to draw horizontal lines 
    for (let y = 60; y <= height - 80; y += (height - 140) / 10) {
        line(80, y, width - 80, y);
    }
}

// this is to label my x and y axes 
function drawAxes() {
    stroke(200);
    strokeWeight(2);
    line(80, height - 80, width - 80, height - 80); // x-axis
    line(80, 60, 80, height - 80);                  // y-axis

    fill(100);
    noStroke();
    textAlign(CENTER);
    textSize(14);

    // x label
    text("Growth by Volume (% change in lots)", width / 2, height - 30);

    // y label 
    push();
    translate(25, height / 2);
    rotate(-HALF_PI);
    text("Growth by Value (% change in sales)", 0, 0);
    pop();

    drawAxisTicks();
}

// draws tick marks and numbers for both axes
function drawAxisTicks() {
    textAlign(CENTER);
    textSize(12);
    fill(120);

    // x-axis ticks
    for (let i = 0; i <= 160; i += 20) {
        let x = map(i, 0, 160, 80, width - 80);
        text(i, x, height - 60);
    }

    // y-axis ticks
    textAlign(RIGHT);
    for (let i = 0; i <= 200; i += 50) {
        let y = map(i, 0, 200, height - 80, 60);
        text(i, 70, y + 4);
    }
}

// this is to draw all visible bubbles
function drawBubbles() {
    for (let segment in artMarketData) {
        if (artMarketData[segment].active) {
            drawBubble(segment);
        }
    }
}

// this is to draw a single bubble, with gradient and hover effect
function drawBubble(segment) {
    const data = artMarketData[segment];
    let x = map(data.volume, 0, 160, 80, width - 80);
    let y = map(data.value, 0, 200, height - 80, 60);

    let distance = dist(mouseX, mouseY, x, y);
    let isHovered = distance < data.size / 2;

    let bubbleSize = isHovered ? data.size * 1.05 : data.size;
    drawSolidBubble(x, y, bubbleSize, data.color, isHovered);

    if (isHovered) {
        hoveredSegment = segment;
    }
}

// Adds a highlight for a 3D look
function drawSolidBubble(x, y, size, color, isHovered) {
    fill(color[0], color[1], color[2], isHovered ? 220 : 180);
    noStroke();
    ellipse(x, y, size);

    drawBubbleHighlights(x, y, size, isHovered);
}

// this adds highlights to the bubbles for a 3D effect
function drawBubbleHighlights(x, y, size, isHovered) {
    fill(255, 255, 255, isHovered ? 120 : 80);
    noStroke();
    ellipse(x - size * 0.15, y - size * 0.15, size * 0.2);

    fill(255, 255, 255, isHovered ? 60 : 30);
    ellipse(x - size * 0.1, y - size * 0.1, size * 0.4);
}

// this is to draw labels for each visible bubble
function drawLabels() {
    for (let segment in artMarketData) {
        if (artMarketData[segment].active) {
            drawLabel(segment);
        }
    }
}

// this is to draw a label for a bubble, adjusting position to avoid overlap
function drawLabel(segment) {
    const data = artMarketData[segment];
    let x = map(data.volume, 0, 160, 80, width - 80);
    let y = map(data.value, 0, 200, height - 80, 60);

    let labelX = x;
    let labelY = adjustLabelPosition(segment, x, y, data.size);

    fill(80);
    noStroke();
    textAlign(CENTER);
    textSize(13);
    text(data.name, labelX, labelY);
}

// this moves the label up or down depending on the bubble
function adjustLabelPosition(segment, x, y, size) {
    switch(segment) {
        case 'ultra':
        case 'high':
            return y - size / 2 - 15;
        case 'low':
            return y + size / 2 + 25;
        default:
            return y - size / 2 - 20;
    }
}

// this sets up the toggle functions 
function setupControls() {
    document.querySelectorAll('.segment-toggle').forEach(button => {
        button.addEventListener('click', function() {
            const segment = this.dataset.segment;
            artMarketData[segment].active = !artMarketData[segment].active;
            this.classList.toggle('active');
        });
    });
}

// this hides the button if you click on it 
function mousePressed() {
    for (let segment in artMarketData) {
        if (artMarketData[segment].active) {
            const data = artMarketData[segment];
            let x = map(data.volume, 0, 160, 80, width - 80);
            let y = map(data.value, 0, 200, height - 80, 60);
            let distance = dist(mouseX, mouseY, x, y);

            if (distance < data.size / 2) {
                artMarketData[segment].active = false;
                document.querySelector(`[data-segment="${segment}"]`)
                        .classList.remove('active');
                break;
            }
        }
    }
}

// this allows for a readjustable canvas size 
function windowResized() {
    if (windowWidth < 1000) {
        resizeCanvas(windowWidth - 100, 500);
    }
}

// this returns the segment key if the mouse is over a bubble
function getHoveredSegment() {
    for (let segment in artMarketData) {
        if (artMarketData[segment].active) {
            const data = artMarketData[segment];
            let x = map(data.volume, 0, 160, 80, width - 80);
            let y = map(data.value, 0, 200, height - 80, 60);
            let distance = dist(mouseX, mouseY, x, y);

            if (distance < data.size / 2) {
                return segment;
            }
        }
    }
    return null;
}
