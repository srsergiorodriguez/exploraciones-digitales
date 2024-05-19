const { w, h, elt } = getGeneral();
const m = {l: w * 0, r: w * 0, t: h * 0, b: h * 0, w, h}; //getStandardMargins();

const datapath = "./all_vectors_reviews in dh_size320_window3_sg0_mincount3_k20_c2.csv";

const tour = [
  {text: "En una parte del mapa hay referencias a aspectos técnicos, por ejemplo, en este sector se mencionan conceptos tecnológicos propios de la interacción web, como algoritmo, filtro, categoría, ruta, o clic", word: "scroll", k: 20},
  {text: "Aquí, reflexiones con respecto a los archivos digitales y su acceso: digitalización, creación de bases de datos, búsquedas, descargas, enlaces, interacciones, etc.", word: "digitized", k: 20},
  {text: "y aquí prácticas de la digitalización de documentos: anotación, escaneo, transcripción, lectura, comentario, etc.", word: "readable", k: 20},
  {text: "También, en términos más generales, en otros sectores se agrupan algunos conceptos relacionados con las oportunidades que plantean las humanidades digitales: extender, innovar, propiciar la justucia social, involucrar aspectos técnicos, etc.", word: "technique", k: 20},
  {text: "Aquí algunas menciones al interés particular de la revista en temas relacionados con la justicia social: gentrificación, colonialismo, juventud, etnicidad, etc.", word: "gentrification", k: 20},
  {text: "En este sector del mapa se evidencian intereses en proyectos que tienen componentes identitarios de grupos marginalizados: referencias a comunidades latinas, negras, queer, indigenas, grupos religiosos, inmigrantes.", word: "indigenous", k: 20},
  {text: "...esta es una continuación del sector anterior...", word: "case", k: 20},
  {text: "También se encuentran múltiples sectores con temas específicos, por ejemplo, aquí, temas relacionados con la esclavitud y la guerra civil estadounidense.", word: "unexplored", k: 20}
];

let tourstep = -1;

async function setup() {
  noCanvas();
  const data = await d3.csv(datapath, d3.autoType);
  makeWordVectorMap(data);
}