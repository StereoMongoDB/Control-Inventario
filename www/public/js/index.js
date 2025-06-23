const { id } = require("../../../platforms/browser/platform_www/platform");
const cors = require("cors")

app.use (cors());

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}
function loadPartialView(viewName, divClass = null) {
    $.ajax({
      url: "views/" + viewName + ".html",
      method: "GET",
      success: function (data) {
        $(divClass).html(data);
      },
      error: function (xhr, status, error) {
        console.error("Error al cargar la vista parcial", error);
      },
    });
  }

  function buscador() {
    const searchInput = document.getElementById('searchInput');
    const tableSelectors = ['#usuarios-tbody', '#inventory-tbody', '#group-tbody' ,'#notification', '#requests-tbody' , '#departamento-tbody'];

    searchInput.addEventListener('input', function() {
        const searchText = this.value.toLowerCase().trim();

        tableSelectors.forEach(selector => {
            const tableRows = $(selector + ' tr');

            tableRows.each(function() {
                let rowMatches = false;

                $(this).find('td').each(function() {
                    const cellText = $(this).text().toLowerCase();
                    if (cellText.includes(searchText)) {
                        rowMatches = true;
                        return false;
                    }
                });

                if (rowMatches) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        });
    });
}


function cerrarSesion() {
  sessionStorage.removeItem('usuario');
  alert('Sesión cerrada correctamente.');
  window.location.reload();
  }

//SIDEBAR

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle('show');
  sidebar.classList.toggle('hidden');

  const admin = document.getElementById("adminLink");
  const Historial = document.getElementById("historialLink");
  const session = sessionStorage.getItem('usuario');
  const usuario = JSON.parse(session);

  if(usuario.Tipo_Id < 5)
    admin.style.display = ('block');
    Historial.style.display = ('none');
  if(usuario.Tipo_Id == 5)
    Historial.style.display = ('block');

}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.remove('show');
  sidebar.classList.add('hidden');
}

//Mostrar nombre de usuario en init

function showUser(){
  const session = sessionStorage.getItem('usuario');
  const usuario = JSON.parse(session);
  const mostrar = usuario.usuario1;

  var nombre_usuario = document.getElementById("user-name");

  nombre_usuario.append(mostrar);

}

//LLAMADO DE TABLAS.
function loadUsers() {

    var cargoMap = {
        1: 'Administrador',2: 'Encargado General',3: 'Encargado Mantenimiento Industrial',4: 'Encargado Mecatrónica',5: 'Alumno'};
    $.ajax({
        url: buscarUsuario_route,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log('Datos recibidos:', data);
            var filteredData = data.filter(function(usuario) {
                return usuario.Tipo_Id !== 1; 
            });
            filteredData.sort(function(a, b) {
                return a.Tipo_Id - b.Tipo_Id;
            });
            var tbody = $('#usuarios-tbody');
            tbody.empty();
            filteredData.forEach(function(usuario) {
                var cargo = cargoMap[usuario.Tipo_Id];
                var row = `
                    <tr>
                        <td class="text-center">${usuario.usuario1}</td>
                        <td class="text-center">${cargo}</td>
                        <td class="text-center">${usuario.correo}</td>
                        <td class="text-center">${usuario.matricula}</td>
                        <td class="text-center">
                            <button class="btn-delete" data-id="${usuario.Id_Usuario}"><i class="fas fa-trash"></i></button>
                            <a href="views/Admin_Views/User_Views/userOverview.html?id=${usuario.Id_Usuario}"><button class="btn-view"><i class="bi bi-eye"></i></button></a>
                        </td>
                    </tr>
                `;
                tbody.append(row);
            });
            
            $('.btn-delete').on('click', function() {
                var userId = $(this).data('id');
                deleteUser(userId);
            });
            buscador();
        },
        error: function(error) {
            console.error('Error obteniendo los datos:', error);
        }
    });
}

function obtenerIdDeUsuarioDesdeUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    console.log('ID de usuario obtenido desde la URL:', userId);
    return userId;
}


function cargarDatosUsuario() {
    const userId = obtenerIdDeUsuarioDesdeUrl();
    if (!userId) {
        console.error('ID de usuario no encontrado en la URL');
        return;
    }

    $.ajax({
        url: `${buscarUsuario_route}${userId}`,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            if (data) {
                console.log('Datos del usuario:', data);
                $('#usuario').val(data.usuario1 || '');
                $('#nombre').val(data.nombre || '');
                $('#apellido').val(data.apellido || '');
                $('#email').val(data.correo || '');
                $('#matricula').val(data.matricula || '');
                $('#userId').val(data.Id_Usuario || '');

                window.userData = data;
            } else {
                console.error('No se encontraron datos del usuario');
                alert('No se encontraron datos del usuario');
            }
        },
        error: function(error) {
            console.error('Error al obtener los datos del usuario:', error);
            alert('Error al cargar los datos del usuario');
        }
    });
}


function deleteUser(userId) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        $.ajax({
            url: `${eliminarUsuario_route}${userId}`,
            method: 'DELETE',
            success: function(response) {
                console.log('Usuario eliminado:', response);
                loadUsers();
            },
            error: function(xhr, status, error) {
                if (xhr.status === 409) {
                    alert('No se puede eliminar el usuario porque hay solicitudes asociadas a él.');
                } else {
                    console.error('Error eliminando el usuario:', error);
                }
            }
        });
    }
}

