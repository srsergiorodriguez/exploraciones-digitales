const { w, h, elt } = getGeneral();
const m = getStandardMargins();

const a = new Aventura('es', {
  contenedorAventura: "general",
  velocidadMaquina: 0,
  CSSporDefecto: false,
  deslizarAImagen: false
});

const escenas = {
  inicio: {
    texto: "Una muestra de cinco proyectos de archivo digital en América Latina, haz clic en las imágenes para tener más información de cada proyecto."
  }
}

const imgMemo = {}

async function setup() {
  noCanvas();
  const data = await d3.csv("./data.csv");

  for (let d of data) {
    if (imgMemo[d.img] === undefined) {
      const img = new Image();
      img.src = d.img;
      imgMemo[d.img] = await new Promise(resolve => {
        img.addEventListener('load',() => {resolve(img)}, false)
      });
    }
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = w;
  canvas.height = h;

  ctx.fillStyle = colbg;
  ctx.fillRect(0, 0, w, h);

  const areas = [];
  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    const img = imgMemo[d.img];

    const imgw = (m.w - (m.l*2)) / data.length;
    const imgh = (imgw * img.height) / img.width;
    const x = (i * (imgw + (m.l/2))) + m.l*0.75;
    const y = (m.h / 2) + m.t - (imgh/2);

    ctx.save();
    ctx.drawImage(img, x, y, imgw, imgh);
    ctx.restore();

    const area = {
      x: Math.floor(x + (imgw/2)),
      y: Math.floor(y + (imgh/2)),
      w: imgw, h: imgh,
      btn: "",
      scene: d.nombre,
      tooltip: d.nombre
    }
    areas.push(area);
  }

  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    const img = imgMemo[d.img];

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = w;
    canvas.height = h;

    const imgh = m.h;
    const imgw = (m.h * img.width) / img.height;
    
    ctx.save();
    ctx.drawImage(img, (m.w/2) - (imgw/2), (m.h/2) - (imgh/2), imgw, imgh);
    ctx.restore();
    
    const dataUrl = canvas.toDataURL('image/png');

    escenas[d.nombre] = {
      titulo: d.nombre,
      texto: d.texto,
      imagen: dataUrl,
      url: d.url,
      opciones: [ { btn: "<<<", escena: "inicio" } ]
    }
  }

  const dataUrl = canvas.toDataURL('image/png');
  escenas.inicio.imagen = dataUrl;
  escenas.inicio.areas = areas;

  a.fijarEscenas(escenas).iniciarAventura("inicio");
}