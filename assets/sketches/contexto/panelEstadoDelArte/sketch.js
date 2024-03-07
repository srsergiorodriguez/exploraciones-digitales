const { w, h, elt } = getGeneral();

const escenas = {
  inicio: {
    viz: {
      filter: [],
      type: "pack",
      x: "categoria",
      y: "ortodoxia"
    }
  }
}

async function setup() {
  noCanvas();

  const a = new Aventura("es", {
    contenedorAventura: "general",
    velocidadMaquina: 0,
    deslizarAImagen: false,
    CSSporDefecto: false,
    anchoVis: 2000,
    altoVis: 2000,
    tamanoImagenVis: 100
  });

  const data = await d3.csv("./data.csv");

  await a.fijarDatosEscenas(escenas, data);
  a.iniciarAventura("inicio");
}