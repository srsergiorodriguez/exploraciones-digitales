let t = 0; // Inicializa un contador de tiempo

function setup() { // Inicializa los elementos del código
  createCanvas(200, 400).parent("#general"); // Crea un "lienzo" digital sobre el cual se hará el dibujo
}

function draw() { // Actualiza la animación
  background("#5ca4a9"); // Esta función rellena el fondo de un color particular
  noStroke(); // Quita el borde de línea del círculo
  fill("#ed6a5a"); // Define el color de relleno del círculo
  const x = (width / 2); // Calcula posición x del círculo
  const y = (height / 2) + Math.sin(t * 0.05) * 100; // Calcula posición y del círculo
  ellipse(x, y, 150); // Dibuja el círculo
  t++; // Aumenta el contador de tiempo
}