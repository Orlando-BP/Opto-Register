<?php
session_start();
if (!isset($_SESSION['user'])) {
    header("Location: index.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Dashboard</title>
        <link rel="stylesheet" href="CSS/style_admin.css">
    </head>
    <body>
        <h2>Bienvenido, <?php echo $_SESSION['user']; ?>!</h2>
        <a href="logout.php">Cerrar sesión</a>
        <hr>
        <div class="tabs">
            <button class="tablink" onclick="openTab(event, 'productos')">Productos</button>
            <button class="tablink" onclick="openTab(event, 'correos')">Correos</button>
        </div>
        <div id="productos" class="tabcontent" style="display:block;">
            <h3>Gestión de Productos</h3>
            <form id="form-producto" method="post" action="registroProducto.php">
                <label>Tipo:</label>
                <input type="text" name="tipo" required>
                <label>Material:</label>
                <input type="text" name="material">
                <label>Armazón:</label>
                <input type="text" name="armazon">
                <label>Color:</label>
                <input type="text" name="color">
                <label>Tamaño:</label>
                <input type="text" name="tamano">
                <label>Observaciones:</label>
                <input type="text" name="observaciones">
                <button type="submit">Registrar Producto</button>
            </form>
            <table id="tabla-productos">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tipo</th>
                        <th>Material</th>
                        <th>Armazón</th>
                        <th>Color</th>
                        <th>Tamaño</th>
                        <th>Observaciones</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Aquí se cargarán los productos desde la base de datos -->
                </tbody>
            </table>
        </div>
        <div id="correos" class="tabcontent" style="display:none;">
            <h3>Gestión de Correos</h3>
            <form id="form-correo" method="post" action="registroCorreo.php">
                <label>Nombre:</label>
                <input type="text" name="nombre" required>
                <label>Correo:</label>
                <input type="email" name="correo" required>
                <label>Teléfono:</label>
                <input type="text" name="telefono">
                <button type="submit">Registrar Correo</button>
            </form>
            <table id="tabla-correos">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Aquí se cargarán los correos desde la base de datos -->
                </tbody>
            </table>
        </div>
        <style>
            
        </style>
        <script>
            function openTab(evt, tabName) {
                var i, tabcontent, tablinks;
                tabcontent = document.getElementsByClassName("tabcontent");
                for (i = 0; i < tabcontent.length; i++) {
                    tabcontent[i].style.display = "none";
                }
                tablinks = document.getElementsByClassName("tablink");
                for (i = 0; i < tablinks.length; i++) {
                    tablinks[i].classList.remove("active");
                }
                document.getElementById(tabName).style.display = "block";
                evt.currentTarget.classList.add("active");
            }
            // Mostrar la primera pestaña por defecto
            document.addEventListener('DOMContentLoaded', function() {
                document.querySelector('.tablink').classList.add('active');
                document.getElementById('productos').style.display = 'block';
            });
        </script>
    </body>
</html>
