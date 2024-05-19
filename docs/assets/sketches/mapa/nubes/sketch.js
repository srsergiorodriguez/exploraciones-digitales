const { w, h, elt } = getGeneral();

let t = 0;
let a = 0;
let s = 120;
let cb = 40;
let mov = 0.25;

let clouds = [];
const cloudNr = 12;

function setup() {
  const cnv = createCanvas(w, h, WEBGL).parent(elt);

  for (let i = 0; i < cloudNr; i++) {
    clouds[i] = {
      x: random(-w/2,w/2), y: random(-h/2, h/4), z: random(-h/2,h/2), b: [], o: 0, r: random(0.05),
      vx: random(-mov,mov), vy: random(-mov,mov), vz: random(-mov,mov)
    };
    for (let j = 0; j < Math.floor(random(3, 8)); j++) {
      clouds[i].b[j] = {x: random(-cb,cb), y: random(-cb,cb), z: random(-cb,cb), s: random(cb/2, cb) };
    }
    
  }

  const observer = new IntersectionObserver(event => {
    if (event[0].isIntersecting) {
      loop();
    } else {
      noLoop();
    }
  }, { threshold: 0.1 });
  observer.observe(cnv.elt);
}

function draw() {
  background(col1);

  rotateY(a);
  rotateZ(sin(a * 0.5) / 2);

  ambientLight(127, 127, 127);
  ambientLight(...hexToRgb(colmain).map(d => d/8));
  pointLight(...hexToRgb(colbg), s/4, -s, s*2);

  
  stroke("#0070C0");
  //"#0070C0", "#FFC000", "#00B050", "#FF0000"
  line(-s, 0, s, 0); // X
  stroke("#FFC000");
  line(0, -s, 0, s); // Y
  stroke("#00B050");
  // line(0, 0, -s, 0, 0, s); // Z
  line(s/2, -s/2, s/2, -s/2, s/2, -s/2);
  stroke("#FF0000");
  line(-s/2, -s/2, -s/2, s/2, s/2, s/2); // X2

  stroke(col2);
  noStroke();
  fill(colbg);
  // normalMaterial();
  // specularMaterial(255, 255, 255);

  for (let c of clouds) {
    push();
    translate(c.x, c.y, c.z);
    for (let cb of c.b) {
      push();
        translate(cb.x, cb.y, cb.z);
        sphere(cb.s, 6);
      pop();
    }

    c.o ++;
    c.x += sin(c.o * c.r) * c.vx;
    c.y += sin(c.o * c.r) * c.vy;
    c.z += sin(c.o * c.r) * c.vz;

    if (random() < 0.01) {
      c.vx = random(-mov, mov);
      c.vy = random(-mov, mov);
      c.vz = random(-mov, mov);
    } 
    pop();
  }

  a += 0.001;
  t++;
}

function hexToRgb(hex) {
  hex = hex.replace('#', '');

  var bigint = parseInt(hex, 16);

  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;

  return [r, g, b];
}