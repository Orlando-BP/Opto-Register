<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "optica_barba_bd"; // Cambia por el nombre real de tu base

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

$resultado = $conn->query("SELECT * FROM productos_vista");
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Productos - Óptica Barba</title>
    <link rel="stylesheet" href="../CSS/style_public.css">
    <script src="../JS/carrito.js"></script>
</head>
<body>
    <header>
        <div class="menu-izquierda">
            <h1>Óptica Barba</h1>
        </div>
        <div class="menu-derecha">
            <a href="carrito.html"><img src="../images/carrito.png" alt="Carrito"></a>
            <a href="https://maps.app.goo.gl/pdPdtgtNMXVrzqBf9?g_st=aw"><img src="../images/ubicacion.png" alt="Ubicación"></a>
            <a href="contacto.html"><img src="../images/contacto.png" alt="Contacto"></a>
        </div>
    </header>

    <main>
        <h2>Productos Disponibles</h2>
        <section class="catalogo">
            <?php 
            while($fila = $resultado->fetch_assoc()): ?>
                <article class="producto">
                    <img src="<?= htmlspecialchars($fila['img']) ?>" alt="<?= htmlspecialchars($fila['nombre']) ?>">
                    <h3><?= htmlspecialchars($fila['nombre']) ?></h3>
                    <p><?= htmlspecialchars($fila['descripcion']) ?></p>
                    <p><strong>Precio:</strong> $<?= number_format($fila['precio'], 2) ?> MXN</p>
                    <label for="cantidad-<?= $fila['id'] ?>">Cantidad:</label>
                    <input type="number" id="cantidad-<?= $fila['id'] ?>" name="cantidad" min="1" max="10" value="1">
                    <button onclick="agregarAlCarrito('<?= htmlspecialchars($fila['nombre']) ?>', <?= $fila['precio'] ?>, 'cantidad-<?= $fila['id'] ?>')">
                        Agregar al carrito
                    </button>
                </article>
            <?php endwhile; ?>
        </section>
    </main>

    <footer>
        <p>&copy; 2025 Óptica Barba</p>
    </footer>
</body>
</html>

<?php
$conn->close();
?>