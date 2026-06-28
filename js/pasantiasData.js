let pasantias = []

// Carga el JSON de pasantías desde la carpeta data/
async function cargarPasantias() {
    try {
        const respuesta = await fetch("data/pasantias.json")
        pasantias = await respuesta.json()
        console.log("Pasantías cargadas:", pasantias)
    } catch (error) {
        console.error("Error al cargar pasantías:", error)
    }
}

// Referencias al DOM
const contenedorPasantias = document.getElementById("contenedorPasantias")
const mensajePasantias    = document.getElementById("mensajePasantias")

const filtroArea       = document.getElementById("filtroArea")
const filtroModalidad  = document.getElementById("filtroModalidad")
const filtroProvincia  = document.getElementById("filtroProvincia")
const btnLimpiarFiltros = document.getElementById("btnLimpiarFiltros")

// ─── Helpers de cálculo ──────────────────────────────────────────────────────

function calcularDisponibles(pasantia) {
    return pasantia.cuposTotales - pasantia.inscritos
}

function obtenerEstadoPasantia(pasantia) {
    const disponibles = calcularDisponibles(pasantia)
    if (disponibles === 0)  return "Sin cupos"
    if (disponibles <= 2)   return "Pocos cupos"
    return "Disponible"
}

function obtenerClaseEstado(pasantia) {
    const disponibles = calcularDisponibles(pasantia)
    if (disponibles === 0)  return "state-danger"
    if (disponibles <= 2)   return "state-warning"
    return "state-success"
}

// ─── Filtrado y opciones ─────────────────────────────────────────────────────

function obtenerPasantiasActivas() {
    return pasantias.filter(function (p) {
        return p.activo
    })
}

function obtenerValoresUnicos(lista, propiedad) {
    const valores = []
    for (const item of lista) {
        if (!valores.includes(item[propiedad])) {
            valores.push(item[propiedad])
        }
    }
    return valores
}

function cargarOpcionesSelect(select, opciones) {
    for (const opcion of opciones) {
        const option = document.createElement("option")
        option.value = opcion
        option.textContent = opcion
        select.appendChild(option)
    }
}

function cargarFiltros() {
    const activas = obtenerPasantiasActivas()

    const areas      = obtenerValoresUnicos(activas, "area")
    const modalidades = obtenerValoresUnicos(activas, "modalidad")
    const provincias  = obtenerValoresUnicos(activas, "provincia")

    cargarOpcionesSelect(filtroArea, areas)
    cargarOpcionesSelect(filtroModalidad, modalidades)
    cargarOpcionesSelect(filtroProvincia, provincias)
}

// ─── Creación de tarjeta ─────────────────────────────────────────────────────

function crearTarjetaPasantia(pasantia) {
    const disponibles  = calcularDisponibles(pasantia)
    const estado       = obtenerEstadoPasantia(pasantia)
    const claseEstado  = obtenerClaseEstado(pasantia)

    const tarjeta = document.createElement("article")
    tarjeta.classList.add("event-card")

    tarjeta.innerHTML = `
        <span class="card-label">${estado}</span>
        <figure>
            <img src="${pasantia.imagen}" alt="Imagen de pasantía: ${pasantia.puesto}">
            <figcaption>${pasantia.puesto} — ${pasantia.provincia}</figcaption>
        </figure>
        <div class="event-card-content">
            <span class="event-category">${pasantia.area}</span>
            <h3>${pasantia.puesto}</h3>
            <p><b>Empresa:</b> ${pasantia.empresa}</p>
            <p><b>Modalidad:</b> ${pasantia.modalidad} · ${pasantia.provincia}</p>
            <p class="state-box ${claseEstado}">
                ${disponibles > 0 ? disponibles + " cupos disponibles" : "Sin cupos disponibles"}
            </p>
            <div class="event-tags" style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px;">
                ${pasantia.habilidades.map(function (h) {
                    return `<span style="background:#DDEEF8; color:var(--azul-medio); padding:3px 10px; border-radius:20px; font-size:0.78rem; font-weight:600;">${h}</span>`
                }).join("")}
            </div>
            <a class="btn-card ${disponibles === 0 ? "btn-card-disabled" : ""}" href="#tabla-pasantias">
                Ver detalles
            </a>
        </div>
    `
    return tarjeta
}

// ─── Render ──────────────────────────────────────────────────────────────────

function renderizarPasantias(lista) {
    contenedorPasantias.innerHTML = ""

    if (lista.length === 0) {
        mensajePasantias.textContent = "No se encontraron pasantías con los filtros seleccionados."
        contenedorPasantias.innerHTML = `
            <div class="empty-state">
                <h3>Sin resultados</h3>
                <p>Probá con otra área, modalidad o provincia. Las publicaciones se actualizan cada semana.</p>
            </div>
        `
        return
    }

    mensajePasantias.textContent = `Mostrando ${lista.length} pasantía(s) activa(s).`

    for (const pasantia of lista) {
        const tarjeta = crearTarjetaPasantia(pasantia)
        contenedorPasantias.appendChild(tarjeta)
    }
}

// ─── Filtrar ─────────────────────────────────────────────────────────────────

function filtrarPasantias() {
    const areaSeleccionada      = filtroArea.value
    const modalidadSeleccionada = filtroModalidad.value
    const provinciaSeleccionada = filtroProvincia.value

    const filtradas = pasantias.filter(function (p) {
        const cumpleActivo    = p.activo
        const cumpleArea      = areaSeleccionada      === "" || p.area      === areaSeleccionada
        const cumpleModalidad = modalidadSeleccionada === "" || p.modalidad === modalidadSeleccionada
        const cumpleProvincia = provinciaSeleccionada === "" || p.provincia === provinciaSeleccionada

        return cumpleActivo && cumpleArea && cumpleModalidad && cumpleProvincia
    })

    renderizarPasantias(filtradas)
}

function limpiarFiltros() {
    filtroArea.value      = ""
    filtroModalidad.value = ""
    filtroProvincia.value = ""
    filtrarPasantias()
}

// ─── Listeners ───────────────────────────────────────────────────────────────

filtroArea.addEventListener("change", filtrarPasantias)
filtroModalidad.addEventListener("change", filtrarPasantias)
filtroProvincia.addEventListener("change", filtrarPasantias)
btnLimpiarFiltros.addEventListener("click", limpiarFiltros)

function buscarPasantia() {
    const termino = document.getElementById("buscar").value.toLowerCase().trim()
    const filtradas = obtenerPasantiasActivas().filter(function (p) {
        return (
            p.puesto.toLowerCase().includes(termino) ||
            p.empresa.toLowerCase().includes(termino) ||
            p.area.toLowerCase().includes(termino)
        )
    })
    renderizarPasantias(filtradas)
    document.getElementById("explorar-pasantias")?.scrollIntoView({ behavior: "smooth" })
}


// ─── Init ─────────────────────────────────────────────────────────────────────


document.addEventListener("DOMContentLoaded", async function () {
    if (!document.getElementById("contenedorPasantias")) return 
    await cargarPasantias()
    cargarFiltros()
    renderizarPasantias(obtenerPasantiasActivas())
})