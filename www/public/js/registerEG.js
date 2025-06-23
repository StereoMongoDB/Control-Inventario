$(document).ready(function() {
    $('#regForm').submit(function(event) {
        event.preventDefault();
        register();
    });
});

async function register() {
    const nombre = document.getElementById('nombre').value;
    const primerApellido = document.getElementById('primer_apellido').value;
    const segundoApellido = document.getElementById('segundo_apellido').value;
    const apellido = primerApellido + ' ' + segundoApellido;
    const matricula = document.getElementById('matricula').value;
    const correo = document.getElementById('correo').value;
    const usuario1 = document.getElementById('usuario1').value;
    const contra = document.getElementById('contra').value;

    console.log('Datos a enviar:', {
        usuario1: usuario1,
        contra: contra,
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        matricula: matricula
    });

    try {
        const response = await fetch(agregarUsuarioEG_route, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario1: usuario1,
                contra: contra,
                nombre: nombre,
                apellido: apellido,
                correo: correo,
                matricula: matricula
            })
        });

        if (response.ok) {
            alert("¡Registro exitoso!");
            window.location.href = '../../../admin.html';
        } else {
            const errorData = await response.json();
            alert('Error: ' + errorData.message);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}
