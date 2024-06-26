const { w, h, elt } = getGeneral();

const a = new Aventura("es");

async function setup() {
  noCanvas();

  const modelo = await a.modeloMarkov("./textos/unificado.txt", 3);

  a.fijarMarkov(modelo);

  const p = d3.select("#text");

  d3.selectAll(".generate-button").on("click", () => {
    const selectedSeed = getSeed(modelo);
    const textoFinal = getText(selectedSeed);
    p.text(textoFinal);
  })

  const selectedSeed = getSeed(modelo);
  const textoFinal = getText(selectedSeed);
  
  p.text(textoFinal);
}

function getSeed(modelo) {
  const seedRegex = ["civiliza", "bárbaro", "mestizo", "latino", "am[eé]rica"];
  const formattedRegex = new RegExp(random(seedRegex), "i");

  const possibleSeeds = [];

  const keys = Object.keys(modelo);
  for (let k of keys) {
    const t = formattedRegex.test(k) && !(/[,.:]/i.test(k));
    if (t) {
      possibleSeeds.push(k);
    }
  }

  const selectedSeed = random(possibleSeeds);

  return selectedSeed
}

function getText(selectedSeed) {
  const textoGenerado = a.cadenaMarkov(700, selectedSeed, 0.0);
  const textoFinal = "..."+textoGenerado+"...";
  return textoFinal
}