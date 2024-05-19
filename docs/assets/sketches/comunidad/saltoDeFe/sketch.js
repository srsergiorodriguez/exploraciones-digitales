const { w, h, elt } = getGeneral();

const emoji = "🚗";
let fn;
let streak = 0;

const divsx = 20;
const divsy = 10;
const ux = w/divsx;
const uy = h/divsy;

let cnv;

let pathColor;
let bgColor;

let clouds = [];

let decisionPoint = ux * 15;

const scenes = {
  intro: [
    intro, () => {
      createButton("Empezar")
        .parent("general")
        .position((w/2) - 25, (h/2) + 30)
        .mouseClicked(() => {
          changeScene(scenes.position)
        });
    }
  ],
  lose: [
    lose, () => {
      createButton("Volver a empezar")
        .parent("general")
        .position((w/2) - 50, (h/2) + 30)
        .mouseClicked(() => {
          streak = 0;
          changeScene(scenes.position)
        });
    }
  ],
  position: [
    position, () => {
      let v = {t: 0};
      return v
    },
  ],
  selection: [
    selection, () => {
      createButton("Tomar camino de arriba").parent("general")
        .position(14 * ux, 3 * uy)
        .mouseClicked(() => {
          changeScene(scenes.leap, "up")
        }
      );
      createButton("Tomar camino de abajo").parent("general")
        .position(14 * ux, 8 * uy)
        .mouseClicked(() => {
          changeScene(scenes.leap, "down")
        }
      );
    }
  ],
  leap: [
    leap, () => {
      let v = {tx: 0, ty: 0, s: 30, wrongSide: random(["up","down"])};
      return v
    }
  ]
}

async function setup() {
  cnv = createCanvas(w, h).parent(elt);
  cnv.style("border", "solid 1px");
  textFont('Barkerville');

  pathColor = color(col1);
  bgColor = color(colbg);

  for (let i = 0; i < 100; i++) {
    clouds.push({x: random(w/2), y: random(h), r: random(ux*2, ux*4)});
  }

  changeScene(scenes.position);

  const observer = new IntersectionObserver(event => {
    if (!event[0].isIntersecting) {
      noLoop();
    } else {
      loop();
    }
  }, { threshold: 0.3 });
  observer.observe(d3.select(".box").node());
}

function changeScene([scene, callback], info) {
  removeElements();
  const value = callback();
  fn = () => {scene(value, info)};
}

function intro() {
  textSize(30);

  fill(colmain);
  textAlign(CENTER);
  text("El juego del salto de fe", w/2, h/2);
}

function lose() {
  textSize(30);

  fill(colmain);
  textAlign(CENTER);
  text(`Racha de suerte: ${streak}`, w/2, h/2);
}

function position(v) {
  makePath();
  textSize(30);
  const posx =  ux * 20 - v.t;
  textAlign(CENTER);
  text(emoji, posx, ux * 6);
  v.t++;
  if (posx <= decisionPoint) {
    changeScene(scenes.selection);
  }
  makeClouds();
}

function selection() {
  makePath();
  textAlign(CENTER);
  textSize(30);
  text(emoji, decisionPoint, ux * 6);
  makeClouds();
}

function leap(v, info) {
  makePath(v.wrongSide);
  // makePath();
  const posx = decisionPoint - v.tx;
  let direction = info === "up" ? -1 : 1;
  let posy;
  
  if (posx < decisionPoint - ux*0.1 && posx > decisionPoint - ux*3.2) {
    v.ty++;
    posy = (ux*6) + (v.ty * direction);
  } else if (posx < decisionPoint - ux*8.9 && posx > decisionPoint - ux*12) {
    v.ty--;
    posy = posy = (ux*6) + (v.ty * direction);
    // if (false) {
    if (info === v.wrongSide) {
      v.tx--;
      v.s -= 5;
      lost = true;
      v.s = v.s <= 0 ? 0 : v.s;
      
      if (v.s <= 0) {
        changeScene(scenes.lose);
      }
    }
  } else {
    posy = posy = (ux*6) + (v.ty * direction);
  }

  if (posx < 0) {
    streak++;
    changeScene(scenes.position);
  }
  
  v.tx++;
  textSize(v.s);
  textAlign(CENTER);
  text(emoji, posx, posy);
  
  makeClouds(v.tx);
}

function draw() {
  background(bgColor);
  fn();
  // grid();
}

function showScore(offset = 0) {
  fill(colblack);
  textSize(25);
  textAlign(LEFT);
  text(`Racha de suerte: ${streak}`, (ux * 3) - offset, uy*5.7);
}

function makeClouds(offset = 0) {
  fill(col2);
  noStroke();
  rect(0 - offset,0,w/2 - ux, h);
  for (let c of clouds) {
    fill(colmain);
    ellipse(c.x - offset, c.y + 5, c.r);
    fill(col2);
    ellipse(c.x - offset, c.y, c.r);
  }

  showScore(offset);
}

function makePath(wrongSide = "none") {
  const pathPoints = [[0, 5],[3, 5],[6, 2],[12, 2],[15, 5],[20, 5],[20, 6],[15, 6],[12, 9],[6, 9],[3, 6],[0, 6]];
  const innerPathPoints = [[4.2, 5],[6.2, 3],[11.8,3],[13.8,5],[13.8,6],[11.8,8],[6.2,8],[4.2,6]];
  fill(pathColor);
  noStroke();
  beginShape();
  for (let p of pathPoints) {
    vertex(p[0] * ux, p[1] * uy);
  }
  endShape(CLOSE);

  fill(bgColor);
  beginShape();
  for (let p of innerPathPoints) {
    vertex(p[0] * ux, p[1] * uy);
  }
  endShape(CLOSE);

  if (wrongSide == "up") {
    fill(bgColor);
    rect(3*ux,2*uy,ux*4,uy*3);
    fill(colblack);
    rect(5*ux,2*uy,ux*2,uy);
  } else if (wrongSide == "down") {
    fill(bgColor);
    rect(3*ux,6*uy,ux*4,uy*3);
    fill(colblack);
    rect(5*ux,8*uy,ux*2,uy);
  }
}

function grid() {
  textSize(14);
  stroke("red");
  fill("red");
  for (let x = 0; x < divsx; x++) {
    const xpos = (w/divsx) * x;
    line(xpos, 0, xpos, h);
    text(x, xpos + 10, 20);
  }

  for (let y = 0; y < divsy; y++) {
    const ypos = (h/divsy) * y;
    line(0, ypos, w, ypos);
    text(y, 10, ypos + 10);
  }
}