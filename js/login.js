document.getElementById('formLogin').addEventListener('submit', function(e) {
    e.preventDefault();

    const correo = document.getElementById('correo').value.trim();
    const contrasena = document.getElementById('contrasena').value.trim();
    const mensaje = document.getElementById('mensajeError');

    // Busca el usuario guardado en localStorage
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'));

    if (!usuarioGuardado) {
        mensaje.textContent = 'No hay ninguna cuenta registrada.';
        mensaje.style.display = 'block';
        return;
    }

    if (usuarioGuardado.correo === correo && usuarioGuardado.contrasena === contrasena) {
        // Login exitoso — guarda sesión y redirige
        localStorage.setItem('sesionActiva', 'true');
        window.location.href = 'index.html';
    } else {
        mensaje.textContent = 'Correo o contraseña incorrectos.';
        mensaje.style.display = 'block';
    }
});