function loadEncargados() {
    var cargoMap = {
        2: 'Encargado General',3: 'Encargado Mantenimiento Industrial',4: 'Encargado Mecatrónica'};
    $.ajax({
        url: buscarUsuario_route,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log('Datos recibidos:', data);
            var encargados = data.filter(function(usuario) {
                return usuario.Tipo_Id === 2 || usuario.Tipo_Id === 3 || usuario.Tipo_Id === 4;
            });
            encargados.sort(function(a, b) {
                return a.Tipo_Id - b.Tipo_Id;
            });
            var tbody = $('#usuarios-tbody');
            tbody.empty();
            encargados.forEach(function(usuario) {
                var cargo = cargoMap[usuario.Tipo_Id];
                var row = `
                    <tr>
                        <td class="text-center">${usuario.usuario1}</td>
                        <td class="text-center">${cargo}</td>
                        <td class="text-center">${usuario.correo}</td>
                        <td class="text-center">${usuario.matricula}</td>
                        <td class="text-center">
                            <button class="btn-delete" data-id="${usuario.Id_Usuario}"><i class="fas fa-trash"></i></button>
                            <a href="views/Admin_Views/User_Views/userOverview.html?id=${usuario.Id_Usuario}"><button class="btn-view"><i class="bi bi-eye"></i></button></a>
                        </td>
                    </tr>
                `;
                tbody.append(row);
            });
            $('.btn-delete').on('click', function() {
                var userId = $(this).data('id');
                deleteUser(userId);
            });
            buscador();
        },
        error: function(error) {
            console.error('Error obteniendo los datos:', error);
        }
    });
}

function loadAlumnos() {
    var cargoMap = {
        5: "Alumno"};
    $.ajax({
        url: buscarUsuario_route,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log('Datos recibidos:', data);
            var tbody = $('#usuarios-tbody');
            tbody.empty();
            data.forEach(function(usuario) {
                var cargo = cargoMap[usuario.Tipo_Id];
                var canShow = usuario.Tipo_Id === 5;
                if (canShow) {
                    var row = `
                        <tr>
                            <td class="text-center">${usuario.usuario1}</td>
                            <td class="text-center">${cargo}</td>
                            <td class="text-center">${usuario.correo}</td>
                            <td class="text-center">${usuario.matricula}</td>
                            <td class="text-center">
                                <button class="btn-delete" data-id="${usuario.Id_Usuario}"><i class="fas fa-trash"></i></button>
                                <button class="btn-view"><i class="bi bi-eye"></i></button>
                     </td>
                        </tr>
                    `;
                    
                    tbody.append(row);
                }
            });
            $('.btn-delete').on('click', function() {
                var userId = $(this).data('id');
                deleteUser(userId);
            });
            buscador();
        },
        error: function(error) {
            console.error('Error obteniendo los datos:', error);
        }
    });
}

