document.addEventListener('DOMContentLoaded', cargarCurriculum);

async function cargarCurriculum() {
    const { esc, cargarDatos } = window.Portafolio;
    try {
        const datos = await cargarDatos('curriculum');

        // Tarjetas del CV
        const tarjetas = (id, lista) => {
            const grid = document.getElementById(id);
            if (grid) grid.innerHTML = (lista || []).map(crearTarjetaCV).join('');
        };
        tarjetas('grid-premios-menciones', datos.premiosMenciones);
        tarjetas('grid-formacion-reglada', datos.formacionReglada);
        tarjetas('grid-comunidad', datos.comunidad);
        tarjetas('grid-formacion-noreglada', datos.formacionNoReglada);
        tarjetas('grid-congresos', datos.congresos);

        // Listas de habilidades
        const lista = (id, items) => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = (items || []).map(i => `<span>${esc(i)}</span>`).join('');
        };
        lista('list-iaml', datos.iaMl);
        lista('list-lenguajes', datos.lenguajes);
        lista('list-herramientas', datos.herramientas);
        lista('list-idiomas', datos.idiomas);
        lista('list-softskills', datos.softSkills);
        lista('list-otros', datos.otros);
    } catch (error) {
        console.error('Error al cargar el currículum:', error);
        const aviso = document.getElementById('aviso-cv');
        if (aviso) aviso.hidden = false;
    }

    // Tarjeta de estudio, curso, premio o evento
    function crearTarjetaCV(item) {
        return `
            <div class="cv-card">
                <span class="date">${esc(item.fecha)}</span>
                <h3>${esc(item.titulo)}</h3>
                <h4><i class="fas fa-building" style="margin-right:5px;"></i> ${esc(item.institucion)}</h4>
                ${item.descripcion ? `<p>${esc(item.descripcion)}</p>` : ''}
            </div>
        `;
    }
}
