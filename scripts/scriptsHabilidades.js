const contenedorHabilidades = document.getElementById('contenedor-habilidades');

async function cargarHabilidades() {
    const { esc, cargarDatos, marcarCopia } = window.Portafolio;
    try {
        const habilidades = await cargarDatos('habilidades');

        contenedorHabilidades.innerHTML = '';
        contenedorHabilidades.classList.remove('is-loaded');

        habilidades.forEach(skill => {
            const div = document.createElement('div');
            div.classList.add('skill-card');

            // ¿Imagen (URL o local) o icono de Font Awesome?
            let iconoHTML = '';
            if (skill.icono.startsWith('http') || skill.icono.startsWith('assets/')) {
                iconoHTML = `<img src="${esc(skill.icono)}" alt="" width="48" height="48" style="height: 3rem; width: auto; margin-bottom: 1rem; display: block; margin-left: auto; margin-right: auto;">`;
            } else {
                iconoHTML = `<i class="${esc(skill.icono)}" style="color: ${esc(skill.color)}"></i>`;
            }
            div.innerHTML = `${iconoHTML}<p>${esc(skill.nombre)}</p>`;
            contenedorHabilidades.appendChild(div);
        });

        // Duplicamos dos veces (las tarjetas son estrechas) y arrancamos la animación
        requestAnimationFrame(() => {
            const items = Array.from(contenedorHabilidades.children);
            for (let i = 0; i < 2; i++) items.forEach(item => contenedorHabilidades.appendChild(marcarCopia(item.cloneNode(true))));
            requestAnimationFrame(() => contenedorHabilidades.classList.add('is-loaded'));
        });
    } catch (error) {
        console.error('Error cargando habilidades:', error);
    }
}

document.addEventListener('DOMContentLoaded', cargarHabilidades);
