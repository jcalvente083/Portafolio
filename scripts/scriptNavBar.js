// Menú móvil: funciona en todas las páginas (busca el botón por su clase)
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    const fijarEstado = (abierto) => {
        navLinks.classList.toggle('active', abierto);
        menuToggle.classList.toggle('is-active', abierto);
        menuToggle.setAttribute('aria-expanded', String(abierto));
        menuToggle.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    };

    menuToggle.addEventListener('click', () => fijarEstado(!navLinks.classList.contains('active')));
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => fijarEstado(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') fijarEstado(false); });
}

// Año del pie de página
const spanAnio = document.getElementById('year');
if (spanAnio) spanAnio.textContent = new Date().getFullYear();