function loadDicaA() {
    var currentPage = 1;
    var pageSize = 10;
    var totalMaterials = 0;
    var filteredData = [];
    var allData = [];

    function loadData(page) {
        var startIndex = (page - 1) * pageSize;
        var endIndex = startIndex + pageSize;

        // Filtrar los datos antes de paginar
        var dataToDisplay = filteredData.length > 0 ? filteredData.slice(startIndex, endIndex) : allData.slice(startIndex, endIndex);

        var tbody = $('#inventory-tbody');
        tbody.empty();
        dataToDisplay.forEach(function(inventory) {
            var row = `
                <tr>
                    <td class="text-center">
                        <button class="btn-add">En Inventario</button>
                        <br>
                        <button class="btn-checked" data-id="${inventory.Id_Material}">En Mantenimiento</button>
                    </td>
                    <td class="text-center">${inventory.nombre}</td>
                    <td class="text-center">${inventory.Area}</td>
                    <td class="text-center">${inventory.descripcion}</td>
                    <td class="text-center">${inventory.Codigo_de_Inventario}</td>
                    <td class="text-center">${inventory.num_serie}</td>
                    <td class="text-center">${inventory.cantidad_existencia}</td>
                    <td class="text-center">${inventory.ubicacion}</td>
                    <td class="text-center">${inventory.Estado}</td>
                    <td class="text-center">${inventory.fecha}</td>
                    <td class="text-center">
                        <a href="views/Admin_Views/Inventory_Views/inventoryEditOverview.html?id=${inventory.Id_Material}">
                            <button class="btn-edit"><i class="fas fa-edit"></i></button>
                        </a>
                        <button class="btn-delete" data-id="${inventory.Id_Material}"><i class="fas fa-trash"></i></button>
                        <a href="views/Admin_Views/Inventory_Views/inventoryEditOverview.html?id=${inventory.Id_Material}">
                        <button class="btn-view" data-id="${inventory.Id_Material}"><i class="bi bi-eye"></i></button>
                        </a>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });

        // Event listener for the mark as maintenance button
        $('.btn-checked').on('click', function() {
            var materialId = $(this).data('id');
            markAsMaintenance(materialId);
        });

        // Event listener for the mark as inventory button
        $('.btn-add').on('click', function() {
            var materialId = $(this).closest('tr').find('.btn-checked').data('id');
            markAsInventory(materialId);
        });

        $('.btn-delete').on('click', function() {
            var materialId = $(this).data('id');
            deleteMaterial(materialId);
        });

        $('#page-counter').text(`Página ${currentPage} de ${Math.ceil(filteredData.length > 0 ? filteredData.length / pageSize : totalMaterials / pageSize)}`);
        updateNavigationButtons();
    }

    function markAsMaintenance(materialId) {
        $.ajax({
            url: `https://vaelsaki.bsite.net/api/materiales/marcarcomoenmantenimiento/${materialId}`,
            method: 'PUT',
            success: function() {
                alert('Producto marcado como en mantenimiento');
                loadData(currentPage);
            },
            error: function(error) {
                console.error('Error al marcar el producto como en mantenimiento:', error);
                alert('Error al marcar el producto como en mantenimiento');
            }
        });
    }

    function markAsInventory(materialId) {
        $.ajax({
            url: `https://vaelsaki.bsite.net/api/materiales/marcarcomoeninventario/${materialId}`,
            method: 'PUT',
            success: function() {
                alert('Producto marcado como en inventario');
                loadData(currentPage);
            },
            error: function(error) {
                console.error('Error al marcar el producto como en inventario:', error);
                alert('Error al marcar el producto como en inventario');
            }
        });
    }

    function updateNavigationButtons() {
        if (currentPage === 1) {
            $('#prev-page-btn').prop('disabled', true);
        } else {
            $('#prev-page-btn').prop('disabled', false);
        }

        if (currentPage === Math.ceil(filteredData.length > 0 ? filteredData.length / pageSize : totalMaterials / pageSize)) {
            $('#next-page-btn').prop('disabled', true);
        } else {
            $('#next-page-btn').prop('disabled', false);
        }
    }

    $('#prev-page-btn').on('click', function() {
        if (currentPage > 1) {
            currentPage--;
            loadData(currentPage);
        }
    });

    $('#next-page-btn').on('click', function() {
        if (currentPage < Math.ceil(filteredData.length > 0 ? filteredData.length / pageSize : totalMaterials / pageSize)) {
            currentPage++;
            loadData(currentPage);
        }
    });

    function applyFilter(searchTerm) {
        if (searchTerm) {
            filteredData = allData.filter(function(item) {
                return Object.values(item).some(function(value) {
                    return String(value).toLowerCase().includes(searchTerm.toLowerCase());
                });
            });
        } else {
            filteredData = [];
        }
        currentPage = 1;
        loadData(currentPage);
    }

    $('#searchInput').on('input', function() {
        var searchTerm = $(this).val();
        applyFilter(searchTerm);
    });

    
        $.ajax({
        url: ObtenerDicaA_route,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            allData = data;
            totalMaterials = data.length;
            loadData(currentPage);
        },
        error: function(error) {
            console.error('Error obteniendo los datos:', error);
        }
    });
}

function deleteMaterial(materialId) {
    if (confirm('¿Estás seguro de que deseas eliminar este material?')) {
        $.ajax({
            url: `${Delete_Material_route}/${materialId}`,
            method: 'DELETE',
            success: function(response) {
                console.log('Material eliminado:', response);
                location.reload();

            },
            error: function(xhr, status, error) {
                if (xhr.status === 409) {
                    alert('No se puede eliminar el grupo porque hay solicitudes asociadas a él.');
                } else {
                    console.error('Error eliminando el grupo:', error);
                }
            }
        });
    }
}

