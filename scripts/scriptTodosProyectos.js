// Referencias al DOM
const gridContenedor = document.getElementById('grid-proyectos');
const optionsList = document.getElementById('options-list');
const currentSelection = document.getElementById('current-selection');
const customSelect = document.getElementById('custom-select');
const selectTrigger = document.getElementById('select-trigger');
const searchInput = document.getElementById('tech-search');
const { esc, cargarDatos, enlacesTarjeta, insignia, tarjetasClicables } = window.Portafolio;

let todosLosProyectos = [];

// ==========================================
// 1. CARGA INICIAL DE DATOS
// ==========================================
async function cargarYFiltrarProyectos() {
    try {
        todosLosProyectos = await cargarDatos('proyectos');
        generarOpcionesDropdown();

        // Permite enlazar un filtro: proyectos.html?tecnologia=Java
        const inicial = new URLSearchParams(location.search).get('tecnologia');
        const opcionInicial = inicial && optionsList.querySelector(`.option[data-tech="${CSS.escape(inicial)}"]`);
        if (opcionInicial) seleccionarOpcion(inicial, opcionInicial);
        else mostrarProyectos(todosLosProyectos);
    } catch (error) {
        console.error('Error cargando catálogo:', error);
        gridContenedor.innerHTML = '<p style="text-align:center; width:100%;">Hubo un error cargando los proyectos. Intenta recargar la página.</p>';
    }
}

// ==========================================
// 2. GENERADOR DE OPCIONES (Desplegable)
// ==========================================
function generarOpcionesDropdown() {
    const todasLasTecnologias = new Set();
    todosLosProyectos.forEach(p => (p.tecnologias || []).forEach(tech => todasLasTecnologias.add(tech)));

    const opcion = (valor, texto, extra = '') =>
        `<div class="option${extra}" role="option" tabindex="0" data-tech="${esc(valor)}">${esc(texto)}</div>`;

    optionsList.innerHTML = opcion('Todas', 'Ver todas', ' selected') +
        Array.from(todasLasTecnologias).sort((a, b) => a.localeCompare(b, 'es')).map(t => opcion(t, t)).join('');
}

// Clic o Enter sobre una opción
optionsList.addEventListener('click', e => {
    const op = e.target.closest('.option');
    if (op) seleccionarOpcion(op.dataset.tech, op);
});
optionsList.addEventListener('keydown', e => {
    const op = e.target.closest('.option');
    if (op && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); seleccionarOpcion(op.dataset.tech, op); }
});

// ==========================================
// 3. LÓGICA DEL DESPLEGABLE (UI)
// ==========================================
window.toggleSelect = function () {
    customSelect.classList.toggle('open');
    const abierto = customSelect.classList.contains('open');
    selectTrigger.setAttribute('aria-expanded', String(abierto));
    if (abierto) {
        searchInput.value = '';
        filtrarOpcionesDropdown();
        searchInput.focus();
    }
};

selectTrigger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSelect(); }
});

// Cerrar si se hace clic fuera o se pulsa Escape
document.addEventListener('click', e => {
    if (!customSelect.contains(e.target)) {
        customSelect.classList.remove('open');
        selectTrigger.setAttribute('aria-expanded', 'false');
    }
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && customSelect.classList.contains('open')) {
        customSelect.classList.remove('open');
        selectTrigger.setAttribute('aria-expanded', 'false');
        selectTrigger.focus();
    }
});

// ==========================================
// 4. BUSCADOR INTERNO DEL DESPLEGABLE
// ==========================================
window.filtrarOpcionesDropdown = function () {
    const filtro = searchInput.value.toLowerCase();
    optionsList.querySelectorAll('.option').forEach(op => {
        op.style.display = op.innerText.toLowerCase().includes(filtro) ? 'block' : 'none';
    });
};

// ==========================================
// 5. SELECCIÓN Y FILTRADO REAL
// ==========================================
window.seleccionarOpcion = function (categoria, elemento) {
    currentSelection.innerText = categoria === 'Todas' ? 'Todas las Tecnologías' : categoria;

    optionsList.querySelectorAll('.option').forEach(op => op.classList.remove('selected'));
    elemento.classList.add('selected');

    customSelect.classList.remove('open');
    selectTrigger.setAttribute('aria-expanded', 'false');

    const filtrados = categoria === 'Todas'
        ? todosLosProyectos
        : todosLosProyectos.filter(p => (p.tecnologias || []).includes(categoria));
    mostrarProyectos(filtrados);

    const url = categoria === 'Todas' ? location.pathname : `?tecnologia=${encodeURIComponent(categoria)}`;
    history.replaceState(null, '', url);
};

// ==========================================
// 6. RENDERIZADO DE TARJETAS (GRID)
// ==========================================
function mostrarProyectos(proyectos) {
    gridContenedor.innerHTML = '';
    gridContenedor.style.opacity = '0';

    if (proyectos.length === 0) {
        gridContenedor.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: #94a3b8; padding: 2rem;">
                <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; display:block;"></i>
                <p>No se encontraron proyectos con esta tecnología.</p>
            </div>`;
        gridContenedor.style.opacity = '1';
        return;
    }

    proyectos.forEach(proyecto => {
        const card = document.createElement('div');
        card.classList.add('project-card');
        card.dataset.id = proyecto.id;
        card.tabIndex = 0;
        card.setAttribute('aria-label', `${proyecto.titulo}: ver detalles`);

        // Máximo 4 tecnologías en la tarjeta para que no se desborde
        const techHtml = (proyecto.tecnologias || []).slice(0, 4).map(tech => `<span>${esc(tech)}</span>`).join('');
        const contexto = [proyecto.contexto, proyecto.anio].filter(Boolean).join(' · ');

        card.innerHTML = `
            <div>
                ${insignia(proyecto)}
                <h3>${esc(proyecto.titulo)}</h3>
                ${contexto ? `<p class="card-context"><i class="fas fa-graduation-cap"></i> ${esc(contexto)}</p>` : ''}
                <p>${esc(proyecto.descripcion)}</p>
                <div class="tech-stack">${techHtml}</div>
            </div>
            <div class="links" style="margin-top: auto; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
                ${enlacesTarjeta(proyecto, false)}
            </div>
        `;
        gridContenedor.appendChild(card);
    });

    setTimeout(() => {
        gridContenedor.style.transition = 'opacity 0.5s ease';
        gridContenedor.style.opacity = '1';
    }, 100);
}

// Toda la tarjeta lleva al detalle (con ratón o con Enter)
tarjetasClicables(gridContenedor);
document.addEventListener('DOMContentLoaded', cargarYFiltrarProyectos);
