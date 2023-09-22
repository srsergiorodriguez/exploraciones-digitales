const { w, h, elt } = getGeneral();
const m = {l: w * 0, r: w * 0, t: h * 0, b: h * 0, w, h}; //getStandardMargins();

async function setup() {
  noCanvas();
  const nodeData = await d3.csv("./ReducidaGrado4GiantComponent/NodesNetworkHD.csv", d3.autoType);
  // const edgeDataCSV = await d3.csv("./ReducidaGrado4GiantComponent/EdgesNetworkHD.csv", d3.autoType);
  // getLinks(nodeData, edgeDataCSV);
  const edgeData = await d3.json("./ReducidaGrado4GiantComponent/edgesHD.json", d3.autoType);
  network(nodeData, edgeData);
}

function network(nodeData, edgeData) {
  const zoom = d3.zoom()
    .scaleExtent([1, 32])
    .on("zoom", zoomed);

  const x = d3.scaleLinear().domain(d3.extent(nodeData, d => d.X).map(d => d * 1.1)).range([0, m.w]);
  const y = d3.scaleLinear().domain(d3.extent(nodeData, d => d.Y).map(d => d * 1.1)).range([m.h, 0]);

  const svg = d3.select("#general").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", [0, 0, w, h])
    .style("cursor", "grab")

  const g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`);

  const line = (d) => d3.line()([[x(d.source.x), y(d.source.y)], [x(d.target.x), y(d.target.y)]]);

  const gLine = g.append("g")
    .attr("stroke-linecap", "round")

  gLine.selectAll("path")
    .data(edgeData)
    .join("path")
      .attr("d", d => line(d))
      .attr("stroke", d => d.color);

  const gDot = g.append("g")
      .attr("fill", "none")
      .attr("stroke-linecap", "round");

  gDot.selectAll("path")
    .data(nodeData)
    .join("path")
      .attr("d", d => `M${x(d.X)},${y(d.Y)}h0`)
      .attr("stroke", d => d.Color);

  gDot.selectAll("text")
    .data(nodeData)
    .join("text")
      .attr("x", d => x(d.X))
      .attr("y", d => y(d.Y))
      .style("fill", "black")
      .style("font-size", 0.4)
      .style("font-family", "var(--content-font)")
      .text(d => d.Label)
  
  svg.call(zoom).call(zoom.transform, d3.zoomIdentity);

  function zoomed({transform}) {    
    gDot.attr("transform", transform).attr("stroke-width", 5 / transform.k);
    gLine.attr("transform", transform).attr("stroke-width", 0.5 / transform.k);
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

function getLinks(nodeData, edgeData) {
  const links = edgeData.map(d => {
    const src = nodeData.find(n => n.Id === d.Source);
    const tgt = nodeData.find(n => n.Id === d.Target);
    return {source: {x: src.X, y: src.Y}, target: {x: tgt.X, y: tgt.Y}, color: src.Color}
  });

  saveJSON(links);
}