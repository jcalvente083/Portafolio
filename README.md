# Portafolio de Jesús David Calvente Zapata

Web estática (HTML, CSS y JavaScript). Se publica tal cual en GitHub Pages o en cualquier servidor.

## Probarla en local
Los datos se cargan con `fetch`, así que hay que abrirla con un servidor:

    python -m http.server 8000

y entrar en http://localhost:8000

## Actualizar el contenido
Todo el contenido está en `Datos/` (proyectos, habilidades y currículum). El formato de cada fichero está explicado en `Datos/tipoDatos.txt`.

## Estructura
- `index.html`, `proyectos.html`, `detalle-proyecto.html`, `sobremi.html`, `contacto.html`, `proyecto_no_disponible.html`
- `styles/styles.css`: estilos (los añadidos están al final, sección 13)
- `scripts/comun.js`: utilidades compartidas; `scripts/scriptNavBar.js`: menú móvil y año del pie (cargado en todas las páginas)
- `assets/`: foto, CV, iconos de habilidades (locales) e imágenes de los proyectos
- `ProyectosCodigo/Forma25/Forma_25.html`: demo de NetLogo de la simulación de bulos

## Dominio
Las etiquetas para compartir en redes, el `sitemap.xml` y el `robots.txt` usan `https://www.jcalvente083.qzz.io/`. Si cambias de dominio, busca y reemplaza esa dirección.
