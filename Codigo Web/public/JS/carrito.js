function agregarAlCarrito(nombre, precio, cantidadId) {
    const cantidad = parseInt(document.getElementById(cantidadId).value);
    if (isNaN(cantidad) || cantidad <= 0) {
        alert("Por favor, introduce una cantidad válida.");
        return;
    }

    // Obtenemos el carrito existente o uno nuevo
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Buscamos si el producto ya está en el carrito
    const index = carrito.findIndex(item => item.nombre === nombre);

    if (index !== -1) {
        // Si ya existe, sumamos la cantidad
        carrito[index].cantidad += cantidad;
    } else {
        // Si no existe, lo agregamos
        carrito.push({
            nombre: nombre,
            precio: precio,
            cantidad: cantidad
        });
    }

    // Guardamos el carrito actualizado
    localStorage.setItem("carrito", JSON.stringify(carrito));

    alert(`Se agregaron ${cantidad} "${nombre}" al carrito.`);
}


function cargarCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const contenedor = document.getElementById("carrito-container");
    const totalElem = document.getElementById("total");

    contenedor.innerHTML = ""; // Limpiar contenido anterior

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>Tu carrito está vacío.</p>";
        totalElem.textContent = "";
        return;
    }

    let total = 0;

    carrito.forEach((producto, index) => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        const item = document.createElement("div");
        item.className = "item-carrito";
        item.innerHTML = `
            <p><strong>${producto.nombre}</strong></p>
            <p>Cantidad: ${producto.cantidad}</p>
            <p>Precio unitario: $${producto.precio}</p>
            <p>Subtotal: $${subtotal}</p>
            <button onclick="eliminarProducto(${index})">Eliminar</button>
            <hr>
        `;
        contenedor.appendChild(item);
    });

    totalElem.textContent = `Total: $${total}`;
}

function eliminarProducto(indice) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.splice(indice, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    cargarCarrito();
}

function vaciarCarrito() {
    if (confirm("¿Estás seguro de que deseas vaciar el carrito?")) {
        localStorage.removeItem("carrito");
        cargarCarrito();
    }
}

// Cargar al iniciar
document.addEventListener("DOMContentLoaded", () => {
    cargarCarrito();
});

