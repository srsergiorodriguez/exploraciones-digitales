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