function loadDicaB() {
    var currentPage = 1;
    var pageSize = 10;
    var totalMaterials = 0;
    var filteredData = [];
    var allData = [];

    function loadData(page) {
        var startIndex = (page - 1) * pageSize;
        var endIndex = startIndex + pageSize;

        // Filtrar los datos antes de paginar
        var dataToDisplay = filteredData.length > 0 ? filteredData.slice(startIndex, endIndex) : allData.slice(startIndex, endIndex);

        var tbody = $('#inventory-tbody');
        tbody.empty();
        dataToDisplay.forEach(function(inventory) {
            var row = `
                <tr>
                    <td class="text-center">
                        <button class="btn-add">En Inventario</button>
                        <br>
                        <button class="btn-checked" data-id="${inventory.Id_Material}">En Mantenimiento</button>
                    </td>
                    <td class="text-center">${inventory.nombre}</td>
                    <td class="text-center">${inventory.Area_Nombre}</td>
                    <td class="text-center">${inventory.descripcion}</td>
                    <td class="text-center">${inventory.Codigo_de_Inventario}</td>
                    <td class="text-center">${inventory.cantidad_existencia}</td>
                    <td class="text-center">${inventory.Estado}</td>
                    <td class="text-center">${inventory.fecha}</td>
                    <td class="text-center">
                        <a href="views/Admin_Views/Inventory_Views/inventoryEditOverview.html?id=${inventory.Id_Material}">
                            <button class="btn-edit"><i class="fas fa-edit"></i></button>
                        </a>
                        <button class="btn-delete" data-id="${inventory.Id_Material}"><i class="fas fa-trash"></i></button>
                        <button class="btn-view"><i class="bi bi-eye"></i></button>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });

        // Event listener for the mark as maintenance button
        $('.btn-checked').on('click', function() {
            var materialId = $(this).data('id');
            markAsMaintenance(materialId);
        });

        // Event listener for the mark as inventory button
        $('.btn-add').on('click', function() {
            var materialId = $(this).closest('tr').find('.btn-checked').data('id');
            markAsInventory(materialId);
        });

        $('.btn-delete').on('click', function() {
            var materialId = $(this).data('id');
            deleteMaterial(materialId);
        });

        $('#page-counter').text(`Página ${currentPage} de ${Math.ceil(filteredData.length > 0 ? filteredData.length / pageSize : totalMaterials / pageSize)}`);
        updateNavigationButtons();
    }

    function markAsMaintenance(materialId) {
        $.ajax({
            url: `https://vaelsaki.bsite.net/api/materiales/marcarcomoenmantenimiento/${materialId}`,
            method: 'PUT',
            success: function() {
                alert('Producto marcado como en mantenimiento');
                loadData(currentPage); // Recargar los datos para reflejar el cambio
            },
            error: function(error) {
                console.error('Error al marcar el producto como en mantenimiento:', error);
                alert('Error al marcar el producto como en mantenimiento');
            }
        });
    }

    function markAsInventory(materialId) {
        $.ajax({
            url: `https://vaelsaki.bsite.net/api/materiales/marcarcomoeninventario/${materialId}`,
            method: 'PUT',
            success: function() {
                alert('Producto marcado como en inventario');
                loadData(currentPage); // Recargar los datos para reflejar el cambio
            },
            error: function(error) {
                console.error('Error al marcar el producto como en inventario:', error);
                alert('Error al marcar el producto como en inventario');
            }
        });
    }

    function updateNavigationButtons() {
        if (currentPage === 1) {
            $('#prev-page-btn').prop('disabled', true);
        } else {
            $('#prev-page-btn').prop('disabled', false);
        }

        if (currentPage === Math.ceil(filteredData.length > 0 ? filteredData.length / pageSize : totalMaterials / pageSize)) {
            $('#next-page-btn').prop('disabled', true);
        } else {
            $('#next-page-btn').prop('disabled', false);
        }
    }

    $('#prev-page-btn').on('click', function() {
        if (currentPage > 1) {
            currentPage--;
            loadData(currentPage);
        }
    });

    $('#next-page-btn').on('click', function() {
        if (currentPage < Math.ceil(filteredData.length > 0 ? filteredData.length / pageSize : totalMaterials / pageSize)) {
            currentPage++;
            loadData(currentPage);
        }
    });

    function applyFilter(searchTerm) {
        if (searchTerm) {
            filteredData = allData.filter(function(item) {
                return Object.values(item).some(function(value) {
                    return String(value).toLowerCase().includes(searchTerm.toLowerCase());
                });
            });
        } else {
            filteredData = [];
        }
        currentPage = 1;
        loadData(currentPage);
    }

    $('#searchInput').on('input', function() {
        var searchTerm = $(this).val();
        applyFilter(searchTerm);
    });

    $.ajax({
        url: ObtenerDicaB_route,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            allData = data;
            totalMaterials = data.length;
            loadData(currentPage);
        },
        error: function(error) {
            console.error('Error obteniendo los datos:', error);
        }
    });
}
// Función para cargar las solicitudes y configurar eventos de los botones
function loadRequests() {
    $.ajax({
        url: VerSolicitud_route,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log('Datos recibidos:', data);
            var tbody = $('#requests-tbody');
            tbody.empty();
            data.forEach(function(request) {
                var entregado = (new Date(request.Hora_de_entrada).getFullYear() === 1900) ? "No" : "Sí";
                var row = `
                    <tr>
                        <td class="text-center">${request.Nombre}</td>
                        <td class="text-center">${request.Fecha}</td>
                        <td class="text-center">${request.Carrera}</td>
                        <td class="text-center">${request.Taller}</td>
                        <td class="text-center">${request.Grupo}</td>
                        <td class="text-center">${request.Cantidad}</td>
                        <td class="text-center">${request.Fecha_de_cumplimiento}</td>
                        <td class="text-center">${entregado}</td>
                        <td class="text-center">
                            <button class="btn-view" data-id="${request.Id_Solicitud}"><i class="bi bi-eye"></i></button>
                            <button class="btn-edit" data-id="${request.Id_Solicitud}" ${entregado === "Sí" ? 'disabled' : ''}><i class="bi bi-check"></i></button>
                        </td>
                    </tr>
                `;
                tbody.append(row);
            });

            // Evento para el botón de vista previa
            $('.btn-view').on('click', function() {
                var idSolicitud = $(this).data('id');
                viewRequest(idSolicitud);
            });

            $('.btn-edit').on('click', markAsDelivered);
            buscador();
        },
        error: function(error) {
            console.error('Error obteniendo los datos:', error);
        }
    });
}

// Función para mostrar el modal con los detalles de la solicitud
function viewRequest(idSolicitud) {
    $.ajax({
        url: `${VerSolicitud_route}/${idSolicitud}`,
        method: 'GET',
        dataType: 'json',
        success: function(request) {
            // Crear el contenido del modal
            var modalContent = `
                <p><strong>Nombre:</strong> ${request.Nombre}</p>
                <p><strong>Fecha:</strong> ${request.Fecha}</p>
                <p><strong>Carrera:</strong> ${request.Carrera}</p>
                <p><strong>Taller:</strong> ${request.Taller}</p>
                <p><strong>Grupo:</strong> ${request.Grupo}</p>
                <p><strong>Cantidad:</strong> ${request.Cantidad}</p>
                <p><strong>Fecha de Cumplimiento:</strong> ${request.Fecha_de_cumplimiento}</p>
                <p><strong>Entregado:</strong> ${(new Date(request.Hora_de_entrada).getFullYear() === 1900) ? "No" : "Sí"}</p>
            `;

            // Mostrar el modal
            var modal = document.getElementById("toolsModal");
            document.getElementById("partialViewContent").innerHTML = modalContent;
            modal.style.display = "block";

            // Cerrar el modal
            var span = document.getElementsByClassName("close")[0];
            span.onclick = function() {
                modal.style.display = "none";
            }

            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }
        },
        error: function(error) {
            console.error('Error obteniendo los datos de la solicitud:', error);
        }
    });
}

