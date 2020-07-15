import * as p5 from "p5";

let degree = 0;
let radius = 0;
let img: p5.Image;

const addDegreeAlpha = 5;
const spiralDensity = 8;
const pointDistance = 0.1;
const dotBaseSize = 4;

const targetImage = "/assets/lena.jpg";
const maxPixels = 100000;
const canvasWidth = 512;
const canvasHeight = 512;

const pixelValue = (image: p5.Image, x: number, y: number): number => {
  const idx = (y * image.width + x) * 4;
  const r = image.pixels[idx];
  const g = image.pixels[idx + 1];
  const b = image.pixels[idx + 2];
  return 1 - (r + g + b) / 3 / 255;
};

const queue = {
  state: [0.5, 0.5, 0.5, 0.5, 0.5],
  push(num: number) {
    this.state.push(num);
    this.state.shift();
  },
  ave() {
    return this.state.reduce((p, c) => p + c) / this.state.length;
  },
};

const sketch = (p: p5) => {
  p.preload = () => {
    img = p.loadImage(targetImage);
  };

  p.setup = () => {
    p.resizeCanvas(canvasWidth, canvasHeight);
    p.noStroke();
    p.background(255);
    p.fill(0);

    img.loadPixels();

    for (let i = 0; i < maxPixels; i++) {
      // x, y
      const x = canvasWidth / 2 + p.cos(p.radians(degree)) * radius;
      const y = canvasHeight / 2 + p.sin(p.radians(degree)) * radius;

      // ref value from image
      const pixelDensity = pixelValue(img, Math.floor(x), Math.floor(y));

      queue.push(pixelDensity);
      const pointSize = Math.max(queue.ave() * dotBaseSize, 1);

      // draw
      p.ellipse(x, y, pointSize, pointSize);

      // change deg, radius
      const addDeg =
        addDegreeAlpha * p.degrees(p.asin(pointDistance / radius) || 0.01);
      degree += addDeg;
      radius += spiralDensity * (addDeg / 360);
    }
  };

  // p.windowResized = () => {
  //   // p.resizeCanvas(p.windowWidth, p.windowHeight);
  // };

  // p.draw = () => {};

  p.keyTyped = () => {
    if (p.key === "s") {
      p.saveCanvas("spiral", "png");
    }
  };
};

const sketchP = new p5(sketch);
