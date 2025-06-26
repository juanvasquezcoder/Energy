// Función para actualizar la fecha y hora
function updateDateTime() {
    const now = new Date();
    const datetime = now.toLocaleString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    document.getElementById('datetime').textContent = datetime;
}
setInterval(updateDateTime, 1000);
updateDateTime();

// Manejar el envío del formulario
const buscarForm = document.getElementById('buscar-form');
const resultadosContainer = document.getElementById('resultados-container');
const buscarBtn = document.getElementById('buscar-btn');

buscarForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    const apiUrl = buscarForm.dataset.url;
    const formData = new FormData(buscarForm);
    
    // Feedback visual para el usuario
    resultadosContainer.innerHTML = 'Buscando...';
    buscarBtn.disabled = true;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData,
            // El token CSRF ya se envía con el FormData gracias a {% csrf_token %}
        });

        const data = await response.json();

        if (data.status === 'success') {
            resultadosContainer.innerHTML = `<div class="status-message status-success">No hacer Visita. Se encontraron ${data.resultados.length} registro(s):</div>`;
            data.resultados.forEach(r => {
                var fecha_registro = '';
                var nombre = '';
                var monto = '';
                if(r.fecha_registro == null){
                    fecha_registro = 'No hay fecha';
                } else {
                    fecha_registro = r.fecha_registro;
                }
                if(r.nombre == null){
                    nombre = 'No existe Nombre';
                } else {
                    nombre = r.nombre;
                }
                if(r.monto == null){
                    monto = 'No hay Monto';
                } else {
                    monto = r.monto;
                }
                const resultDiv = document.createElement('div');
                resultDiv.className = 'result-item';
                resultDiv.innerHTML = `
                    <strong>Cédula:</strong> ${r.cedula}<br>
                    <strong>Nombre:</strong> ${nombre}<br>
                    <strong>Estado:</strong> ${r.estado}<br>
                    <strong>Monto:</strong> ${monto}<br>
                    <strong>Fecha Registro:</strong> ${fecha_registro}
                `;
                resultadosContainer.appendChild(resultDiv);
            });
        } else {
            // Maneja tanto not_found como otros errores
            const messageClass = data.status === 'not_found' ? 'status-not-found' : 'status-success';
            resultadosContainer.innerHTML = `<div class="status-message ${messageClass}">${data.message}</div>`;
        }

    } catch (error) {
        console.error('Error en el fetch:', error);
        resultadosContainer.innerHTML = `<div class="status-message status-success">Error de conexión con el servidor.</div>`;
    } finally {
        buscarBtn.disabled = false; // Vuelve a habilitar el botón
    }
});

// Función para limpiar el formulario
function nuevaBusqueda() {
    buscarForm.reset();
    resultadosContainer.innerHTML = '';
    document.getElementById('usuario').focus();
}

// Función para obtener la cookie CSRF (no es estrictamente necesaria si usas FormData, pero es buena práctica tenerla)
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}