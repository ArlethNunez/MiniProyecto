async function buscarPasantia() {
    let texto = document.getElementById("buscar").value.toLowerCase().trim();

    if (texto.trim() === "") {
        alert("Ingrese algo para buscar");
        return;
    }
    try{
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

    }catch(error){
        console.error("Error al cargar las pasantías: ", error);
    }

    function mostrarResultados(resultados) {
    const contenedor = document.getElementById("resultadosBusqueda");

    contenedor.innerHTML = "";

    if (resultados.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron resultados.</p>";
        return;
    }

    resultados.forEach(p => {
        contenedor.innerHTML += `
            <article class="card-pasantia">
                <img src="${p.imagen}" alt="${p.puesto}">
                <h3>${p.puesto}</h3>
                <p>${p.empresa}</p>
                <p>${p.provincia}</p>
                <p>${p.modalidad}</p>
            </article>
        `;
    });
}

}
