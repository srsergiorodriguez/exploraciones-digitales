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

function euclideanDistance(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt((dx * dx) + (dy * dy))
}

async function makePanel(data) {
  const imgMemo = {};
  for (let d of data) {
    if (d.img === undefined) continue
    if (imgMemo[d.img] === undefined) {
      const img = new Image();
      img.src = d.img;
      imgMemo[d.img] = await new Promise(resolve => {
        img.addEventListener('load',() => {resolve(img)}, false)
      });
    }
  }

  const container = d3.select("#general").append("div").classed("panel", true);
  const left = container.append("div").classed("panel-left", true).classed("panel-section", true);
  const right = container.append("div").classed("panel-right", true).classed("panel-section", true);

  const datasheet = right.append("div").classed("panel-datasheet", true);
  datasheet.text("👈 Selecciona un elemento de la lista")

  const list = left.selectAll("div")
    .data(data)
    .join("div")
      .classed("panel-list-element", true)
      .text(d => d.nombre)

  list.on("click", (e, d) => {
    d3.selectAll(".highlight").classed("highlight", false);
    d3.select(e.target).classed("highlight", true);
    d3.selectAll(".panel-datasheet").remove();
    right.node().scrollTo(0,0); 
    const datasheet = right.append("div").classed("panel-datasheet", true);
    
    if (d.img !== undefined) {
      const imgContainer = datasheet.append("div").classed("panel-img-container", true);
      imgContainer.node().appendChild(imgMemo[d.img]);
    }
    if (d.url !== undefined) {
      datasheet.append("a").text("visitar").attr("target", "_blank").attr("href", d.url);
    }
    datasheet.append("p").text(d.texto);

    if (d.ref !== undefined) {
      datasheet.append("p").text(d.ref);
    }
  })
  .on("mouseover", (e) => {
    d3.select(e.target).classed("active", true);
  })
  .on("mouseout", (e) => {
    d3.select(e.target).classed("active", false);
  })
}

function makeWordVectorMap(data) {
  const baseVectorMapDescription = "Use los botones para moverse en el recorrido o explora libremente. Cliquee y arrastre para mover el mapa, use la rueda o el gesto con dos dedos para alejarlo o acercarlo.";

  const map = wordVectorMap(data);

  const observer = new IntersectionObserver(event => {
    if (!event[0].isIntersecting) {
      reset();
    }
  }, { threshold: 0.01 });
  observer.observe(d3.select(".box").node());

  let next, prev;
  createButton("Reiniciar").parent("#gui").mouseClicked(() => {
    reset();
  });

  function reset() {
    tourstep = -1;
    map.setDescription(baseVectorMapDescription);
    map.zoomTo({x: 0, y: 0}, 1);
    next.removeAttribute("disabled");
    prev.attribute("disabled", true);
  }

  prev = createButton("Anterior").parent("#gui").mouseClicked(() => {
    tourstep -= tourstep > 0 ? 1 : 0;
    map.goToStep(tour[tourstep]);
    if (tourstep <= tour.length - 1) next.removeAttribute("disabled");
    if (tourstep <= 0) prev.attribute("disabled", true);
  });

  next = createButton("Siguiente").parent("#gui").mouseClicked(() => {
    tourstep += tourstep < tour.length - 1 ? 1 : 0;
    map.goToStep(tour[tourstep]);
    if (tourstep > 0) prev.removeAttribute("disabled");
    if (tourstep >= tour.length - 1) next.attribute("disabled", true);
  });
  prev.attribute("disabled", true);

  ///

  function wordVectorMap(data) {
    const description = d3.select("#description").text(baseVectorMapDescription);
  
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
        .style("font-size", 0.4)
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
  
    function zoomTo(coord, k) {
      if (coord === undefined) return;
      const { x: xv, y:yv } = coord;
      const xpos = (m.w/2) + x(k * x.domain()[0]) - x(k * xv);
      const ypos = (m.h/2) + y(k * y.domain()[1]) - y(k * yv);
  
      const transform = d3.zoomIdentity.translate(xpos, ypos).scale(k); 
      
      svg.transition()
          .ease(d3.easeQuadOut)
          .duration(1500)
          .call(zoom.transform, transform);
      return d3.zoomTransform(svg.node())
    }
  
    return Object.assign(svg.node(), {
      zoomTo,
      goToStep(step) {
        description.text(step.text)
        const coord = data.find(d => d.word === step.word);
        zoomTo(coord, step.k);
      },
      setDescription(text) {
        description.text(text);
      }
    });
  }
}