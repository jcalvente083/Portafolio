const contenedor = document.getElementById('contenedor-proyectos');
const { esc, cargarDatos, enlacesTarjeta, insignia, marcarCopia, tarjetasClicables } = window.Portafolio;

async function cargarProyectos() {
    try {
        const proyectos = await cargarDatos('proyectos');

        contenedor.innerHTML = '';
        contenedor.classList.remove('is-loaded');

        // Los 5 primeros del JSON (el orden del JSON decide cuáles salen en la portada)
        proyectos.slice(0, 5).forEach(proyecto => {
            const card = document.createElement('div');
            card.classList.add('project-card');
            card.dataset.id = proyecto.id;
            card.tabIndex = 0;
            card.setAttribute('aria-label', `${proyecto.titulo}: ver detalles`);

            const techHtml = (proyecto.tecnologias || []).slice(0, 4).map(tech => `<span>${esc(tech)}</span>`).join('');

            card.innerHTML = `
                <div>
                    ${insignia(proyecto)}
                    <h3>${esc(proyecto.titulo)}</h3>
                    <p>${esc(proyecto.descripcion)}</p>
                    <div class="tech-stack">${techHtml}</div>
                </div>
                <div class="links">${enlacesTarjeta(proyecto, true)}</div>
            `;
            contenedor.appendChild(card);
        });

        // Tarjeta "Ver más proyectos"
        const verMasCard = document.createElement('a');
        verMasCard.href = './proyectos.html';
        verMasCard.className = 'project-card view-more-card';
        verMasCard.innerHTML = `
            <div class="view-more-icon-circle"><i class="fas fa-arrow-right"></i></div>
            <div class="view-more-content">
                <h3>Ver los ${proyectos.length} proyectos</h3>
                <p>Explora todo el catálogo</p>
            </div>
        `;
        contenedor.appendChild(verMasCard);

        // Duplicamos para el carrusel infinito y arrancamos la animación
        requestAnimationFrame(() => {
            Array.from(contenedor.children).forEach(item => contenedor.appendChild(marcarCopia(item.cloneNode(true))));
            requestAnimationFrame(() => contenedor.classList.add('is-loaded'));
        });
    } catch (error) {
        console.error('Error cargando los proyectos:', error);
        contenedor.innerHTML = '<p style="color: var(--text-muted); padding: 0 5%;">No se han podido cargar los proyectos. <a href="proyectos.html" style="color: var(--primary);">Ver el catálogo</a></p>';
    }
}

tarjetasClicables(contenedor);
document.addEventListener('DOMContentLoaded', cargarProyectos);
