function buscarPasantia() {
    let texto = document.getElementById("buscar").value;

    if (texto.trim() === "") {
        alert("Ingrese algo para buscar");
        return;
    }

    alert("Buscando: " + texto);
}
