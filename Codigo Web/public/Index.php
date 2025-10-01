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
        <h2>Bienvenido</h2>
        <p>
            Tu visión, nuestra misión. Encuentra los mejores lentes y servicios para
            el cuidado visual.
        </p>
        <?php
            // Ejemplo: insertar contenido dinámico desde PHP
            echo "<p>Hoy es " . date("d-m-Y") . "</p>";
        ?>


        <!-- Nueva sección de servicios -->
        <section class="servicios">
            <h3>Servicios</h3>
            <div class="lista-servicios">
                <div class="servicio">
                    <h4>Examen de la vista</h4>
                    <p>Realizado por profesionales con equipo especializado.</p>
                </div>
                <div class="servicio">
                    <h4>Adaptación de lentes</h4>
                    <p>Lentes a tu medida con asesoría personalizada.</p>
                </div>
                <div class="servicio">
                    <h4>Reparación de armazones</h4>
                    <p>Arreglos rápidos y económicos.</p>
                </div>
            </div>
        </section>

        <!-- Bloque de mapa 
        <div class="mapa">
            <h3>Encuéntranos aquí</h3>
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.869794684516!2d-103.30243652568772!3d20.674875599840995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428b1635c0fdaff%3A0x63e7e1546483456f!2s%C3%93PTICA%20BARBA!5e0!3m2!1ses-419!2smx!4v1752955289213!5m2!1ses-419!2smx"
                width="100%" 
                height="350" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy">
            </iframe>
        </div>-->


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
