const { w, h, elt } = getGeneral();
const m = getStandardMargins();

async function setup() {
  noCanvas();
  let data = await d3.csv("./codebook.csv");
  let hierarchy = prepareH(data, "Libro de códigos");
  const update = makeTree(hierarchy);
}

function prepareH(data, name) {  
  const ndata = [];
  for (let d of data) {
    const path = d.path.split("_");
    const nrow = {}
    nrow.dimension = path[0];
    nrow.tension = path[1];
    nrow.description = d.description;
    ndata.push(nrow);
  }

  return d3.hierarchy(d3.group(ndata, d => d.dimension, d => d.tension))
}

function makeTree(hierarchy) {
  let svg = d3.select("#general").append("svg").attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", `0 0 ${w} ${h}`);
  let g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`);

  const tree = d3.tree().size([m.h, m.w]);
  const root = tree(hierarchy);
  const L = root.descendants().map(d => d.data);

  const link = g.selectAll("path")
    .data(root.links().filter(d => d.target.depth < 3))
    .join("path")
      .attr("stroke", "#cccccc")
      .attr("fill", "none")
      .attr("d", d => d3.line()
        .curve(d3.curveBumpX)
        ([[d.source.y, d.source.x],[d.target.y, d.target.x]])
      )

  const node = g.selectAll("g")
      .data(root.descendants().filter(d => d.depth < 3))
      .join("g")
      .attr("transform", d => `translate(${d.y},${d.x})`)
      .style("cursor", d => d.children[0].depth === 3 ? "pointer" : "auto")
      .on("mouseover", function(e, d) {
        if (d.children[0].depth === 3) {
          const boxg = g.append("g").classed("info-text-sketch", true);
          const box = boxg.append("rect").attr("fill", colbg).attr("stroke", colblack);
          const wt = wrappedText(m.w, boxg, d.children[0].data.description, {
            x: 10,
            y: 15,
            class: "info-text-sketch",
            "font-size": 13,
            "text-anchor": "left",
          });
          box.attr("width", w * 0.6).attr("height", wt.h);
        }
      })
      .on("mouseout", function(e, d) {
        g.selectAll(".info-text-sketch").remove();
      })

  node.append("circle")
      .attr("fill", colmain)
      .attr("stroke",colbg)
      .attr("r", 5)

  node.append("text")
    .attr("x", 5)
    .attr("font-size", 13)
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle")
    .attr("stroke", colblack)
    .text((d, i) => {
      return i === 0 ? "Códigos" : d.children ? d.data[0] : "";
    });
}

function svgText(cont, text, options) {
  let defaults = {
    bold: false, x: 0, y: 0, fill: colblack,
    "font-family": "Archivo Narrow", "text-anchor": "left",
    "font-size": "1em", "alignment-baseline": "bottom",
    class: ""
  }
  Object.assign(defaults, options);
  const g = cont.append("g")
  const t = g.append("text").text(text)
    .style("font-weight", defaults.bold ? "bold" : "regular")
    .style("fill", defaults.fill)
    .classed(defaults.class, true)
    .attr("text-anchor", defaults["text-anchor"])
    .attr("font-size", defaults["font-size"])
    .attr("alignment-baseline", defaults["alignment-baseline"])
    .attr("x", defaults.x)
    .attr("y", defaults.y)

  return t
}

function wrappedText(maxWidth, cont, text, options) {
  const lines = [];
  const words = text.trim().split(' ');
  let currentLine = '';
  let currentLineWidth = 0;

  let testLineHeight;
  words.forEach(word => {
    const testLine = currentLine.length === 0 ? word : `${currentLine} ${word}`;
    const testLineElement = svgText(cont, testLine, options);
    const testLineWidth = testLineElement.node().getBBox().width;
    testLineHeight = testLineElement.node().getBBox().height;
    testLineElement.remove();

    if (currentLineWidth + testLineWidth > maxWidth) {
      lines.push(currentLine);
      currentLine = word;
      currentLineWidth = testLineWidth;
    } else {
      currentLine = testLine;
      currentLineWidth = testLineWidth;
    }
    
  });
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }
  
  const leading = options.leading === undefined ? 0.8 : options.leading;
  const sep = testLineHeight * leading;
  for (let i = 0; i < lines.length; i++) {
    svgText(cont, lines[i], {...options, y: options.y !== undefined ? options.y + (i * sep) : i * sep});
  }

  return {w: Math.floor(maxWidth), h: Math.floor(testLineHeight * lines.length)}
}