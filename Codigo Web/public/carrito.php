<?php
// index.php
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pagina principal</title>
    
    <link rel="stylesheet" href="CSS/style_public_index.css">
</head>
<body>
    <!-- Header con menú -->
    <header>
        <h1>Óptica Barba</h1>
        <nav>
            <a href="Index.php">Inicio</a>
            <a href="carrito.php">Carrito</a>
            <a href="ubicacion.php">Ubicación</a>
            <a href="contacto.php">Contacto</a>
        </nav>
    </header>

    <!-- Contenido principal -->
    <div class="contenido">
        <!-- Productos destacados -->
        <section class="productos">
            <h3>Productos Destacados</h3>
            <div class="catalogo">
                <article class="producto">
                    <img src="images/lentes1.jpg" alt="Lentes de sol" />
                    <h4>Lentes de Sol</h4>
                    <p class="precio">$500 MXN</p>
                    <button onclick="location.href='productos.php'">Ver más</button>
                </article>
                <article class="producto">
                    <img src="images/lentes3.webp" alt="Lentes de contacto" />
                    <h4>Lentes de Contacto</h4>
                    <p class="precio">$800 MXN</p>
                    <button onclick="location.href='productos.php'">Ver más</button>
                </article>
                <article class="producto">
                    <img src="images/armazonestandar.jpeg" alt="Armazón clásico" />
                    <h4>Armazón Clásico</h4>
                    <p class="precio">$1,200 MXN</p>
                    <button onclick="location.href='productos.php'">Ver más</button>
                </article>
                <article class="producto">
                    <img src="images/lentesprogresivos.jpg" alt="Lentes progresivos" />
                    <h4>Lentes Progresivos</h4>
                    <p class="precio">$2,000 MXN</p>
                    <button onclick="location.href='productos.php'">Ver más</button>
                </article>
            </div>
        </section>

        <!-- Botón flotante de WhatsApp -->
        <a href="https://wa.me/5210000000000?20quisiera%20más%20información" 
            class="whatsapp-float" 
            target="_blank" 
            aria-label="Chat en WhatsApp">
            <img src="https://cdn-icons-png.flaticon.com/512/124/124034.png" alt="WhatsApp" />
        </a>

    </div>

    <!-- Footer -->
    <footer>
        <p>&copy; <?php echo date("Y"); ?> Óptica Barba - Todos los derechos reservados</p>
    </footer>
</body>
</html>