function markAsDelivered() {
    var requestId = $(this).data('id');
    if (confirm("¿Estás seguro de que quieres marcar esta solicitud como entregada?")) {
        $.ajax({
            url: `https://vaelsaki.bsite.net/api/Sol_materiales/MarcarComoEntregado/${requestId}`,
            method: 'PUT',
            success: function(response) {
                alert('Solicitud marcada como entregada exitosamente.');
                loadRequests();
            },
            error: function(error) {
                console.error('Error marcando la solicitud como entregada:', error);
                alert('Error al marcar la solicitud como entregada.');
            }
        });
    }
}
function loadAvisos() {
    $.ajax({
        url: ObtenerAvisos_route, 
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log('Datos recibidos:', data); 
            var tbody = $('#notification');
            tbody.empty(); 
            data.forEach(function(avisos) {
                var row = `
                <tr>
                    <td class="text-center">${avisos.Titulo}</td>
                    <td class="text-center">${avisos.Descripcion}</td>
                    <td class="text-center">${avisos.Fecha}</td>
                    <td class="text-center">
                        <a href="views/Admin_Views/Notifications_views/avisosEditOverview.html?id=${avisos.Id}">
                            <button class="btn-edit"><i class="fas fa-edit"></i></button>
                        </a>
                        <button class="btn-delete" data-id="${avisos.Id}"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
                `;
                tbody.append(row);
            });

            $('#notification').on('click', '.btn-delete', function() {
                var id = $(this).data('id');
                eliminarAvisos(id);
            });

            buscador();
        },
        error: function(error) {
            console.error('Error obteniendo los datos:', error);
        }
    });
}
function obtenerIds(){

}
// Modificar checkSession para obtener el ID del usuario
function getUserIdFromSession() {
    const session = sessionStorage.getItem('usuario');
    if (!session) {
        console.log('La sesión no está iniciada.');
        return null;
    }

    const usuario = JSON.parse(session);
    if (usuario && usuario.Id_Usuario) {
        return usuario.Id_Usuario;
    } else {
        console.log('No se encontró el ID del usuario en la sesión.');
        return null;
    }
}
function loadAvisos2() {
    // Obtener el ID del usuario actual desde la sesión
    var currentUserId = getUserIdFromSession();
    
    if (!currentUserId) {
        console.log('No se puede obtener el ID del usuario actual. No se mostrarán avisos.');
        return;
    }

    // Función para obtener y filtrar los avisos con el ID de usuario actual
    function fetchAndFilterAvisos(currentUserId) {
        return $.ajax({
            url: ObtenerAvisos_route, // Ruta para obtener los avisos
            method: 'GET',
            dataType: 'json'
        }).then(function(data) {
            console.log('Datos de avisos recibidos:', data); // Verifica que los datos se reciban correctamente

            var tbody = $('#notification');
            tbody.empty(); // Asegúrate de que esté vacío antes de agregar nuevos datos
            if (!Array.isArray(data)) {
                console.error('Datos recibidos no son un array:', data);
                return;
            }

            // Filtrar los avisos para mostrar solo aquellos que contienen el ID del usuario actual
            var filteredData = data.filter(function(avisos) {
                // Verifica que `avisos.UsuarioIds` sea un array
                if (Array.isArray(avisos.UsuarioIds)) {
                    // Verificar si el ID del usuario actual está en el array `UsuarioIds` del aviso
                    return avisos.UsuarioIds.includes(currentUserId);
                }
                return false; // No mostrar el aviso si no tiene IDs de usuarios relacionados
            });

            // Si no hay datos filtrados, muestra un mensaje de depuración
            if (filteredData.length === 0) {
                console.log('No hay avisos para mostrar.');
            }

            // Agregar cada aviso al contenedor
            filteredData.forEach(function(avisos) {
                var row = `
                <div class="container">
                    <div class="field">
                        <strong>Título:</strong>
                        <span>${avisos.Titulo}</span>
                    </div>
                    <div class="field">
                        <strong>Descripción:</strong>
                        <span>${avisos.Descripcion}</span>
                    </div>
                    <div class="field">
                        <strong>Fecha:</strong>
                        <span>${avisos.Fecha}</span>
                    </div>
                </div>
                `;
                tbody.append(row); // Agrega los datos al contenedor
                sendNotification(avisos.Titulo, avisos.Descripcion); // Enviar notificación
            });
        }).catch(function(error) {
            console.error('Error obteniendo los avisos:', error);
        });
    }

    // Obtener y filtrar los avisos usando el ID del usuario actual
    fetchAndFilterAvisos(currentUserId);
}

