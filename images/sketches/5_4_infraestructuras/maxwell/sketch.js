function setup() {
  const colbg = "white";
  const colmain = "#ed6a5a";
  const colblack = "#313030";
  const col1 = "#5ca4a9";
  const col2 = "#ffc0b5";
  const weight = 10;

  const parent = select("#general");
  const w = +parent.style("width").replace("px","");
  const h = +parent.style("height").replace("px","");
  const div = 5;
  createCanvas(w, h).parent(parent);
  background(100);

  fill(colbg);
  stroke(colblack);
  strokeWeight(weight);
  rect(weight/2, (h / div) - (weight/2), w - (weight/2), ((h / div) * (div-1)) - (weight/2));
}