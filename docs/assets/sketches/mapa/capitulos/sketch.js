const { w, h, elt } = getGeneral();
const m = getStandardMargins();

async function setup() {
  noCanvas();
  let data = await d3.csv("./capitulos.csv");
  let hierarchy = prepareH(data);
  const update = makeTree(hierarchy);
}

function prepareH(data) {  
  return d3.hierarchy(d3.group(data, d => d.nivel1, d => d.nivel2))
}

function makeTree(hierarchy) {
  let svg = d3.select("#general").append("svg").attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", `0 0 ${w} ${h}`);
  let g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`);

  const tree = d3.tree().size([m.h, m.w]);
  const root = tree(hierarchy);
  const L = root.descendants().map(d => d.data);

  const dimensions = ["Dimensiones", "Tradición humanística", "Modos de relacionamiento", "Formación de comunidad", "Infraestructura", "Reflexiones sobre el libro digital"];
  const color = d3.scaleOrdinal().range([colmain, "#0070C0", "#FFC000", "#00B050", "#FF0000", colmain]).domain(dimensions);

  const link = g.selectAll("path")
    .data(root.links().filter(d => {
      // console.log(d.target.children)
      return d.target.children !== undefined && d.target.data[0] !== "";
    }))
    .join("path")
      .attr("stroke", "#cccccc")
      .attr("fill", "none")
      .attr("d", d => d3.line()
        .curve(d3.curveBumpX)
        ([[d.source.y, d.source.x],[d.target.y, d.target.x]])
      )

  const node = g.selectAll("g")
      .data(root.descendants().filter(d => {
        return d.children !== undefined && d.data[0] !== "";
      }))
      .join("g")
      .attr("transform", d => `translate(${d.y},${d.x})`)

  node.append("circle")
      .attr("fill", d => dimensions.includes(d.data[0]) ? color(d.data[0]) : "lightgray")
      .attr("stroke",colbg)
      .attr("r", 8)

  node.append("text")
    .attr("x", 10)
    .attr("font-size", 13)
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("stroke", colblack)
    .text((d, i) => {
      return i === 0 ? "Capítulos" : d.children ? d.data[0] : "";
    });
}