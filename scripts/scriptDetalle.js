const { esc, cargarDatos, urlDetalle, insignia, marcarCopia, tarjetasClicables } = window.Portafolio;

// 1. Volver atrás (si venimos de la propia web) o al catálogo
window.volverAtras = function () {
    if (document.referrer && new URL(document.referrer).hostname === location.hostname) {
        window.history.back();
    } else {
        window.location.href = './proyectos.html';
    }
};

// 2. Acordeones
window.toggleAccordion = function (boton) {
    const item = boton.parentElement;
    const body = item.querySelector('.accordion-body');
    const abierto = item.classList.toggle('active');
    boton.setAttribute('aria-expanded', String(abierto));
    body.style.maxHeight = abierto ? body.scrollHeight + 'px' : 0;
};

function parrafos(contenido) {
    const lista = Array.isArray(contenido) ? contenido : String(contenido || '').split(/\n\s*\n/);
    return lista.filter(Boolean).map(t => `<p>${esc(t)}</p>`).join('');
}

function aNumero(texto) {
    const n = parseFloat(String(texto).replace(/\./g, '').replace(',', '.').replace(/[^\d.\-]/g, ''));
    return Number.isFinite(n) ? n : null;
}

// Tabla de resultados (los valores más altos de las columnas indicadas van en negrita)
function tablaResultados(r) {
    if (!r || !r.filas || !r.filas.length) return '';
    const numericas = new Set(r.numericas || []);
    const maximos = {};
    (r.destacarMax || []).forEach(col => {
        maximos[col] = Math.max(...r.filas.map(f => aNumero(f[col]) ?? -Infinity));
    });
    const cabecera = r.columnas.map((c, i) => `<th scope="col"${numericas.has(i) ? ' class="num"' : ''}>${esc(c)}</th>`).join('');
    const filas = r.filas.map(fila => '<tr>' + fila.map((celda, i) => {
        const clase = numericas.has(i) ? ' class="num"' : '';
        const valor = (i in maximos && aNumero(celda) === maximos[i]) ? `<strong>${esc(celda)}</strong>` : esc(celda);
        return i === 0 ? `<th scope="row"${clase}>${valor}</th>` : `<td${clase}>${valor}</td>`;
    }).join('') + '</tr>').join('');
    return `
        <h2 style="margin-top: 3rem;">Resultados</h2>
        <div class="results-card">
            <div class="results-scroll">
                <table class="results-table">
                    <thead><tr>${cabecera}</tr></thead>
                    <tbody>${filas}</tbody>
                </table>
            </div>
            ${r.nota ? `<p class="results-note"><i class="fas fa-circle-info"></i> ${esc(r.nota)}</p>` : ''}
        </div>`;
}

function fichaProyecto(p) {
    const filas = [
        ['fa-graduation-cap', 'Contexto', p.contexto],
        ['fa-calendar', 'Año', p.anio],
        ['fa-users', 'Equipo', p.equipo],
        ['fa-trophy', 'Reconocimiento', p.reconocimiento]
    ].filter(f => f[2]);
    if (!filas.length) return '';
    return `
        <div class="sidebar-section">
            <h3>Ficha del Proyecto</h3>
            <ul class="project-facts">
                ${filas.map(([icono, etiqueta, valor]) => `
                    <li><i class="fas ${icono}"></i><div><span>${etiqueta}</span>${esc(valor)}</div></li>`).join('')}
            </ul>
        </div>`;
}

function mostrarAviso(titulo, texto) {
    document.getElementById('p-title').innerText = titulo;
    document.getElementById('p-desc-short').innerHTML =
        `${esc(texto)}<br><a href="proyectos.html" class="btn" style="margin-top: 1.5rem;"><i class="fas fa-th-large"></i> Ver todos los proyectos</a>`;
    document.querySelector('.project-details-container').style.display = 'none';
    document.getElementById('similares-section').style.display = 'none';
}

