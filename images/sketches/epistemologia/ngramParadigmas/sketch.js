const { w, h, elt } = getGeneral();
const m = { l: w * 0.1, r: w * 0.15, t: h * 0.1, b: h * 0.15 }
m.w = w - m.l - m.r;
m.h = h - m.t - m.b;

async function setup() {
  noCanvas();
  const data = await d3.csv("./Ngram_estructuralista,posmoderno,decolonial_es-2019_1950-2019.csv", d3.autoType);
  makeTrendsChart(data);
}

function makeTrendsChart(data) {
  let svg = d3.select("#general").append("svg").attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", `0 0 ${w} ${h}`)
  let g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`);
  
  g.append("g")
    .append("rect")
    .attr("fill", colbg)
    .attr("x",0)
    .attr("y",0)
    .attr("width", m.w)
    .attr("height", m.h)

  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, m.w])
    .nice()

  const filteredColumns = data.columns.filter(d => d !== "year");

  const allmax = filteredColumns.reduce((a,c) => {
    const tempMax = d3.max(data, d => d[c]);
    if (tempMax >= a) return tempMax
    return a
  }, 0);

  const y = d3.scaleLinear()
    .domain([0, allmax])
    .range([m.h, 0])
    .nice()

  const color = d3.scaleOrdinal().domain(filteredColumns).range(d3.schemeCategory10);

  let lineGenerator = (data, key) => d3.line().x(d => x(d.year)).y(d => y(d[key]))(data);

  g.append("g").selectAll("path")
    .data(filteredColumns)
    .join("path")
      .attr("d", d => lineGenerator(data, d))
      .attr("stroke", d => color(d))
      .attr("fill", "none")
      .attr("stroke-width", 3)

  // Axis
  g.append("g").attr("transform", `translate(0,${m.h})`).call(d3.axisBottom(x).tickFormat(d => d));
  g.append("g").attr("transform", `translate(${0},${0})`).call(d3.axisLeft(y).tickFormat(d3.format(".1e")));
  
  g.append("g").selectAll('text')
    .data(filteredColumns)
    .join('text')
    .attr('x', m.w)
    .attr('y', d => y(data[data.length - 1][d]))
    .style('fill', d => color(d))
    .style("font-size", 12)
    .text(d => d);

  svg.append("text").attr("x", w / 2).attr("y", h - (m.b*0.3)).text("Año").attr("font-size", 12)
  svg.append("g")
    .attr("transform",`translate(${m.l*0.4},${h/2})`)
    .append("text")  
    .attr("transform", `rotate(${-90})`)
    .attr("x", 0)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .text("Porcentaje aparición en el corpus")
    .attr("font-size", 12)
}