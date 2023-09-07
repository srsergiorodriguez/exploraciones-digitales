const { w, h, elt } = getGeneral();
const m = {l: w * 0, r: w * 0, t: h * 0, b: h * 0, w, h}; //getStandardMargins();

async function setup() {
  noCanvas();
  let geoData = await d3.json("../../maps/World100m.geo.json");
  let data = (await d3.json("https://raw.githubusercontent.com/scanninglabor/IAScanningLabor/main/code/map_json_files/scans_per_center_per_month.json"))
    .datasets[0].data.allData.map(d => ({name: d[0], lat: d[1], lon: d[2], count: d[3], date: d[4].substr(0, 10), certaintyIndex: d[5]}));

  let years = [...new Set(data.map(d => d.date))];

  const yearSlider = createSlider(0, years.length - 1 , 1, 1).class("slider").parent("#gui");

  let selectedYear = years[yearSlider.value()];
  let filteredData = data.filter(d => d.date === selectedYear);
  const r = d3.scaleLinear().domain(d3.extent(data, d => d.count)).range([1, m.h/8]);

  const update = makeMap(geoData, filteredData, r);

  const yearSpan = createSpan(selectedYear).parent("#gui");
  yearSlider.input(function() {
    selectedYear = years[yearSlider.value()];
    yearSpan.html(selectedYear);
    filteredData = data.filter(d => d.date === selectedYear);
    update(filteredData);
  })
}

function makeMap(geoData, data, r) {
  let projection = d3.geoNaturalEarth1()
      .translate([w/2, h/2])
      .fitSize([m.w, m.h], geoData)

  let geoPath = d3.geoPath().projection(projection)
  let svg = d3.select("#general").append("svg").attr("width", w).attr("height" ,h);
  let g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`);
  
  g.append("g")
    .append("rect")
    .attr("fill", colbg)
    .attr("x",0)
    .attr("y",0)
    .attr("width", m.w)
    .attr("height", m.h)

  g.append("g")
    .selectAll("path")
    .data(geoData.features)
    .join("path")
    .attr("d",d => geoPath(d))
    .attr("fill", col1)
    .attr("stroke",colbg)

  let circles = g.append("g");

  console.log(r.domain())

  const labels = g.append("g")
    .attr("transform", `translate(${m.w / 9},${m.h*0.6})`)
    .selectAll("g")
    .data([1000, Math.floor(d3.max(r.domain())/10000)*10000])
    .join("g")
    .attr("transform", (d,i) => `translate(${0},${i * r(d) * 1.7})`)

  labels.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", d => r(d))
    .attr("stroke", "black")
    .attr("fill", "none")
  
  labels.append("text")
    .text(d => d)
    .attr("x", 0)
    .attr("y", d => -r(d) - 5)
    .attr("alignment-baseline", "middle")
    .attr("text-anchor", "middle")
    .attr("font-size", "0.5em")
    .attr("fill", colblack)

  update(data);
  
  function update(data) {
    circles.selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx",d=>projection([d.lon,d.lat])[0])
      .attr("cy",d=>projection([d.lon,d.lat])[1])
      .attr("r", d => r(d.count))
      .attr("fill", colmain)
  }

  return update
}