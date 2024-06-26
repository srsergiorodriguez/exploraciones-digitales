const { w, h, elt } = getGeneral();
const m = {l: w * 0, r: w * 0, t: h * 0, b: h * 0, w, h}; //getStandardMargins();
let tourstep = -1;

const tour = [
  {text: "Una lectura cercana de esta red de menciones puede ayudarnos a formar una idea de los múltiples participantes involucrados en la comunidad de humanidades digitales además de sus alcances, relaciones y diversos tipos: personas, asociaciones, instituciones educativas y culturales, publicaciones, etc. Aquí veremos solo algunos ejemplos.", title: "Humanidades", k: 20, highlights: []},
  {text: "Los colores de la red corresponden vagamente a agrupaciones nacionales. Por ejemplo, este sector de color cyan contiene múltiples perfiles colombianos, como la Red Colombiana de Humanidades Digitales (ReHDi_Co), las profesoras Maria José Afanador y Stefania Gallini, la facultad de Artes y Humanidades de la Universidad de los Andes (ArtesUniandes), o el laboratorio de Cartografía Histórica e Historia digital de la Universidad Nacional (LabCaHID).", title: "Humanos", k: 20, highlights: []},
  {text: "Sin embargo, la red no muestra solo relaciones locales. Por ejemplo, un poco más a la izquierda, en este sector se evidencian que la red Colombiana (ReHDi_Co) es también cercana a la red Mexicana (Red_HD) y a proyectos transnacionales, como Programming Historian (ProgHist).", title: "Marco Tulio Cicerón", k: 25, highlights: []},
  {text: "Este fenómeno glocal se repite en múltiples partes de la red. Por ejemplo, aquí encontramos un sector de individuos e instituciones españolas y europeas, cercanas a la sociedad de Humanidades Digitales Hispánicas (HDHispanicas).", title: "Dinamarca", k: 30, highlights: []},
  {text: "Pero también vemos que las instituciones españolas y de otras partes de europa guardan comunicación cercana con personas e instituciones en Argentina, como la Asociación Argentina de Humanidades Digitales (aahdArg), o las profesoras Gimena del Rio y Virginia Brussa. Vemos que ellas, de hecho, son un puente en la red que conecta a varias subcomunidades.", title: "Historia", k: 22, highlights: []},
  {text: "Las publicaciones también juegan papeles mediadores, pues conectan a comunidades diferentes a través de sus ediciones. Un ejemplo es la Revista Telos, que editó un número especial sobre humanidades digitales en 2019.", title: "Humanista", k: 20, highlights: []},
  {text: "O la revista de humanidades digitales, que publica artículos de autores de toda la comunidad, en español, inglés y portugués, y que en la red es cercana a proyectos como Humboldt Digital (humboldtdigital) o los premios informales de humanidades diigtales DH Awards (dhawards)", title: "Simbolismo", k: 20, highlights: []},
  {text: "Algunos eventos también tienen papeles importantes, como el congreso de la ADHO realizado en México en 2018 (dh2018cdmx), que en esta red tiene conexión con instituciones educativas mexicanas y con otras intituciones internacionales, como Wikimedia; aquí vemos una conexión cercana con una persona que trabaja para la esta organización, Silvia Gutiérrez (espejolento)", title: "Dionisio de Tracia", k: 15, highlights: []},
  {text: "Así, este es un entramado vivo de relacionamiento social. Las humanidades digitales, como campo, se deben al trabajo entre personas e instituciones que conforman una comunidad.", title: "Poder (social y político)", k: 20, highlights: []},
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
      .attr("x", d => x(d.x))
      .attr("y", d => y(d.y))
      .style("fill", "black")
      .style("font-size", 0.6)
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

      if (step.highlights !== undefined) {
        gDot.selectAll("text")
          .style("font-size", d => step.highlights.includes(d.Label) ? 18 / step.k : 0.4)
          .style("fill", d => step.highlights.includes(d.Label) ? "black" : "black")
          .style("stroke", d => step.highlights.includes(d.Label) ? "white" : "none")
          .style("stroke-width", d => step.highlights.includes(d.Label) ? 5 / step.k : 0.4)
          .each(function(d) {
            if (step.highlights.includes(d.Label)) {
              d3.select(this).raise()
            }
          })
      } else {
        gDot.selectAll("text")
          .style("fill", "black")
          .style("font-size", 0.4)
          .style("stroke", "none")
      }
    },
    setDescription(text) {
      description.text(text);
    }
  });
}