<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="CSS/style_login.css">
    <script src="JS/login.js"></script>
</head>
<body>
    <div class="container">
        
        <div class="login-box">
            <h2>Iniciar Sesión</h2>
            <form id="login-form">
                <label>Usuario:</label>
                <input id="username" type="text" name="username" required><br><br>

                <label>Contraseña:</label>
                <input id="password" type="password" name="password" required><br><br>

                <button type="submit">Ingresar</button>
            </form>

            <p id="message" style="color:red;"></p>

        </div>
    </div>
</body>
</html>
