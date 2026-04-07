const form = document.getElementById('ratingForm');
const grid = document.getElementById('prof-list');

// 1. Función para obtener y mostrar los datos del servidor
async function fetchProfesores() {
    try {
        const response = await fetch('/api/profesores');
        const profes = await response.json();
        
        grid.innerHTML = ''; // Limpiar la cuadrícula antes de cargar

        profes.forEach(profe => {
            const card = document.createElement('div');
            card.className = 'card';

            // Lógica para el color de la calificación (Opcional pero pro)
            let badgeClass = 'rating-badge';
            if (profe.calificacion >= 8.5) badgeClass += ' high'; // Podrías añadir CSS para esto
            if (profe.calificacion < 6) badgeClass += ' low';

            card.innerHTML = `
                <h3><i class="fas fa-user-tie"></i> ${profe.nombre}</h3>
                <div class="subject"><i class="fas fa-book"></i> ${profe.materia}</div>
                <div class="${badgeClass}">
                    <i class="fas fa-star"></i> ${profe.calificacion} / 10
                </div>
                <p class="comment">
                    <i class="fas fa-quote-left" style="color: #ccc; margin-right: 5px;"></i>
                    ${profe.comentario || "Sin comentarios adicionales."}
                </p>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error("Error al obtener profesores:", error);
        grid.innerHTML = '<p style="text-align:center; color:red;">No se pudieron cargar los datos.</p>';
    }
}

// 2. Enviar datos al servidor cuando se envía el formulario
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Capturamos los valores de los inputs
    const data = {
        nombre: document.getElementById('profName').value,
        materia: document.getElementById('subject').value,
        calificacion: parseFloat(document.getElementById('score').value),
        comentario: document.getElementById('comment').value
    };

    try {
        const response = await fetch('/api/calificar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            form.reset(); // Limpiar el formulario si todo salió bien
            fetchProfesores(); // Recargar la lista automáticamente para ver el nuevo registro
            alert('¡Calificación enviada con éxito!');
        } else {
            alert('Hubo un error al enviar la calificación.');
        }
    } catch (error) {
        console.error("Error en el envío:", error);
        alert('Error de conexión con el servidor.');
    }
});

// 3. Carga inicial
window.onload = fetchProfesores;