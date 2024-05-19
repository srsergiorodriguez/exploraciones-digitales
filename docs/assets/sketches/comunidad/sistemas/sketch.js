const { w, h, elt } = getGeneral();
const m = {l: w * 0, r: w * 0, t: h * 0, b: h * 0, w, h}; //getStandardMargins();

let nodes = [
  {id: "Universidad", type: "Formal"},
  {id: "Comunidades\nde\naprendizaje", type: "Formal"},
  {id: "Financiadores", type: "Formal"},
  {id: "Opinión\npública", type: "Formal"},
  {id: "Académicos", type: "Formal"},
  {id: "Intelectuales", type: "Formal"},
  {id: "Estudiantes", type: "Formal"},
  {id: "Bricolérs", type: "Formal"},
  {id: "Gestores", type: "Formal"},
  {id: "Voluntarios", type: "Formal"},
];

nodes = nodes.map(d => ({...d, x: m.w/2, y: m.h/2, state: 10}));

let links = [
  {source: "Universidad", target: "Estudiantes", v: 1},
  {source: "Académicos", target: "Universidad", v: 1},
  {source: "Intelectuales", target: "Universidad", v: 1},
  {source: "Bricolérs", target: "Universidad", v: 1},
  {source: "Gestores", target: "Comunidades\nde\naprendizaje", v: 1},
  {source: "Comunidades\nde\naprendizaje", target: "Gestores", v: 1},
  {source: "Voluntarios", target: "Comunidades\nde\naprendizaje", v: 1},
  {source: "Comunidades\nde\naprendizaje", target: "Académicos", v: 1},
  {source: "Comunidades\nde\naprendizaje", target: "Intelectuales", v: 1},
  {source: "Financiadores", target: "Comunidades\nde\naprendizaje", v: 1},
  {source: "Comunidades\nde\naprendizaje", target: "Bricolérs", v: 1},
  {source: "Estudiantes", target: "Voluntarios", v: 1},
  {source: "Universidad", target: "Comunidades\nde\naprendizaje", v: 1},
  {source: "Intelectuales", target: "Opinión\npública", v: 1},
  {source: "Opinión\npública", target: "Financiadores", v: 1},
  {source: "Universidad", target: "Intelectuales", v: 1},
]

links = links.map(d => ({...d, v: 1}));

let ticks = 0
let tickLimit = 300

const r = 35;
const full = 10;
const flowSpeed = 11;

let system;

const colorScale = d3.scaleSequential(["Tomato", "GreenYellow"]).domain([0, 10]);
const lineGen = (d) => d3.line()([[d.source.x, d.source.y], [d.target.x, d.target.y]]);

async function setup() {
  noCanvas();
  frameRate(18);

  const observer = new IntersectionObserver(event => {
    if (!event[0].isIntersecting) {
      noLoop();
    } else {
      loop();
    }
  }, { threshold: 0.3 });
  observer.observe(d3.select(".box").node());

  system = getSystem(nodes, links);
}

function draw() {
  system.update(true);
  if (ticks % flowSpeed === 0) {
    for (let l of links) {
      if (l.source.state > 0 && l.target.state > 0) {
        l.target.state += l.v;
      }
      l.source.state -= l.v;
    }
  }
  ticks++;
}

function getSystem(nodes, links) {
  const svg = d3.select("#general").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", [0, 0, w, h])

  const g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`);

  const gLine = g.append("g");
  const gNode = g.append("g");
  const gFlow = gNode.append("g");
  const gCircle = gNode.append("g");
  const gName = gNode.append("g");
  const gState = gNode.append("g");

  for (let i = 0; i < 200; i++) {
    updateSimulation();
    update();
  }

  function updateSimulation() {
    let simulation = d3.forceSimulation(nodes)
      // .force('repulsion', d3.forceManyBody().strength(!repel ? 0 : -70).distanceMax(2.5 * r))
      .force('atraction', d3.forceManyBody().strength(60).distanceMin(100 * r))
      .force('collide', d3.forceCollide(r * 1.8))
      .force('center', d3.forceCenter(m.w/2, m.h*0.5))
      .force('link', d3.forceLink(links).id((d) => d.id).distance(r * 4.2))
      .stop()
      .tick();
  }

  function update() {
    gLine.selectAll("path")
      .data(links)
      .join("path")
        .attr("d", d => lineGen(d))
        .attr("stroke", "black")
        .attr("visibility", d => d.target.state <= 0 || d.source.state <= 0 ? "hidden" : "visible")

    const circle = gCircle.selectAll("circle")
      .data(nodes)
      .join("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", r)
        .style("fill", d => colorScale(d.state))
        .style("stroke-width", 3)
        .style("cursor", d=>  d.state > 0 ? "pointer" : "default")
      
      circle.transition(200)
          .attr("opacity", d => d.state <= 0 ? 0 : 1)

      circle.on("click", function(e, d) {
        d.state = 0
      })

    gName.selectAll("text")
      .data(nodes)
      .join("text")
        .attr("x", d => d.x)
        .attr("text-anchor", "middle")
        .attr("y", d => d.y)
        .style("font-size", 10)
        .style("fill", "var(--colblack)")
        .style("font-family", "var(--content-font)")
        .attr("visibility", d => d.state <= 0 ? "hidden" : "visible")
        .call(multilineText, {
          lineHeight: 1,
          dominantBaseline: "middle"
        });


    gState.selectAll("text")
      .data(nodes)
      .join("text")
        .attr("x", d => d.x)
        .attr("text-anchor", "middle")
        .attr("y", d => d.y + r*0.7)
        .style("font-size", 9)
        .style("font-family", "var(--content-font)")
        .text(d => d.state)
        .attr("visibility", d => d.state <= 0 ? "hidden" : "visible")

    gFlow.selectAll("circle")
      .data(links)
      .join("circle")
        .attr("cx", d => lerp(d.source.x, d.target.x, (ticks % flowSpeed) / flowSpeed))
        .attr("cy", d => lerp(d.source.y, d.target.y, (ticks % flowSpeed) / flowSpeed))
        .attr("r", r/8)
        .style("fill", "var(--col1)")
        .style("stroke", "none")
        .style("stroke-width", 3)
        .attr("visibility", d => d.target.state <= 0 || d.source.state <= 0 ? "hidden" : "visible")
  }
  
  return Object.assign(svg.node(), {update});
}

function multilineText(el,{fontSize = 10, lineHeight = 1.45, dominantBaseline = "auto"}) {
  el.each(function({id}) {
    const text = id;
    const lines = text.split("\n");
    const textContentHeight = (lines.length - 1) * lineHeight * fontSize;

    const el = d3.select(this);
    const anchor = {
      x: +el.attr("x"),
      y: +el.attr("y")
    };

    const dy =
      dominantBaseline === "middle"
        ? -textContentHeight / 2
        : dominantBaseline === "hanging"
        ? -textContentHeight
        : 0;

    el.attr("font-size", fontSize)
      .attr("dominant-baseline", dominantBaseline)
      .selectAll("tspan")
      .data(lines)
      .join("tspan")
      .text((d) => d)
      .attr("x", anchor.x)
      .attr("y", (d, i) => anchor.y + i * lineHeight * fontSize + dy);
  });
}