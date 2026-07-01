
// ─── Perfil del usuario (localStorage) ──────────────────────────────────────

function obtenerPerfil() {
    return JSON.parse(localStorage.getItem('perfil')) || {
        nombre: "Estudiante",
        carrera: "Sin especificar",
        descripcion: "Todavía no completaste tu descripción.",
        imagen: "assets/images/perfil.png"
    }
}

function guardarPerfilEnStorage(perfil) {
    localStorage.setItem('perfil', JSON.stringify(perfil))
}

function cargarPerfilEnPantalla() {
    const perfil = obtenerPerfil()

    document.getElementById("nombrePerfil").textContent = perfil.nombre
    document.getElementById("carreraPerfil").textContent = perfil.carrera
    document.getElementById("fotoPerfil").src = perfil.imagen

    // Precarga los inputs del panel de edición también
    document.getElementById("nombre").value = perfil.nombre
    document.getElementById("carrera").value = perfil.carrera
    document.getElementById("descripcion").value = perfil.descripcion
}

function cambiarFoto() {
    document.getElementById("fotoInput").click()
}

document.getElementById("fotoInput").addEventListener("change", function () {
    if (this.files.length === 0) return

    const archivo = this.files[0]
    const lector = new FileReader()

    lector.onload = function (e) {
        const perfil = obtenerPerfil()
        perfil.imagen = e.target.result // base64 de la imagen
        guardarPerfilEnStorage(perfil)

        document.getElementById("fotoPerfil").src = perfil.imagen
    }

    lector.readAsDataURL(archivo)
})


// Disponibilidad
let disponible = true;

// ─── Postulaciones (localStorage) ───────────────────────────────────────────

function obtenerPostulaciones() {
    return JSON.parse(localStorage.getItem('postulaciones')) || []
}

function guardarPostulaciones(lista) {
    localStorage.setItem('postulaciones', JSON.stringify(lista))
}

function obtenerInscritosExtra() {
    return JSON.parse(localStorage.getItem('inscritosExtra')) || {}
}

function guardarInscritosExtra(obj) {
    localStorage.setItem('inscritosExtra', JSON.stringify(obj))
}

function renderizarPostulaciones() {
    const postulaciones = obtenerPostulaciones()
    const tbody = document.getElementById('postulacionesBody')
    const numPostulaciones = document.getElementById('numPostulaciones')
    if (!tbody) return

    tbody.innerHTML = ""

    if (numPostulaciones) {
        numPostulaciones.textContent = postulaciones.length
    }

    if (postulaciones.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4">Todavía no te postulaste a ninguna pasantía.</td></tr>`
        return
    }

    for (const p of postulaciones) {
        const fila = document.createElement('tr')
        fila.innerHTML = `
            <td>${p.empresa}</td>
            <td>${p.puesto}</td>
            <td>${p.estado}</td>
            <td><button onclick="cancelarPostulacion(${p.id})" class="btn-secondary">Cancelar</button></td>
        `
        tbody.appendChild(fila)
    }
}

function cancelarPostulacion(id) {
    if (!confirm('¿Seguro que querés cancelar esta postulación?')) return

    const postulaciones = obtenerPostulaciones().filter(function (p) { return p.id !== id })
    guardarPostulaciones(postulaciones)

    const extra = obtenerInscritosExtra()
    if (extra[id]) {
        extra[id] = Math.max(0, extra[id] - 1)
        guardarInscritosExtra(extra)
    }

    renderizarPostulaciones()
}


function cambiarDisponibilidad() {

    const estado = document.getElementById("estadoDisponibilidad");

    if (disponible) {
        estado.textContent = "No disponible";
    } else {
        estado.textContent = "Disponible para pasantías";
    }

    disponible = !disponible;
}

// Subir CV
function subirCV() {
    document.getElementById("cvInput").click();
}

document.getElementById("cvInput").addEventListener("change", function () {

    if (this.files.length > 0) {

        const archivo = this.files[0];

        document.getElementById("cvSubido").textContent =
            "CV cargado: " + archivo.name;

        localStorage.setItem("cvNombre", archivo.name);

        alert("CV cargado correctamente");
    }

});

// Mostrar/Ocultar panel de edición
function mostrarEditarPerfil() {

    const panel = document.getElementById("editarPerfilPanel");

    if (panel.style.display === "block") {
        panel.style.display = "none";
    } else {
        panel.style.display = "block";
    }

}

// Guardar cambios del perfil
function guardarPerfil() {

    const perfil = obtenerPerfil()
    perfil.nombre = document.getElementById("nombre").value.trim()
    perfil.carrera = document.getElementById("carrera").value.trim()
    perfil.descripcion = document.getElementById("descripcion").value.trim()

    guardarPerfilEnStorage(perfil)

    document.getElementById("nombrePerfil").textContent = perfil.nombre
    document.getElementById("carreraPerfil").textContent = perfil.carrera

    alert("Perfil actualizado correctamente")

    document.getElementById("editarPerfilPanel").style.display = "none"
    const habilidadesTexto =
        document.getElementById("habilidadesInput").value;

    const habilidades =
        habilidadesTexto.split(",");

    const lista =
        document.getElementById("listaHabilidades");

    lista.innerHTML = "";

    habilidades.forEach(h => {

        lista.innerHTML += `
        <li>${h.trim()}</li>
    `;

    });
}



// Mostrar/Ocultar chat
function abrirChat() {

    const chat = document.getElementById("chatPanel");

    if (chat.style.display === "block") {

        chat.style.display = "none";

    } else {

        chat.style.display = "block";

        chat.scrollIntoView({
            behavior: "smooth"
        });

    }

}

// Enviar mensaje
function enviarMensaje() {

    const input = document.getElementById("mensajeInput");

    const texto = input.value.trim();

    if (texto === "") {
        return;
    }

    const mensajes = document.getElementById("mensajesChat");

    mensajes.innerHTML += `
        <div class="mensaje">
            <strong>Vos:</strong> ${texto}
        </div>
    `;

    input.value = "";

    mensajes.scrollTop = mensajes.scrollHeight;
}

// Simulación de visualizaciones
setInterval(() => {

    const vistas = document.getElementById("vistas");

    let cantidad = parseInt(vistas.textContent);

    vistas.textContent = cantidad + 1;

}, 15000);

cargarPerfilEnPantalla()
renderizarPostulaciones()

const cvGuardado = localStorage.getItem("cvNombre");

if (cvGuardado) {
    document.getElementById("cvSubido").textContent =
        "CV cargado: " + cvGuardado;
}