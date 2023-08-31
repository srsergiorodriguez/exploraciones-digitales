const {colbg, colmain, colblack, col1, col2} = getCols();
preconfig();

function preconfig() {
  //
}

function getCols() {
  const fn = n => getComputedStyle(document.documentElement).getPropertyValue(n).replace(" ", "");
  const vars = ["colbg", "colmain", "colblack", "col1", "col2"];
  const cols = {};
  for (let v of vars) {
    cols[v] = fn("--"+v);
  }
  return cols
}

function getGeneral() {
  const elt = d3.select("#general").node();
  const st = getComputedStyle(d3.select("#general").node());
  return {w: +st.width.replace("px",""), h: +st.height.replace("px",""), elt}
}

function getStandardMargins(ml = 0.03, mr = 0.03, mt = 0.05, mb = 0.05) {
  const m = {l: w * ml, r: w * mr, t: h * mt, b: h * mb};
  m.w =  w - m.l - m.r;
  m.h =  h - m.t - m.b;
  return m
}

const d3_category20 = [
  "#1f77b4", "#aec7e8",
  "#ff7f0e", "#ffbb78",
  "#2ca02c", "#98df8a",
  "#d62728", "#ff9896",
  "#9467bd", "#c5b0d5",
  "#8c564b", "#c49c94",
  "#e377c2", "#f7b6d2",
  "#7f7f7f", "#c7c7c7",
  "#bcbd22", "#dbdb8d",
  "#17becf", "#9edae5"
  ];

function scale20() {
  return d3.scaleOrdinal().range(d3_category20).domain([0, 20])
};

function wrap(data) {
  const hull = [];
  const sorted = data.sort((a, b) => a.x - b.x );
  const v = sorted.map(d => createVector(d.x, d.y));
  let baseVertex = 0;
  let nextVertex = 1;
  let testVertex = 2;
  hull.push(sorted[baseVertex]);
  while (baseVertex != nextVertex) {
    const a = p5.Vector.sub(v[nextVertex],v[baseVertex]);
    const b = p5.Vector.sub(v[testVertex],v[baseVertex]);
    nextVertex = a.cross(b).z < 0 ? testVertex : nextVertex;
    testVertex++;
    if (testVertex == v.length) {
      hull.push(sorted[nextVertex]);
      baseVertex = nextVertex;
      nextVertex = 0;
      testVertex = 0;
    }
  }
  return hull
}