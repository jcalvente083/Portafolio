/* Utilidades compartidas por los scripts del portafolio. */
window.Portafolio = (function () {
    // Evita que un texto del JSON rompa el HTML
    function esc(valor) {
        return String(valor ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
    }

    // Carga un JSON de /Datos una sola vez por página
    const cache = {};
    function cargarDatos(nombre) {
        if (!cache[nombre]) {
            cache[nombre] = fetch(`Datos/${nombre}.json`).then(r => {
                if (!r.ok) throw new Error(`Error HTTP ${r.status} cargando ${nombre}.json`);
                return r.json();
            });
        }
        return cache[nombre];
    }

    function urlDetalle(id) {
        return `detalle-proyecto.html?id=${encodeURIComponent(id)}`;
    }

    // Enlaces de una tarjeta: Detalles, Demo y Código (solo los que existen)
    function enlacesTarjeta(p, conDetalles) {
        const enlaces = [];
        if (conDetalles) enlaces.push(`<a href="${urlDetalle(p.id)}"><i class="fas fa-circle-info"></i> Detalles</a>`);
        if (p.demo) enlaces.push(`<a href="${esc(p.demo)}" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> Demo</a>`);
        if (p.repo) enlaces.push(`<a href="${esc(p.repo)}" target="_blank" rel="noopener"><i class="fab fa-github"></i> Código</a>`);
        else if (p.codigoProximamente) enlaces.push(`<a href="proyecto_no_disponible.html"><i class="fas fa-hourglass-half"></i> Código (próximamente)</a>`);
        return enlaces.join('');
    }

    function insignia(p) {
        return p.insignia ? `<span class="card-badge"><i class="fas fa-trophy"></i> ${esc(p.insignia)}</span>` : '';
    }

    // Las copias del carrusel infinito no deben leerse ni recibir el foco con el tabulador
    function marcarCopia(nodo) {
        nodo.setAttribute('aria-hidden', 'true');
        nodo.removeAttribute('tabindex');
        nodo.querySelectorAll('a, button, [tabindex]').forEach(el => el.setAttribute('tabindex', '-1'));
        return nodo;
    }

    // Un solo manejador para todas las tarjetas (también las clonadas):
    // clic en la tarjeta = ir al detalle; clic en un enlace = abrir el enlace.
    function tarjetasClicables(contenedor) {
        contenedor.addEventListener('click', e => {
            if (e.target.closest('a')) return;
            const tarjeta = e.target.closest('[data-id]');
            if (tarjeta) window.location.href = urlDetalle(tarjeta.dataset.id);
        });
        contenedor.addEventListener('keydown', e => {
            if (e.key !== 'Enter' || e.target.closest('a')) return;
            const tarjeta = e.target.closest('[data-id]');
            if (tarjeta) window.location.href = urlDetalle(tarjeta.dataset.id);
        });
    }

    return { esc, cargarDatos, urlDetalle, enlacesTarjeta, insignia, marcarCopia, tarjetasClicables };
})();
