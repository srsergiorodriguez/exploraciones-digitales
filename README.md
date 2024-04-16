# Humanidades digitales en América Latina
## Un mapeo multidimensional de sus tensiones

- El código `sh format-all-citations.sh` toma todos los archivos en la lista `chapters` y los covierte en archivos con el formato correcto de citación tanto para el sitio web como la versión impresa. Todos los nombres de archivos en la lista `chapters` deben tener el siguiente formato de nombre: `NOMBREDELCAPITULO-draft.md` y deben estar ubicados en la carpeta content. El código creará un archivo con el nombre del capítulo para el sitio web, removiendo la parte `-draft` del nombre, y un archivo para el pdf, removiendo la parte `-draft` y añadiendo `-nott` (no tooltip).
- `magicbook build --config=magicbook_draft.json --watch`
- El código `sh remove-all-citations.sh` eliminará los archivos creados por `sh format-all-citations.sh`, para evitar mantener archivos innecesarios en la redacción de los borradores del libro.