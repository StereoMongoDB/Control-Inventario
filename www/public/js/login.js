function login(){

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const token = grecaptcha.getResponse();

    if (!token) {
        alert('Por favor, verifica que no eres un robot.');
        return;
    }

    const formData = new FormData(event.target);
    const usuario = formData.get('usuario');
    const contraOriginal = formData.get('contra');
    const contraDesencriptada = CryptoJS.SHA256(contraOriginal).toString(CryptoJS.enc.Hex);

    fetch(buscarUsuario_route)
        .then(response => {
            if (!response.ok) {
                throw new Error('La solicitud falló');
            }
            return response.json();
        })
        .then(data =>{
            const usuarioEncontrado = data.find(user => user.usuario1 === usuario && user.contra === contraDesencriptada);
            if (usuarioEncontrado) {
                sessionStorage.setItem("usuario", JSON.stringify(usuarioEncontrado));
                console.log('Usuario guardado en sessionStorage:', JSON.parse(sessionStorage.getItem("usuario")));
                console.log('Tipo ID:', usuarioEncontrado.tipo_id);
				location.href ='admin.html';
            } else {
                console.log('Credenciales inválidas');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
}
login();