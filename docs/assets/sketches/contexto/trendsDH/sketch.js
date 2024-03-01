const { w, h, elt } = getGeneral();
const m = {l: w * 0, r: w * 0, t: h * 0, b: h * 0, w, h}; //getStandardMargins();

// 28/9/18 - 28/9/23
async function setup() {
  noCanvas();
  let geoData = await d3.json("../../maps/World100m.geo.json");
  let data = (await d3.csv("trendsDH.csv", d3.autoType));

  const categories = data.columns.slice(1);
  const color = d3.scaleOrdinal().domain(["none", ...categories]).range(["lightgray", ...d3.schemeTableau10]);

  makeMap(geoData, data, color, categories);
}

function makeMap(geoData, data, color, categories) {
  let projection = d3.geoNaturalEarth1()
      .translate([w/2, h/2])
      .fitSize([m.w, m.h], geoData)

  let geoPath = d3.geoPath().projection(projection)
  let svg = d3.select("#general").append("svg").attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", `0 0 ${w} ${h}`)
  let g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`);
  
  g.append("g")
    .append("rect")
    .attr("fill", colbg)
    .attr("x",0)
    .attr("y",0)
    .attr("width", m.w)
    .attr("height", m.h)

  const map = g.append("g");

  const spacing = 20;
  g.append("g")
    .attr("transform", `translate(${m.l},${m.h - (categories.length * spacing)})`)
    .selectAll("text")
    .data(categories)
    .join("text")
      .attr("x", 0)
      .attr("y", (d,i) => i * spacing)
      .text(d => d)
      .attr("fill", d => color(d))

  const regions = map.selectAll("g")
    .data(geoData.features)
    .join("g")

  regions.append("path")
    .attr("d", d => geoPath(d))
    .attr("fill", d => color(bestCategory(d.properties.name_es, data)))
    .attr("stroke",colbg)
    .on("mouseover", function(e, d) {
      map.append("text")
        .text(`${d.properties.name_es} ${bestCategory(d.properties.name_es, data) === "none" ? "" : "👉 " + bestCategory(d.properties.name_es, data)}`)
        .attr("alignment-baseline", "middle")
        .attr("text-anchor", "middle")
        .attr("x",w/2)
        .attr("y",10)
    })
    .on("mouseout", function(e, d) {
      map.selectAll('text').remove();
    })
}

function bestCategory(name, data) {
  let best = "none";
  let maxVal = 0;
  const countryData = data.find(d => d.Pais === name);
  if (countryData === undefined) return best
  for (let [k, v] of Object.entries(countryData)) {
    if (k === "Pais") continue
    if (v > maxVal) {
      best = k;
      maxVal = v;
    }
  }  
  return best
}