// Disponibilidad
let disponible = true;

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

        alert("CV cargado correctamente: " + archivo.name);

        localStorage.setItem("cvNombre", archivo.name);
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

    const nombre = document.getElementById("nombre").value;
    const carrera = document.getElementById("carrera").value;

    document.getElementById("nombrePerfil").textContent = nombre;
    document.getElementById("carreraPerfil").textContent = carrera;

    alert("Perfil actualizado correctamente");

    document.getElementById("editarPerfilPanel").style.display = "none";
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