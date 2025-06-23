const ObtenerSolicitudes_route = 'https://vaelsaki.bsite.net/api/Sol_materiales/seleccionarsolmateriales';

function loadRequests() {
    $.ajax({
        url: ObtenerSolicitudes_route,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log('Datos recibidos:', data);
            const session = sessionStorage.getItem('usuario');
            const usuario = JSON.parse(session);
            const userName = usuario.nombre;
            if (userName) {
                const filteredData = data.filter(request => request.Nombre.toLowerCase() === userName.toLowerCase());
                renderTable(filteredData); // Renderiza las solicitudes filtradas
            } else {
                console.error('Nombre de usuario no encontrado en sessionStorage.');
            }
        },
        error: function(error) {
            console.error('Error obteniendo los datos:', error);
        }
    });
}

function renderTable(data) {
    const tbody = $('#history-tbody');
    tbody.empty();
    data.forEach(function(request) {
        const entregado = (new Date(request.Hora_de_entrada).getFullYear() === 1900) ? "No" : "Sí";
        const row = `
            <tr>
                <td>${request.Nombre}</td>
                <td>${request.Fecha}</td>
                <td>${entregado}</td>
            </tr>
        `;
        tbody.append(row);
    });
}

$(document).ready(function() {
    loadRequests();
});
