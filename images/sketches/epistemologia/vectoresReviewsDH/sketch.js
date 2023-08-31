const { w, h, elt } = getGeneral();
const m = {l: w * 0, r: w * 0, t: h * 0, b: h * 0, w, h}; //getStandardMargins();

async function setup() {
  noCanvas();
  const data = await d3.csv("./all_vectors_reviews in dh_size320_window3_sg0_mincount3_k20_c2.csv", d3.autoType);
  wordVectorMap(data);

  /*
    ethnic -> proyectos identitarios comunidades latinas, negras, queer, ind'ingenas, religiosas, inmigrantes
    technique -> reflexiones sobre las prácticas
    readable -> publicaciones digitales
    digitized -> archivos y acceso
    temas -> unexplored
    conceptos -> hypertext
  */

  createButton("Iniciar Recorrido").parent("#gui");
  createButton("Siguiente").parent("#gui");
  createButton("Anterior").parent("#gui");

  const description = d3.select("#description").text("daasdadssad");
}

function wordVectorMap(data) {
  const zoom = d3.zoom()
    .scaleExtent([1, 32])
    .on("zoom", zoomed);

  const x = d3.scaleLinear().domain(d3.extent(data, d => d.x).map(d => d * 1.1)).range([0, m.w]);
  const y = d3.scaleLinear().domain(d3.extent(data, d => d.y).map(d => d * 1.1)).range([m.h, 0]);
  const z = scale20();

  const xAxis = (g, x) => g
    .attr("transform", `translate(0,${m.h})`)
    .call(d3.axisTop(x).ticks(12))
    .call(g => g.select(".domain").attr("display", "none"));

  const yAxis = (g, y) => g
    .call(d3.axisRight(y).ticks(12))
    .call(g => g.select(".domain").attr("display", "none"))

  const svg = d3.select("#general").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", [0, 0, w, h])
    .style("cursor", "grab")

  const g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`);

  const clusters = d3.rollups(data, v => v.length, d => d.cluster);

  const wraps = [];
  for (let [cluster, count] of clusters) {
    const points = data.filter(d => d.cluster === cluster);
    if (points.length <= 3) continue
    wraps.push(wrap(points));
  }

  /// Wraps

  const lineGenerator = d3.line()
    .x((d) => x(d.x))
    .y((d) => y(d.y))
    .curve(d3.curveNatural)

  const gWrap = g.append("g");
  gWrap.selectAll("path")
    .data(wraps)
    .join("path")
      .attr("d", d => lineGenerator(d))
      .attr("stroke", "none")
      .attr("fill", d => z(d[0].cluster))
      .style("fill-opacity", .1)

  // Dots

  const gDot = g.append("g")
      .attr("fill", "none")
      .attr("stroke-linecap", "round");

  gDot.selectAll("path")
    .data(data)
    .join("path")
      .attr("d", d => `M${x(d.x)},${y(d.y)}h0`)
      .attr("stroke", d => z(d.cluster));

  gDot.selectAll("text")
    .data(data)
    .join("text")
      .attr("x", d => x(d.x))
      .attr("y", d => y(d.y))
      .style("fill", "black")
      .style("font-size", 1)
      .text(d => d.word)

  const gx = g.append("g");
  const gy = g.append("g");

  svg.call(zoom).call(zoom.transform, d3.zoomIdentity);

  function zoomed({transform}) {
    const zx = transform.rescaleX(x).interpolate(d3.interpolateRound);
    const zy = transform.rescaleY(y).interpolate(d3.interpolateRound);
    
    gDot.attr("transform", transform).attr("stroke-width", 5 / transform.k);
    gWrap.attr("transform", transform).attr("stroke-width", 5 / transform.k);
    
    gx.call(xAxis, zx);
    gy.call(yAxis, zy);
  }

  return Object.assign(svg.node(), {
    zoomTo(coord,k) {
      if (coord === undefined) return;
      const { x: xv, y:yv} = coord;

      const xpos = (width/2) + x(k * x.domain()[0]) - x(k * xv);
      const ypos = (height/2) + y(k * y.domain()[1]) - y(k * yv);
      const transform = d3.zoomIdentity.translate(xpos, ypos).scale(k); 
      
      svg.transition()
          .duration(1000)
          .call(zoom.transform, transform);
      return d3.zoomTransform(svg.node())
    }
  });
}