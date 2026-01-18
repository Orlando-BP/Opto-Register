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
        <!-- Información de contacto -->
        <section class="contacto">
            <h3>Información de contacto</h3>
            <p><strong>Teléfono:</strong> <a href="tel:+523312345678">+52 33 1122 3344</a></p>
            <p><strong>Email:</strong> <a href="mailto:ci.sm@gmail.com">ci.sm@gmail.com</a></p>
            <p>
                <strong>Dirección:</strong>
                <a href="https://maps.app.goo.gl/5vpah66tciaw21kY8" target="_blank">
                    C. Pablo Valdez 2613, San Isidro, 44740 Guadalajara, Jal.
                </a>
            </p>
            <p><strong>Horario:</strong> Lun-Vie 11:00 - 14:00, 16:30 - 19:30 | Sáb 11:00 - 14:00</p>

            <a class="whatsapp-btn" href="https://wa.me/523311437215" target="_blank">
                Enviar WhatsApp
            </a>
        </section>

        <!-- Formulario de contacto -->
        <section class="formulario-contacto">
            <h3>O envíanos una notificación para contactarte por correo</h3>
            <form action="procesar_correo.php" method="POST">
                <label for="nombre">Nombre:</label>
                <input type="text" name="nombre" id="nombre" required>

                <label for="email">Email:</label>
                <input type="email" name="email" id="email" required>

                <label for="mensaje">Mensaje:</label>
                <textarea name="mensaje" id="mensaje" rows="4" required></textarea>

                <button type="submit">Enviar</button>
            </form>
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
