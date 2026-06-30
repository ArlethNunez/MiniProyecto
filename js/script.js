async function buscarPasantia() {
    let texto = document.getElementById("buscar").value.toLowerCase().trim();

    if (texto.trim() === "") {
        alert("Ingrese algo para buscar");
        return;
    }
    try {
        const respuesta = await fetch("data/pasantias.json");
        const pasantias = await respuesta.json();

        const resultados = pasantias.filter(pasantia =>
            pasantia.puesto.toLowerCase().includes(texto) ||
            pasantia.empresa.toLowerCase().includes(texto) ||
            pasantia.area.toLowerCase().includes(texto) ||
            pasantia.provincia.toLowerCase().includes(texto) ||
            pasantia.habilidades.some(habilidad => habilidad.toLowerCase().includes(texto))

        );
        mostrarResultados(resultados);

    } catch (error) {
        console.error("Error al cargar las pasantías: ", error);
    }

}
function mostrarResultados(resultados) {

    const contenedor = document.getElementById("resultadosModal");

    contenedor.innerHTML = "";

    if (resultados.length === 0) {

        contenedor.innerHTML =
            "<p>No se encontraron pasantías que coincidan con la búsqueda.</p>";

        document.getElementById("modalBusqueda").style.display = "flex";

        return;
    }

    resultados.forEach(p => {

        contenedor.innerHTML += `
            <div class="resultado-card">

                <img src="${p.imagen}" alt="${p.puesto}">

                <h3>${p.puesto}</h3>

                <p><strong>Empresa:</strong> ${p.empresa}</p>

                <p><strong>Área:</strong> ${p.area}</p>

                <p><strong>Provincia:</strong> ${p.provincia}</p>

                <p><strong>Modalidad:</strong> ${p.modalidad}</p>

                <p><strong>Habilidades:</strong>
                ${p.habilidades.join(", ")}</p>

            </div>
        `;
    });

    document.getElementById("modalBusqueda").style.display = "flex";
}
function cerrarModal() {
    document.getElementById("modalBusqueda").style.display = "none";
}