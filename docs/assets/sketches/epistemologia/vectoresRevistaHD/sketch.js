const { w, h, elt } = getGeneral();
const m = {l: w * 0, r: w * 0, t: h * 0, b: h * 0, w, h}; //getStandardMargins();

const datapath = "./all_vectors_revista hd_size320_window3_sg0_mincount3_k20_c2.csv";

const tour = [
  {text: "En general, la revista tiene una postura principalmente instrumental de las tecnologías digitales, es decir, las ven como herramientas para procesos como la extracción, organización y marcado de datos.", word: "codificar", k: 20},
  {text: "Así, hay un fuerte énfasis en métodos computacionales para el procesamiento de corpus de distintas naturaleza, como se ve en este sector. Aunque, predominantemente, hay interés por análisis textual desde la filología.", word: "procesamiento", k: 20},
  {text: "También hay reflexiones con respecto a los métodos investigativos que acompañan el procesamiento: modelado, minería, recuperación, transformación, representación geográfica, construcción de bases de datos, etc.", word: "navegación", k: 20},
  {text: "Por ejemplo, métodos estadísticos de análisis textual: palabra, término, aparición, porcentaje, rango.", word: "comedia", k: 20},
  {text: "O la producción de publicaciones digitales: blog, galería, tutorial, exposición, interactividad, multiplataforma, curatorial, navegador, usabilidad, prototipo.", word: "incrementar", k: 20},
  {text: "En conexión con lo anterior, también se manifiestan preocupaciones con respecto a procesos educativos de las humanidades digitales y formas de alfabetización digital.", word: "educativo", k: 20},
  {text: "Y también existe un interés por las reflexiones al respecto del acceso, la democratización y la accesibilidad de los archivos, y en general una postura a favor del software y la ciencia abierta.", word: "democrático", k: 20},
  {text: "La revista es multilingüe, y contiene artículos en español, portugués e inglés", word: "possibilidade", k: 20}
];

let tourstep = -1;

async function setup() {
  noCanvas();
  const data = await d3.csv(datapath, d3.autoType);
  makeWordVectorMap(data);
}