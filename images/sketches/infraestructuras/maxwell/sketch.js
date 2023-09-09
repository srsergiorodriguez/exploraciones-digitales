const { w, h, elt } = getGeneral();
const particles = [];
let div;
let closed = true;
let t = 0;
const particlesNr = 50;
let debug = '';

const demon = "😈";
const demonMove = 20;
const demonSize = 40;

const sensor = 7;

function setup() {
  div = h/4;
  const cnv = createCanvas(w, h).parent(elt);
  textAlign(CENTER, CENTER);
  textSize(demonSize);

  for (let i = 0; i < particlesNr; i++) {
    particles[i] = new Particle(random(50, w-50), random(div + 10, h - 10), i);
  }
  drawBox();
  createButton("Remezclar")
    .parent("general")
    .position(10, 10)
    .mouseClicked(reset);

  const observer = new IntersectionObserver(event => {
    if (event[0].isIntersecting) {
      loop();
    } else {
      noLoop();
    }
  }, { threshold: 0.4 });
  observer.observe(cnv.elt);
}

function draw() {
  background(255);
  let voteCount = 0;
  for (let p of particles) {
    p.getVote();
    voteCount += p.vote ? 1 : 0;
  }

  closed = voteCount < 1 ? true : false;
  debug = voteCount

  for (let p of particles) {
    p.update();
    p.draw();
  }

  drawBox();
  // if (t % 100 === 0) reset();
  t++;
}

function reset() {
  for (let p of particles) {
    p.pos.x = random(50, w-50)
    p.pos.y = random(div + 10, h - 10)
  }
}

function drawBox() {
  fill(colbg);
  stroke(colblack);
  strokeWeight(1);
  line(0, div, w, div);
  line(w/2, div, w/2, div * 2);
  line(w/2, div * 3, w/2, h);

  if (closed) {
    strokeWeight(6);
    stroke(colmain);
    line(w/2, div * 2, w/2, div * 3);
    strokeWeight(1);
  }

  
  const offset = closed ? demonMove : -demonMove;

  fill(colmain);
  noStroke();
  const slSize = demonSize + 10;
  ellipse(w/2 - demonMove, div/2, slSize);
  ellipse(w/2 + demonMove, div/2, slSize);
  rect(w/2 - demonMove, div/2 - slSize/2, demonMove * 2, slSize)
  text(demon, w/2 - offset, div/2 + 5);

  // text(debug, 100, 30);
}

class Particle {
  constructor(x, y, i) {
    this.pos = createVector(x, y);
    
    this.d = 10;
    this.type = i % 2 === 0 ? 0 : 1;
    this.col =  this.type === 0 ? col1 : col2;
    const negx = random() > 0.5 ? 1 : -1;
    const negy = random() > 0.5 ? 1 : -1;
    const vx = (this.type === 0 ? random(2, 3) : random(4, 5.1)) * negx;
    const vy = (this.type === 0 ? random(2, 3) : random(4, 5)) * negy;
    this.vel = createVector(vx, vy);
    this.invX = createVector(-1, 1);
    this.invY = createVector(1, -1);
    this.vote = false;
  }

  getVote() {
    const walled = this.pos.y < div * 2 || this.pos.y > div * 3;
    if (
      !walled // in vertical range
      && ((this.type === 0 && this.pos.x > w/2 && this.pos.x < w/2 + sensor)
      || (this.type === 1 && this.pos.x < w/2 && this.pos.x > w/2 - sensor )) // in correct side
      ) {
      this.vote = true;
    } else {
      this.vote = false;
    }
  }

  update() {
    let limLeft = 0;
    let limRight = w;

    const side = this.pos.x < w/2 ? "left" : "right";

    const nextPos = p5.Vector.add(this.pos, this.vel);
    const walled = nextPos < div * 2 || nextPos > div * 3;    
    
    if (side === "left" && (closed || walled)) {
      limRight = w/2;
    } else if (side === "right" && (closed || walled)) {
      limLeft = w/2;
    }

    if (nextPos.x < limLeft || nextPos.x > limRight) {
      this.vel.mult(this.invX);
    } else if (nextPos.y < div + this.d/2 || nextPos.y > h) {
      this.vel.mult(this.invY);
    }

    if (nextPos.x > limRight) {nextPos.x = limRight - this.d/2}
    else if (nextPos.x < limLeft) {nextPos.x = limLeft + this.d/2}
    
    if (nextPos.y > h) {nextPos.y = h - this.d/2}
    else if (nextPos.y < div) {nextPos.y = div + this.d/2}
    
    this.pos = nextPos;
  }

  draw() {
    stroke(colblack);
    fill(this.col);
    ellipse(this.pos.x, this.pos.y, this.d, this.d);
  }
}