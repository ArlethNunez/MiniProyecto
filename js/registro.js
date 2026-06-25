document.getElementById('formRegistro').addEventListener('submit', function(e) {
    e.preventDefault();

    const usuario = {
        nombre: document.getElementById('nombre').value.trim(),
        correo: document.getElementById('correo').value.trim(),
        contrasena: document.getElementById('contrasena').value.trim()
    };

    localStorage.setItem('usuario', JSON.stringify(usuario));
    alert('¡Cuenta creada exitosamente!');
    window.location.href = 'login.html';
});