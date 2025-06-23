function checkSession() {
    const session = sessionStorage.getItem('usuario');
    const adminViews = 'views/Admin_Views/'
    const Groups_Views = [adminViews + 'Groups_Views/groupsAddOverview.html', adminViews + 'Groups_Views/groupsEditOverview.html']
    const loc = 'views/Apprestamo/init.html';
    const allowedPages = ['index.html', loc];
    const adminPages = ['admin.html', ...Groups_Views];

    const currentPage = location.pathname;

    if (!session && !allowedPages.includes(currentPage)) {
        console.log('La sesión no está iniciada o se está accediendo desde una página diferente a index.html o init.html.');
        console.log('Redirigiendo a index.html');
        location.href = 'index.html';
    } else if (session) {
        console.log('Sesión iniciada.');

        const usuario = JSON.parse(session);
        console.log('tipo_id del usuario:', usuario.Tipo_Id);
        console.log('id del usuario:', usuario.Id_Usuario);

        if (usuario.Tipo_Id > 4 && adminPages.includes(currentPage)) {
            console.log('Usuario no autorizado para acceder a esta página. Redirigiendo a init.html');
            location.href = 'init.html'
        }
    } else {
        console.log('La sesión no está iniciada.');
        console.log('Permaneciendo en index.html o página permitida sin sesión.');
    }
};
checkSession();