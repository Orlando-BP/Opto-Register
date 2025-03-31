<?php session_start(); ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="stylesheet" href="CSS/style_login.css">
    <script defer src="JS/slider.js"></script>
</head>
<body>
    <div class="container">
        <!-- Galería de imágenes -->
        <div class="gallery">
            <button class="prev" onclick="moveSlide(-1)">&#10094;</button>
            <div class="slider">
                <img class="slide" src="images/opticas1.jpg" alt="Imagen 1">
                <img class="slide" src="images/opticas2.jpg" alt="Imagen 2" style="display:none;">
                <img class="slide" src="images/opticas3.jpg" alt="Imagen 3" style="display:none;">
            </div>
            <button class="next" onclick="moveSlide(1)">&#10095;</button>
        </div>
        
        <!-- Formulario de inicio de sesión -->
        <div class="login-box">
            <h2>Iniciar Sesión</h2>
            <?php if (isset($_SESSION['error'])): ?>
                <p style="color:red;"> <?php echo $_SESSION['error']; unset($_SESSION['error']); ?> </p>
            <?php endif; ?>
            <form action="login.php" method="POST">
                <label>Usuario:</label>
                <input type="text" name="username" required><br><br>
                <label>Contraseña:</label>
                <input type="password" name="password" required><br><br>
                <button type="submit">Ingresar</button>
            </form>
        </div>
    </div>
</body>
</html>
