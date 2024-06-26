const { w, h, elt } = getGeneral();
const m = {l: w * 0, r: w * 0, t: h * 0, b: h * 0, w, h}; //getStandardMargins();
let tourstep = -1;

const tour = [
  {text: "Esta es una red de artículos de Wikipedia (nodos amarillos) conectados directamente con la entrada sobre Humanidades (nodo azul), y los artículos conectados con ellos, sucesivamente (nodos verdes). La red de Wikipedia permite ver algunos de los temas que guardan relación con las humanidades en esta biblioteca de internet, de acuerdo con sus contribuidores.", title: "Humanidades", k: 18, highlights: []},
  {text: "En una parte de la red se ve la relación con los problemas de lo 'Humano' del humanismo, en términos de faro moral y autodomesticación, pero también en términos de especie biológica. Mueva, acerque y aleje la red para ver algunos de los artículos secundarios alrededor de esos temas.", title: "Humanos", k: 12, highlights: []},
  {text: "En esta sección se ven los grupos de estudio humanista renacentista, el trivium y el quadrivium. Hay además diversidad de artículos secundarios, entre ellos, relaciones con campos de estudio contemporáneos como la semiótica y el psicoanálisis, pero también referencias a la antigüedad clásica.", title: "Marco Tulio Cicerón", k: 20, highlights: []},
  {text: "Aquí se ve un sector de la red guarda relación con la educación, y en consonancia con lo dicho en este capítulo, con su estrecha relación con el poder y la autoridad.", title: "Poder (social y político)", k: 16, highlights: []},
  {text: "Aquí hay referencias a la interpretación de los textos y la hermenéutica, así como a campos y corrientes relacionadas como la ecdótica, los estudios de la comunicación el estructuralismo o el posestructuralismo.", title: "Dinamarca", k: 20, highlights: []},
  {text: "En este lugar está el artículo de la disciplina de la Historia, conectada a periodos históricos y al nodo de las artes liberales.", title: "Historia", k: 17, highlights: []},
  {text: "Por otra parte está la conexión con entradas de la crítica y la teoría del arte, que a su vez tienen relación con distintos géneros artísticos y literarios, autores, y géneros, tanto clásicos como modernos, y con la palabra humanista, en el sentido de practicante de las humanidades que se dedica a estudiar todos estos temas.", title: "Humanista", k: 16, highlights: []},
  {text: "De forma similar, el nodo de los Clásicos, tiene relación con obras de la tradición grecolatina, pero también con el arte y la cultura contemporánea.", title: "Simbolismo", k: 15, highlights: []},
  {text: "Esta sección tiene nodos relacionados con la disciplina de la filología y con el concepto o rol del intelectual", title: "Dionisio de Tracia", k: 10, highlights: []},
  {text: "Puede seguir explorando la red y encontrar más conexiones en el entramado hipertextual de Wikipedia", title: "Humanidades", k: 18, highlights: []},
];

async function setup() {
  noCanvas();
  const minSize = 1.8;
  const nodeData = (await d3.csv("./wikinodes.csv", d3.autoType)).filter(d => d.size > minSize);
  const edgeData = (await d3.csv("./wikiedges.csv", d3.autoType)).filter(d => d.size > minSize);

  console.log(nodeData);

  const baseDescription = "Use los botones para moverse en el recorrido o explora libremente. Cliquee y arrastre para mover el mapa, use la rueda o el gesto con dos dedos para alejarlo o acercarlo.";
  const network = getNetwork(nodeData, edgeData);
  
  
  network.setDescription(baseDescription);
  // network.zoomTo({x: 0.5, y: 0.5}, 1);

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
    network.setDescription(baseDescription);
    network.zoomTo({x: 0.5, y: 0.5}, 1);
    next.removeAttribute("disabled");
    prev.attribute("disabled", true);
  }

  prev = createButton("Anterior").parent("#gui").mouseClicked(() => {
    tourstep -= tourstep > 0 ? 1 : 0;
    network.goToStep(tour[tourstep]);
    if (tourstep <= tour.length - 1) next.removeAttribute("disabled");
    if (tourstep <= 0) prev.attribute("disabled", true);
  });

  next = createButton("Siguiente").parent("#gui").mouseClicked(() => {
    tourstep += tourstep < tour.length - 1 ? 1 : 0;
    network.goToStep(tour[tourstep]);
    if (tourstep > 0) prev.removeAttribute("disabled");
    if (tourstep >= tour.length - 1) next.attribute("disabled", true);
  });
  prev.attribute("disabled", true);
}

function getNetwork(nodeData, edgeData) {
  const description = d3.select("#description").text("");

  const zoom = d3.zoom()
    .scaleExtent([1, 45])
    .on("zoom", zoomed);

  const x = d3.scaleLinear().domain(d3.extent(nodeData, d => d.x).map(d => d * 1.1)).range([0, m.w]);
  const y = d3.scaleLinear().domain(d3.extent(nodeData, d => d.y).map(d => d * 1.1)).range([m.h, 0]);
  const s = d3.scaleLinear().domain(d3.extent(nodeData, d => d.size)).range([1, 2]);
  const col = d3.scaleOrdinal().range(["#0070C0", "#FFC000", "#00B050", "#FF0000", "#7030A0"]).domain([0, 1, 2, 3]);

  const svg = d3.select("#general").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", [0, 0, w, h])
    .style("cursor", "grab")

  const g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`);

  const line = (d) => d3.line()([[x(d.source_x), y(d.source_y)], [x(d.target_x), y(d.target_y)]]);

  const gLine = g.append("g")
    .attr("stroke-linecap", "round")

  gLine.selectAll("path")
    .data(edgeData)
    .join("path")
      .attr("d", d => line(d))
      .attr("stroke", "#ccc");

  const gDot = g.append("g")
      .attr("fill", "none")
      .attr("stroke-linecap", "round")
      .style("stroke-width", 3)

  gDot.selectAll("path")
    .data(nodeData)
    .join("path")
      .attr("d", d => `M${x(d.x)},${y(d.y)}h0`)
      .attr("stroke", d => col(d.level));

  gDot.selectAll("text")
    .data(nodeData)
    .join("text")
      .attr("transform", d => `translate(${x(d.x)},${y(d.y)}) rotate(-18)`)
      .style("fill", "black")
      .style("font-size", 0.8)
      .style("font-family", "var(--content-font)")
      .text(d => d.label)
      .style("paint-order", "stroke")
      .style("text-anchor", "middle")
  
  svg.call(zoom).call(zoom.transform, d3.zoomIdentity);

  function zoomed({transform}) {    
    gDot.attr("transform", transform).attr("stroke-width", 5 / transform.k);
    gLine.attr("transform", transform).attr("stroke-width", 0.5 / transform.k);
  }

  function zoomTo(coord, k, highlights) {
    d3.selectAll(".highlights-network").remove();

    if (coord === undefined) return;
    const { x: xv, y: yv } = coord;
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
      description.text(step.text);
      const node = nodeData.find(d => d.label === step.title);
      console.log(node);
      const coord = {x: node.x, y: node.y}
      
      zoomTo(coord, step.k);
    },
    setDescription(text) {
      description.text(text);
    }
  });
}