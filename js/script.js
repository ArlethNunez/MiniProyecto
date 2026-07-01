let pasantias = []


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

const filtroArea        = document.getElementById("filtroArea")
const filtroModalidad   = document.getElementById("filtroModalidad")
const filtroProvincia   = document.getElementById("filtroProvincia")
const btnLimpiarFiltros = document.getElementById("btnLimpiarFiltros")


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

function yaPostulado(id) {
    return obtenerPostulaciones().some(function (p) { return p.id === id })
}

function crearBotonPostulacion(pasantia, disponibles) {
    const sesionActiva = localStorage.getItem('sesionActiva') === 'true'

    if (!sesionActiva) {
        return `<a class="btn-card" href="login.html">Iniciá sesión para postularte</a>`
    }
    if (disponibles === 0) {
        return `<button class="btn-card btn-card-disabled" disabled>Sin cupos</button>`
    }
    if (yaPostulado(pasantia.id)) {
        return `<button class="btn-card btn-card-disabled" disabled>Ya postulado ✓</button>`
    }
    return `<button class="btn-card" onclick="postularse(${pasantia.id})">Postularme</button>`
}

function postularse(id) {
    const sesionActiva = localStorage.getItem('sesionActiva') === 'true'
    if (!sesionActiva) {
        window.location.href = 'login.html'
        return
    }

    const pasantia = pasantias.find(function (p) { return p.id === id })
    if (!pasantia) return

    const disponibles = calcularDisponibles(pasantia)
    if (disponibles <= 0) {
        alert('Ya no hay cupos disponibles para esta pasantía.')
        return
    }

    if (yaPostulado(id)) {
        alert('Ya te postulaste a esta pasantía.')
        return
    }

    const postulaciones = obtenerPostulaciones()
    postulaciones.push({
        id: pasantia.id,
        puesto: pasantia.puesto,
        empresa: pasantia.empresa,
        area: pasantia.area,
        modalidad: pasantia.modalidad,
        provincia: pasantia.provincia,
        estado: "En revisión",
        fecha: new Date().toISOString()
    })
    guardarPostulaciones(postulaciones)

    const extra = obtenerInscritosExtra()
    extra[id] = (extra[id] || 0) + 1
    guardarInscritosExtra(extra)

    alert(`¡Te postulaste a "${pasantia.puesto}"! Podés ver el estado en tu perfil.`)

    filtrarPasantias()
}





// ─── Helpers de cálculo ──────────────────────────────────────────────────────

function calcularDisponibles(pasantia) {
    const extra = obtenerInscritosExtra()
    const inscritosExtra = extra[pasantia.id] || 0
    return pasantia.cuposTotales - pasantia.inscritos - inscritosExtra
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

    const areas       = obtenerValoresUnicos(activas, "area")
    const modalidades = obtenerValoresUnicos(activas, "modalidad")
    const provincias   = obtenerValoresUnicos(activas, "provincia")

    cargarOpcionesSelect(filtroArea, areas)
    cargarOpcionesSelect(filtroModalidad, modalidades)
    cargarOpcionesSelect(filtroProvincia, provincias)
}

// ─── Creación de tarjeta ─────────────────────────────────────────────────────

function crearTarjetaPasantia(pasantia) {
    const disponibles = calcularDisponibles(pasantia)
    const estado      = obtenerEstadoPasantia(pasantia)
    const claseEstado = obtenerClaseEstado(pasantia)

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
            ${crearBotonPostulacion(pasantia, disponibles)}
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

// ─── Filtrar (selects de área / modalidad / provincia) ───────────────────────

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

// ─── Listeners de filtros ──────────────────────────────────────────────────────

filtroArea?.addEventListener("change", filtrarPasantias)
filtroModalidad?.addEventListener("change", filtrarPasantias)
filtroProvincia?.addEventListener("change", filtrarPasantias)
btnLimpiarFiltros?.addEventListener("click", limpiarFiltros)

// ─── Búsqueda (barra de búsqueda del header, solo en pasantias.html) ──────────
// Filtra las tarjetas del contenedor dinámico (#contenedorPasantias) y hace
// scroll automático hasta la sección donde quedan renderizados los resultados,
// en vez de mostrarlos en un modal aparte.

function buscarPasantia() {
    const inputBuscar = document.getElementById("buscar")
    if (!inputBuscar) return

    const texto = inputBuscar.value.toLowerCase().trim()

    if (texto === "") {
        alert("Ingrese algo para buscar")
        return
    }

    const resultados = obtenerPasantiasActivas().filter(function (p) {
        return (
            p.puesto.toLowerCase().includes(texto) ||
            p.empresa.toLowerCase().includes(texto) ||
            p.area.toLowerCase().includes(texto) ||
            p.provincia.toLowerCase().includes(texto) ||
            p.habilidades.some(function (h) { return h.toLowerCase().includes(texto) })
        )
    })

    // Reseteamos los selects para que no compitan con el resultado de la búsqueda
    if (filtroArea)      filtroArea.value = ""
    if (filtroModalidad) filtroModalidad.value = ""
    if (filtroProvincia) filtroProvincia.value = ""

    renderizarPasantias(resultados)

    if (resultados.length === 0) {
        mensajePasantias.textContent = `No se encontraron pasantías para "${inputBuscar.value}".`
    } else {
        mensajePasantias.textContent = `Se encontraron ${resultados.length} pasantía(s) para "${inputBuscar.value}".`
    }

    // Llevamos al usuario directo a donde quedaron las tarjetas filtradas
    const seccionExplorar = document.getElementById("explorar-pasantias")
    if (seccionExplorar) {
        seccionExplorar.scrollIntoView({ behavior: "smooth", block: "start" })
    }
}

// ─── Sesión ────────────────────────────────────────────────────────────────

function cerrarSesion() {
    localStorage.removeItem('sesionActiva')
    window.location.href = 'index.html'
}

function actualizarAccionesSesion() {
    const contenedor = document.getElementById("accionesSesion")
    if (!contenedor) return

    if (localStorage.getItem('sesionActiva') === 'true') {
        contenedor.innerHTML = `<button class="btn-secondary" onclick="cerrarSesion()">Cerrar sesión</button>`
    }
}

// ─── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", async function () {
    actualizarAccionesSesion()
    if (!document.getElementById("contenedorPasantias")) return
    await cargarPasantias()
    cargarFiltros()
    renderizarPasantias(obtenerPasantiasActivas())
})