// 3. Carga principal
async function cargarDetalleProyecto() {
    const idProyecto = new URLSearchParams(window.location.search).get('id');
    if (!idProyecto) return mostrarAviso('Proyecto no especificado', 'El enlace no indica qué proyecto mostrar.');

    try {
        const proyectos = await cargarDatos('proyectos');
        const proyecto = proyectos.find(p => p.id === idProyecto);
        if (!proyecto) return mostrarAviso('Proyecto no encontrado', 'Puede que el enlace sea antiguo o esté mal escrito.');

        // Cabecera
        document.title = `${proyecto.titulo} | Jesús D. Calvente`;
        document.querySelector('meta[name="description"]')?.setAttribute('content', proyecto.descripcion);
        document.getElementById('p-title').innerText = proyecto.titulo;
        document.getElementById('p-desc-short').innerText = proyecto.descripcion;

        const meta = [insignia(proyecto)];
        if (proyecto.contexto) meta.push(`<span class="hero-pill"><i class="fas fa-graduation-cap"></i> ${esc(proyecto.contexto)}</span>`);
        if (proyecto.anio) meta.push(`<span class="hero-pill"><i class="fas fa-calendar"></i> ${esc(proyecto.anio)}</span>`);
        document.getElementById('p-meta').innerHTML = meta.join('');

        const hero = document.getElementById('p-hero');
        if (proyecto.imagen) hero.style.backgroundImage = `url('${proyecto.imagen}')`;
        else hero.style.background = 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)';

        // Contenido: texto + módulos (acordeones) + resultados
        let html = parrafos(proyecto.contenido || proyecto.descripcion);
        if (proyecto.modulos && proyecto.modulos.length) {
            html += `<h2 style="margin-top: 3rem;">Cómo Está Hecho</h2><div class="accordion-container">` +
                proyecto.modulos.map((m, i) => `
                    <div class="accordion-item">
                        <button class="accordion-header" onclick="toggleAccordion(this)" aria-expanded="false" aria-controls="modulo-${i}">
                            ${esc(m.titulo)} <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="accordion-body" id="modulo-${i}"><p>${esc(m.texto)}</p></div>
                    </div>`).join('') + `</div>`;
        }
        html += tablaResultados(proyecto.resultados);
        document.getElementById('p-content').innerHTML = html;

        // Barra lateral: ficha, stack y enlaces
        document.getElementById('p-ficha').innerHTML = fichaProyecto(proyecto);
        document.getElementById('p-techs').innerHTML = (proyecto.tecnologias || []).map(t => `<span>${esc(t)}</span>`).join('');

        let links = '';
        if (proyecto.demo) links += `<a href="${esc(proyecto.demo)}" target="_blank" rel="noopener" class="btn"><i class="fas fa-external-link-alt"></i> Ver Demo</a>`;
        if (proyecto.repo) links += `<a href="${esc(proyecto.repo)}" target="_blank" rel="noopener" class="btn btn-outline"><i class="fab fa-github"></i> Ver Código</a>`;
        else if (proyecto.codigoProximamente) links += `<a href="proyecto_no_disponible.html" class="btn btn-outline"><i class="fas fa-hourglass-half"></i> Código (próximamente)</a>`;
        if (proyecto.notaDemo) links += `<p class="demo-note"><i class="fas fa-circle-info"></i> ${esc(proyecto.notaDemo)}</p>`;
        document.getElementById('p-links').innerHTML = links || '<p style="color:#64748b; text-align:center;">No hay enlaces.</p>';

        cargarSimilaresCarrusel(proyecto, proyectos);
    } catch (error) {
        console.error(error);
        mostrarAviso('Error cargando detalles', 'Recarga la página o vuelve a intentarlo más tarde.');
    }
}

// 4. Carrusel "También podría interesarte"
function cargarSimilaresCarrusel(proyectoActual, todosLosProyectos) {
    const track = document.getElementById('similares-track');
    const section = document.getElementById('similares-section');
    if (!track || !section) return;

    // Puntuación por tecnologías en común
    const candidatos = todosLosProyectos
        .filter(p => p.id !== proyectoActual.id)
        .map(p => ({ p, puntos: (p.tecnologias || []).filter(t => (proyectoActual.tecnologias || []).includes(t)).length }))
        .filter(c => c.puntos > 0)
        .sort((a, b) => b.puntos - a.puntos)
        .slice(0, 6)
        .map(c => c.p);

    if (!candidatos.length) { section.style.display = 'none'; return; }

    candidatos.forEach(p => track.appendChild(crearTarjetaSimilares(p)));

    // Rellenar hasta 6 tarjetas y duplicar el conjunto para el bucle infinito
    const originales = Array.from(track.children);
    const repeticiones = Math.ceil(6 / originales.length);
    for (let i = 1; i < repeticiones; i++) originales.forEach(item => track.appendChild(marcarCopia(item.cloneNode(true))));
    Array.from(track.children).forEach(item => track.appendChild(marcarCopia(item.cloneNode(true))));

    requestAnimationFrame(() => track.classList.add('is-loaded'));
}

function crearTarjetaSimilares(p) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.id = p.id;
    card.tabIndex = 0;
    card.setAttribute('aria-label', `${p.titulo}: ver detalles`);
    const techs = (p.tecnologias || []).slice(0, 3).map(t => `<span>${esc(t)}</span>`).join('');
    const resumen = p.descripcion.length > 90 ? p.descripcion.slice(0, 87).trimEnd() + '…' : p.descripcion;
    card.innerHTML = `
        <div>
            <h3 style="font-size:1.1rem; margin-bottom:0.5rem">${esc(p.titulo)}</h3>
            <p style="font-size:0.85rem; margin-bottom:1rem">${esc(resumen)}</p>
            <div class="tech-stack" style="margin-bottom:0">${techs}</div>
        </div>`;
    return card;
}

// Las tarjetas (también las clonadas del carrusel) llevan al detalle
tarjetasClicables(document.getElementById('similares-track'));
document.addEventListener('DOMContentLoaded', cargarDetalleProyecto);
