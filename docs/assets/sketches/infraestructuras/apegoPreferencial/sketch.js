const { w, h, elt } = getGeneral();
// const m = {l: w * 0, r: w * 0, t: h * 0, b: h * 0, w, h}; 
const m = getStandardMargins();

const rings = 5;
let btnMsg = "Iniciar";

let simulate, render;
let data = {
  nodes: [{x: m.w / 2, y: m.h / 2, r: 5, prob: 1, links: []}],
  links: [],
  t: [0]
}

const resetObject = JSON.parse(JSON.stringify(data));

function setup() {
  noCanvas();
  const fns = makeNetwork(data);
  simulate = fns.simulate;
  render = fns.render;

  const btn = createButton(btnMsg)
    .parent("general")
    .position(10, 10)
    .mouseClicked(() => restart(btn));

  noLoop();
  const observer = new IntersectionObserver(event => {
    if (!event[0].isIntersecting) {
      restart(btn);
      btnMsg = "Iniciar";
      btn.html(btnMsg);
      noLoop();
    }
  }, { threshold: 0.3 });
  observer.observe(d3.select("#general").node());
}

function restart(btn) {
  btnMsg = "Reiniciar"
  btn.html(btnMsg);
  data = JSON.parse(JSON.stringify(resetObject))
  loop();
}

function draw() {

  if (data.t[0] % 40 === 0) {
    const selected = updateProbs(data);
    const source = data.nodes[selected];
    const newNode = {
      x: source.x + ((random() - 0.5) * 20),
      y: source.y + ((random() - 0.5) * 20),
      r: 5,
      prob: 0,
      links: [0]
    }
    data.nodes[selected].links.push(data.nodes.length);
    data.nodes.push(newNode);
    
    const target = data.nodes[data.nodes.length - 1];
    data.links.push({source, target});
    updateProbs(data);
  }

  if (data.t[0] % 4 === 0) {
    simulate(data);
  }
  
  render(data);
  data.t[0]++;

  if (data.nodes.length >= 50) noLoop();
}

function makeNetwork(data) {
  let svg = d3.select("#general").append("svg").attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", `0 0 ${w} ${h}`)
  let g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`);
  
  g.append("g")
    .append("rect")
    .attr("fill", colbg)
    .attr("x",0)
    .attr("y",0)
    .attr("width", m.w)
    .attr("height", m.h)

  let radial = g.append("g");
  let links = g.append("g");
  let nodes = g.append("g");

  let ringScale = d3.scaleLinear().domain([0, rings]).range([0, m.h / 2]);
  let colorScale = d3.scaleSequential(d3.interpolateRgb(colmain, col2)).domain([0, m.h/2])
  const ringRange = d3.range(rings);

  radial.selectAll("circle")
    .data(ringRange)
    .join("circle")
      .attr("fill", "none")
      .attr("stroke", col1)
      .attr("cx", m.w / 2)
      .attr("cy", m.h / 2)
      .attr("r", d => ringScale(d))

  render(data);

  function simulate(data) {
    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links).strength(0.5).distance(40))
      .force("charge", d3.forceManyBody().strength(-20).theta(0.1))
      .force("center", d3.forceCenter(m.w / 2, m.h / 2))
      .force("collide", d3.forceCollide().radius(d => d.r * 2))
      .stop()
    
    simulation.tick();
  }
  
  function render(data) {
    let rScale = d3.scaleLinear().domain(d3.extent(data.nodes, d => d.prob)).range([3, 7]);

    nodes.selectAll("circle")
      .data(data.nodes)
      .join('circle')
      .attr("class", "node")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .transition()
        .attr("r", d => rScale(d.prob))    
        .attr("fill", d => colorScale(Math.min(euclideanDistance(d, {x: m.w/2, y: m.h/2})), m.h/2))  

    links.selectAll("line")
      .data(data.links)
      .join('line')
      .attr("stroke", "black")
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
  }

  return {simulate, render}
}

function updateProbs(data) {
  if (data.links.length === 0) return 0
  const rnd = random();
  let best = 0;
  let mark = 0;
  let found = false;
  for (let i = 0; i < data.nodes.length; i++) {
    const node = data.nodes[i];
    node.prob = (node.links.length / data.links.length) / 2;
    mark += node.prob;
    if (rnd >= mark && !found) {
      best = i;
    } else if (rnd < mark) {
      found = true;
    }
  }
  return best
}