const { w, h, elt } = getGeneral();
const m = getStandardMargins();

const metaphors = [
  {
    target: "Semántica",
    source: "Espacio físico",
    targetConcepts: ["Significado", "Léxico"],
    sourceConcepts: ["Coordenadas", "Cercanía", "Agrupamiento"],
    projections: [true, true, true]
  },
  {
    target: "Campo de conocimiento",
    source: "Archipiélago",
    targetConcepts: ["Conceptos", "Epistemologías", "Prácticas"],
    sourceConcepts: ["Territorio", "Conjunto", "Islas separadas", "Océano"],
    projections: [true, true, true, false]
  },
  {
    target: "Infraestructura",
    source: "Demonio de maxwell",
    targetConcepts: ["Estándar", "Trabajo", "Soporte"],
    sourceConcepts: ["Invisible", "Fuerza ordenadora", "Termodinámica", "Moléculas"],
    projections: [true, true, false, false]
  },
  {
    target: "Fenómeno social",
    source: "Envoltorio sonoro",
    targetConcepts: ["Asociaciones", "Controversias", "Formación de grupos"],
    sourceConcepts: ["Ataque", "Decaimiento", "Sostenimiento", "Desvanecimiento", "Sonido"],
    projections: [true, true, true, true, false]
  }
]

let currentMetaphor = 0;

let selector;

function setup() {
  noCanvas();
  noLoop();
  const update = makeMetaphor();

  selector = createSelect().parent("#general");
  for (let i = 0; i < metaphors.length; i++) {
    selector.option(`${metaphors[i].target} <--> ${metaphors[i].source.toLowerCase()}`, i);
  }

  selector.changed(d => {
    currentMetaphor = +d.target.value;
    update(metaphors[currentMetaphor]);
  })

  selector.position(10, 10);

  update(metaphors[currentMetaphor]);
}

function restart(btn) {
  btnMsg = "Reiniciar"
  btn.html(btnMsg);
  data = JSON.parse(JSON.stringify(resetObject))
  loop();
}

function makeMetaphor() {
  let svg = d3.select("#general").append("svg").attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", `0 0 ${w} ${h}`)
  let g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`);

  const divs = 5;
  const xfr = m.w / divs;

  const domainY = m.h * 0.6;
  const titleY = domainY - xfr - 40;

  const targetX = xfr;
  const targetDomainG = g.append("circle")
    .attr("cx", targetX)
    .attr("cy", domainY)
    .attr("r", xfr)
    .attr("stroke", colblack)
    .attr("fill", "none")
    .attr("stroke-width", 2)

  const targetTitle = g.append("text")
    .text("Dominio Meta")
    .attr("x", targetX)
    .attr("y", titleY)
    .attr("text-anchor", "middle")
    .attr("fill", col1)

  const sourceX = xfr * (divs-1);
  const sourceDomainG = g.append("circle")
    .attr("cx", sourceX)
    .attr("cy", domainY)
    .attr("r", xfr)
    .attr("stroke", colblack)
    .attr("fill", "none")
    .attr("stroke-width", 2)

  const sourceTitle = g.append("text")
    .text("Dominio Fuente")
    .attr("x", sourceX)
    .attr("y", titleY)
    .attr("text-anchor", "middle")
    .attr("fill", col1)

  const relationTitle = g.append("text")
    .text("👉 es como 👉")
    .attr("x", m.w / 2)
    .attr("y", titleY + 20)
    .attr("font-size", 20)
    .attr("text-anchor", "middle")
  
  function update(data) {
    g.selectAll(".tempg").remove();
    const tempg = g.append("g").classed("tempg", true);

    const dfr = (xfr / (data.projections.length + 1));
    const dh = dfr * data.projections.length;
    const scale = d3.scaleLinear().domain([-dh/2, dh/2]).range([0, dh/1.5]);

    for (let i = 0; i < data.projections.length; i++) {
      const sy =  (-dh/2) + dfr * i;

      if (data.projections[i]) {
        const ny = domainY + 50 + scale(sy);
        tempg.append("path")
          .attr("stroke", colmain)
          .attr("stroke-width", 3)
          .attr("d", d3.line()([[sourceX - xfr/2 - 10, domainY + sy], [targetX + xfr/2 + 20,  ny]]))

        tempg.append("path")
          .attr("transform", `translate(${targetX + xfr/2 + 20},${ny})`)
          .attr("stroke", colmain)
          .attr("fill", colmain)
          .attr("d", d3.line()([[-10, 0],[0, -5],[0, 5]]))

        tempg.append("text")
          .text(data.sourceConcepts[i])
          .attr("x", targetX)
          .attr("y", ny)
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .attr("fill", col2)
      }

      tempg.append("text")
        .text(data.sourceConcepts[i])
        .attr("x", sourceX)
        .attr("y", domainY + sy)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")

      tempg.append("text")
        .text(data.targetConcepts[i])
        .attr("x", targetX)
        .attr("y", domainY + sy)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
    }

    const targetTitle = tempg.append("text")
      .text(data.target)
      .attr("x", targetX)
      .attr("y", titleY + 25)
      .attr("text-anchor", "middle")

    const sourceTitle = tempg.append("text")
      .text(data.source)
      .attr("x", sourceX)
      .attr("y", titleY + 25)
      .attr("text-anchor", "middle")
  }

  return update
}