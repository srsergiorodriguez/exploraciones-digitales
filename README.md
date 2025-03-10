# Humanidades digitales en América Latina
## Un mapeo multidimensional de sus tensiones

Este es el repositorio de la disertación doctoral de Sergio Rodríguez Gómez titulada ***Humanidades digitales en América Latina. Un mapeo multidimensional de sus tensiones***. La disertación es un libro digital que puede leerse en línea o en formato pdf listo para imprimir. Para lograr esta doble posibilidad, el libro fue creado usando el sistema <a href="https://github.com/magicbookproject/magicbook" target="_blank">Magicbook project</a>. El sistema fue ajustado para adaptarse a las necesidades del libro y para localizar el resultado al idioma español.

Este repositorio es libre y abierto y se puede adaptar para crear proyectos similares.

### Comandos Unix para automatizar procesos del libro digital

A continuación algunos comandos unix útiles para compilar nuevas versiones del libro:

- El código `sh format-all-citations.sh` toma todos los archivos en la lista `chapters` y los convierte en archivos con el formato correcto de citación tanto para el sitio web como la versión impresa. Todos los nombres de archivos en la lista `chapters` deben tener el siguiente formato de nombre: `NOMBREDELCAPITULO-draft.md` y deben estar ubicados en la carpeta content. El código creará un archivo con el nombre del capítulo para el sitio web, removiendo la parte `-draft` del nombre, y un archivo para el pdf, removiendo la parte `-draft` y añadiendo `-nott` (no tooltip).
- `magicbook build --config=magicbook_draft.json --watch` o `magicbook build --config=magicbook_citation.json --watch` o `magicbook build --config=magicbook_final.json --watch` crean las versiones de borrador, de citación web y la versión final para publicar en pdf.
- El código `sh remove-all-citations.sh` elimina los archivos creados por `sh format-all-citations.sh` para evitar mantener archivos innecesarios en la redacción de los borradores del libro.