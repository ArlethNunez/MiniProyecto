document.getElementById('formRegistro').addEventListener('submit', function(e) {
    e.preventDefault();

    const usuario = {
        nombre: document.getElementById('nombre').value.trim(),
        correo: document.getElementById('correo').value.trim(),
        contrasena: document.getElementById('contrasena').value.trim()
    };

    const carrera = document.getElementById('carrera').value.trim();

    localStorage.setItem('usuario', JSON.stringify(usuario));

    // Perfil inicial del estudiante (esto es lo que se ve/edita en panel.html)
    const perfil = {
        nombre: usuario.nombre,
        carrera: carrera,
        descripcion: "Estudiante interesado en pasantías.",
        imagen: "assets/images/perfil.png"
    };
    localStorage.setItem('perfil', JSON.stringify(perfil));

    alert('¡Cuenta creada exitosamente!');
    window.location.href = 'login.html';
});