var selectedUserIds = []; 
function aplicarSeleccion() {
    selectedUserIds = [];
    $('#userList .user-checkbox:checked').each(function() {
        selectedUserIds.push($(this).val()); // Obtén el ID del usuario seleccionado
    });
    console.log('IDs de usuarios seleccionados:', selectedUserIds);
}


$(document).ready(function() {
    $('#userModal').on('show.bs.modal', function () {
        userlist();
    });
});

function userlist() {
    var cargoMap = {
        1: 'Administrador',
        2: 'Encargado General',
        3: 'Encargado Mantenimiento Industrial',
        4: 'Encargado Mecatrónica',
        5: 'Alumno'
    };
    $.ajax({
        url: buscarUsuario_route,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log('Datos recibidos:', data);
            var filteredData = data.filter(function(usuario) {
                return usuario.Tipo_Id !== 1; 
            });
            filteredData.sort(function(a, b) {
                return a.Tipo_Id - b.Tipo_Id;
            });
            var list = $('#userList');
            list.empty();
            filteredData.forEach(function(usuario) {
                var cargo = cargoMap[usuario.Tipo_Id];
                var item = `
                    <div class="list-group-item">
                        <input type="checkbox" class="user-checkbox" value="${usuario.Id_Usuario}"> ${usuario.usuario1} (${cargo})
                    </div>
                `;
                list.append(item);
            });

            $('#searchUser').on('keyup', function() {
                var searchTerm = $(this).val().toLowerCase();
                $('#userList .list-group-item').each(function() {
                    var userName = $(this).text().toLowerCase();
                    if (userName.includes(searchTerm)) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            });
        },
        error: function(error) {
            console.error('Error obteniendo los datos:', error);
        }
    });
}
function selectAllUsers() {
    $('#userList .user-checkbox').prop('checked', true);
}
$(document).ready(function() {
    $('#userModal').on('show.bs.modal', function () {
        userlist();
    });
});

function eliminarAvisos(id) {
    $.ajax({
        url: EliminarAviso_route + '/' + id,
        type: 'DELETE',
        dataType: 'json',
        success: function(data) {
            console.log('Aviso eliminado:', data);
            loadAvisos();
        },
        error: function(error) {
            if (error.responseJSON && error.responseJSON.error === 'ConstraintError') {
                alert('No se puede eliminar el aviso porque hay solicitudes asociadas.');
            } else {
                console.error('Error eliminando el aviso:', error);
            }
        }
    });
}

function editarAviso(avisosData) {
    $.ajax({
        url: EditarAviso_route,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(avisosData),
        success: function(response) {
            console.log('Aviso editado exitosamente:', response);

            alert('Aviso editado exitosamente');
        },
        error: function(error) {
            console.error('Error al editar el aviso:', error);
            alert('Error al editar el aviso');
        }
    });
}

function postAviso() {
    let selectedUserIds = [];
    $('#userList .user-checkbox:checked').each(function() {
        selectedUserIds.push(parseInt($(this).val(), 10)); 
    });

    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const fecha = document.getElementById('fecha').value;
    const avisoData = {
        Titulo: titulo,
        Descripcion: descripcion,
        Fecha: fecha,
        UsuarioIds: selectedUserIds 
    };
    $.ajax({
        url: EnviarAviso_route,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(avisoData),
        success: function(response) {
            console.log('Aviso creado:', response);
            alert('Aviso creado con éxito');
        },
        error: function(error) {
            console.error('Error al crear el aviso:', error);
            alert('Error al crear el aviso');
        }
    });
}

function obtenerIdDeAvisoDesdeUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const avisoId = urlParams.get('id');
    console.log('ID de aviso obtenido desde la URL:', avisoId); // Verificar si el ID es correcto
    return avisoId;
}

function cargarDatosDeAviso() {
    const avisoId = obtenerIdDeAvisoDesdeUrl();
    if (!avisoId) {
        console.error('ID de aviso no encontrado en la URL');
        return;
    }

    $.ajax({
        url: `${ObtenerAviso_route}/${avisoId}`,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            // Verifica si la respuesta es un array y si contiene datos
            if (Array.isArray(data) && data.length > 0) {
                const aviso = data[0]; // Obtener el primer elemento de la lista
                console.log('Datos del aviso:', aviso); // Verificar los datos recibidos
                // Asignar los datos a los campos del formulario
                document.getElementById('avisoId').value = aviso.Id || avisoId;
                document.getElementById('titulo').value = aviso.Titulo || '';
                document.getElementById('descripcion').value = aviso.Descripcion || '';
                document.getElementById('fecha').value = aviso.Fecha || '';
            } else {
                console.error('No se encontraron datos del aviso');
                alert('No se encontraron datos del aviso');
            }
        },
        error: function(error) {
            console.error('Error al obtener los datos del aviso:', error);
            alert('Error al cargar los datos del aviso');
        }
    });
}

