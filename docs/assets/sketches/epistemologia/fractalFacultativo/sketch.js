let zoom = 40;
let maxIterations = 100; // Adjusted maximum iterations
let targetCenterX = -1;
let targetCenterY = -1;
let centerX = targetCenterX;
let centerY = targetCenterY;
let resolution = 4; // Pixel art resolution

function setup() {
  const cnv = createCanvas(500, 200).parent("#general");
  pixelDensity(1);

  const observer = new IntersectionObserver(event => {
    if (event[0].isIntersecting) {
      loop();
    } else {
      zoom = 100;
      noLoop();
    }
  }, { threshold: 0.01 });
  observer.observe(cnv.elt);
}

function draw() {
  background(0);

  loadPixels();

  let w = 4 / zoom;
  let h = (w * height) / width;
  let xmin = centerX - w / 2;
  let ymin = centerY - h / 2;

  // Generate the Burning Ship fractal with pixel art resolution
  for (let x = 0; x < width; x += resolution) {
    for (let y = 0; y < height; y += resolution) {
      let real = xmin + (x / width) * w;
      let imag = ymin + (y / height) * h;
      let value = burningShip(real, imag, maxIterations);
      let bright = map(log(value + 1), 0, log(maxIterations), 0, 1) * 255;

      // Draw a pixel at lower resolution
      for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
          let px = x + i;
          let py = y + j;
          let pix = (px + py * width) * 4;
          if (value === 0) {
            pixels[pix + 0] = 0;
            pixels[pix + 1] = 0;
            pixels[pix + 2] = 0;
            pixels[pix + 3] = 255;
          } else {
            pixels[pix + 0] = 120;
            pixels[pix + 1] = bright;
            pixels[pix + 2] = bright;
            pixels[pix + 3] = 255;
          }
        }
      }
    }
  }

  updatePixels();

  // Display current zoom level
  // fill(255);
  // noStroke();
  // textSize(16);
  // text(`Zoom: ${zoom.toFixed(2)}`, 20, 30);

  // Calculate deviation and gradually adjust the center based on the zoom level
  let deviationX = targetCenterX - centerX;
  let deviationY = targetCenterY - centerY;
  centerX += deviationX * 0.01 / zoom; // Adjusted for a smoother compensation
  centerY += deviationY * 0.01 / zoom;

  // Zoom in for the next frame
  zoom *= 1.01;
  
  if (zoom >= 8000) {
    zoom = 1000;
  }
}

function burningShip(real, imag, maxIterations) {
  let x = real;
  let y = imag;

  for (let n = 0; n < maxIterations; n++) {
    let x2 = x * x;
    let y2 = y * y;

    if (x2 + y2 > 16) {
      return n;
    }

    // Iterative process for the Burning Ship fractal
    y = 2 * Math.abs(x * y) + imag;
    x = x2 - y2 + real;
  }

  return maxIterations;
}