function putAviso() {
    const avisoId = document.getElementById('avisoId').value;
    const titulo = document.getElementById('titulo').value;

    const avisoData = {
        Id: avisoId,
        Titulo: titulo,
        Descripcion: descripcion,
    };

    $.ajax({
        url: `${EditarAviso_route}/${avisoId}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(avisoData),
        success: function(response) {
            console.log('Aviso actualizado:', response);
            alert('Aviso actualizado con éxito');
            // Redireccionar o actualizar la página según sea necesario
        },
        error: function(error) {
            console.error('Error al actualizar el aviso:', error);
            alert('Error al actualizar el aviso');
        }
    });
}

function loadGroups() {
    $.ajax({
        url: ObtenerGrupos_route,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log('Datos recibidos:', data);
            var tbody = $('#group-tbody');
            tbody.empty();
            data.forEach(function(group) {
                var row = `
                    <tr>
                        <td class="text-center">${group.nombre}</td>
                        <td class="text-center">
                            <a href="views/Admin_Views/Groups_Views/groupsEditOverview.html?id=${group.Id_Grupo}"><button class="btn-edit"><i class="fas fa-edit"></i></button></a>
                            <button class="btn-delete" data-id="${group.Id_Grupo}"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
                tbody.append(row);
            });

            // Agregar manejador de eventos para botones de eliminación
            $('.btn-delete').on('click', function() {
                var groupId = $(this).data('id');
                deleteGrupo(groupId);
            });
            buscador();
        },
        error: function(error) {
            console.error('Error obteniendo los datos:', error);
        }
    });
}

function postGrupo() {
    const grupoData = {
        nombre: document.getElementById("grupo").value
    };

    $.ajax({
        url: InsertarGrupo_route,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(grupoData),
        success: function(response) {
            alert('Grupo creado exitosamente');
        },
        error: function(error) {
            console.error('Error al crear el grupo:', error);
        }
    });
}

function getGrupoIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function cargarDatosGrupo() {
    const grupoId = getGrupoIdFromUrl();
    if (!grupoId) {
        console.error('ID del grupo no encontrado en la URL');
        return;
    }
    console.log(ObtenerGrupo_route + grupoId);
    $.ajax({
        url: `${ObtenerGrupo_route}/${grupoId}`,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log('Datos del grupo:', data);
            document.getElementById('grupo').value = data.nombre;
            document.getElementById('grupoId').value = grupoId;
        },
        error: function(error) {
            console.error('Error al obtener los datos del grupo:', error);
        }
    });
}

function putGrupo() {
    const grupoId = document.getElementById('grupoId').value;
    const grupoData = {
        id_grupo: parseInt(grupoId),
        nombre: document.getElementById('grupo').value
    };

    $.ajax({
        url: EditarGrupo_route + grupoId,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(grupoData),
        success: function(response) {
            alert('Grupo editado exitosamente');
        },
        error: function(xhr, status, error) {
            console.error('Error al editar el grupo:', error);
        }
    });
}

function deleteGrupo(groupId) {
    if (confirm('¿Estás seguro de que deseas eliminar este grupo?')) {
        $.ajax({
            url: `${Eliminargrupo_route}/${groupId}`,
            method: 'DELETE',
            success: function(response) {
                console.log('Grupo eliminado:', response);
                loadGroups();
            },
            error: function(xhr, status, error) {
                if (xhr.status === 409) { // Assuming 409 Conflict for constraint errors
                    alert('No se puede eliminar el grupo porque hay solicitudes asociadas a él.');
                } else {
                    console.error('Error eliminando el grupo:', error);
                }
            }
        });
    }
}

function loadDepartamentos() {
    $.ajax({
        url: ObtenerDptos_route, 
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log('Datos recibidos:', data); 
            var tbody = $('#departamento-tbody');
            tbody.empty(); 
            data.forEach(function(departamento) {
                var row = `
                <tr>
                    <td class="text-center">${departamento.Departamento1}</td>
                    <td class="text-center">
                        <a href="views/Admin_Views/Dpto_Views/departamentoEditOverview.html?id=${departamento.Id_Departamento}">
                            <button class="btn-edit"><i class="fas fa-edit"></i></button>
                        </a>
                        <button class="btn-delete" data-id="${departamento.Id_Departamento}"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
                `;
                tbody.append(row);
            });

            $('#departamento-tbody').on('click', '.btn-delete', function() {
                var id = $(this).data('id');
                eliminardpto(id);
            });

            buscador();
        },
        error: function(error) {
            console.error('Error obteniendo los datos:', error);
        }
    });
}

function getDepartamentoIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function cargarDatosdpto() {
    const dptoId = getDepartamentoIdFromUrl();
    if (!dptoId) {
        console.error('ID del grupo no encontrado en la URL');
        return;
    }
    console.log(ObtenerDpto_route + dptoId);
    $.ajax({
        url: `${ObtenerDpto_route}/${dptoId}`,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log('Datos del grupo:', data);
            document.getElementById('dpto').value = data.Departamento1;
            document.getElementById('dptoId').value = dptoId;
        },
        error: function(error) {
            console.error('Error al obtener los datos del grupo:', error);
        }
    });
}

function putDpto() {
    const dptoId = document.getElementById('dptoId').value;
    const dptoData = {
        id_dpto: parseInt(dptoId),
        Departamento1: document.getElementById('dpto').value
    };

    $.ajax({
        url: EditarDepartamento_route + dptoId,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(dptoData),
        success: function(response) {
            alert('Grupo editado exitosamente');
        },
        error: function(xhr, status, error) {
            console.error('Error al editar el grupo:', error);
        }
    });
}

function eliminardpto(dptoId) {
    if (confirm('¿Estás seguro de que deseas eliminar este departamento?')) {
        $.ajax({
            url: `${EliminarDpto_route}/${dptoId}`,
            method: 'DELETE',
            success: function(response) {
                console.log('Departamento eliminado:', response);
                loadDepartamentos();
            },
            error: function(xhr, status, error) {
                if (xhr.status === 409) { // Assuming 409 Conflict for constraint errors
                    alert('No se puede eliminar el departamento porque hay solicitudes asociadas a él.');
                } else {
                    console.error('Error eliminando el departamento:', error);
                }
            }
        });
    }
}

function postDpto() {
    const dptoData = {
        Departamento1: document.getElementById("dpto").value
    };

    $.ajax({
        url: InsertarDpto_route,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(dptoData),
        success: function(response) {
            alert('Departamento creado exitosamente');
        },
        error: function(error) {
            console.error('Error al crear el departamento:', error);
        }
    });
}

// Historiales

function redirectToHistorial() {
    const session = sessionStorage.getItem('usuario');
    const usuario = JSON.parse(session);
    if (usuario) {
        const url = `views/Apprestamo/historial.html?id=${usuario.Id_Usuario}`;
        window.location.href = url;
    } else {
        alert('Error: Id_Usuario no encontrado.');
    }
}

//Notificaciones del celular
function sendNotification(title, text) {
    cordova.plugins.notification.local.schedule({
        title: title,
        text: text,
        foreground: true 
    }, function() {
        console.log('Notificación enviada');
    });
}
document.addEventListener('deviceready', function() {
    function sendNotification(title, message) {
        cordova.plugins.notification.local.schedule({
            title: title,
            text: message,
            foreground: true  
        });
    }
    sendNotification('Título de la notificación', 'Cuerpo de la notificación');

    function loadAvisos2() {
        $.ajax({
            url: ObtenerAvisos_route, // URL para obtener los avisos
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                console.log('Datos recibidos:', data);
                var filteredData = data.filter(function(avisos) {
                    if (selectedUserIds.length === 0) {
                        return true;
                    }
                    return selectedUserIds.includes(avisos.Id);
                });

                console.log('Datos filtrados:', filteredData);
                filteredData.forEach(function(avisos) {
                    sendNotification(avisos.Titulo, avisos.Descripcion);
                });
            },
            error: function(error) {
                console.error('Error obteniendo los datos:', error);
            }
        });
    }
    loadAvisos2();
});


//Graficas de herrameintas
function graficaherramientas() {
    const modal = document.getElementById('toolsModal');
    const btn = document.getElementById('recent-tools-button');
    const span = document.getElementsByClassName('close')[0];
    const partialViewContent = document.getElementById('partialViewContent');
  
    btn.onclick = function() {
      modal.style.display = 'block';
      cargarVistaParcial();
    }
  
    span.onclick = function() {
      modal.style.display = 'none';
    }
  
    window.onclick = function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    }
  
    function cargarVistaParcial() {
      fetch('views/Admin_Views/Grafic_Views/grafica.html')
        .then(response => response.text())
        .then(data => {
          partialViewContent.innerHTML = data;
  
          const scriptTags = partialViewContent.querySelectorAll('script');
          scriptTags.forEach((script) => {
            const newScript = document.createElement('script');
            newScript.textContent = script.textContent;
            document.body.appendChild(newScript).parentNode.removeChild(newScript);
          });
        })
        .catch(error => console.error('Error loading the partial view:', error));
    }
  }
  
  document.addEventListener('DOMContentLoaded', graficaherramientas);

  function GraficaDicaA(){
    const modal = document.getElementById('toolsModal');
    const btn = document.getElementById('recent-tools-button');
    const span = document.getElementsByClassName('close')[0];
    const partialViewContent = document.getElementById('partialViewContent');
  
    btn.onclick = function() {
      modal.style.display = 'block';
      cargarVistaParcial();
    }
  
    span.onclick = function() {
      modal.style.display = 'none';
    }
  
    window.onclick = function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    }
  
    function cargarVistaParcial() {
      fetch('views/Admin_Views/Grafic_Views/dicaA.html')
        .then(response => response.text())
        .then(data => {
          partialViewContent.innerHTML = data;
  
          const scriptTags = partialViewContent.querySelectorAll('script');
          scriptTags.forEach((script) => {
            const newScript = document.createElement('script');
            newScript.textContent = script.textContent;
            document.body.appendChild(newScript).parentNode.removeChild(newScript);
          });
        })
        .catch(error => console.error('Error loading the partial view:', error));
    }

  }
  function GraficaDicaB(){
    const modal = document.getElementById('toolsModal');
    const btn = document.getElementById('recent-tools-button');
    const span = document.getElementsByClassName('close')[0];
    const partialViewContent = document.getElementById('partialViewContent');
  
    btn.onclick = function() {
      modal.style.display = 'block';
      cargarVistaParcial();
    }
  
    span.onclick = function() {
      modal.style.display = 'none';
    }
  
    window.onclick = function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    }
  
    function cargarVistaParcial() {
      fetch('views/Admin_Views/Grafic_Views/dicaB.html')
        .then(response => response.text())
        .then(data => {
          partialViewContent.innerHTML = data;
            const scriptTags = partialViewContent.querySelectorAll('script');
          scriptTags.forEach((script) => {
            const newScript = document.createElement('script');
            newScript.textContent = script.textContent;
            document.body.appendChild(newScript).parentNode.removeChild(newScript);
          });
        })
        .catch(error => console.error('Error loading the partial view:', error));
    }

  }
  


